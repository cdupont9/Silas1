
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation, MapPin, X, User, Compass, Heart, Star, ArrowRight, Coffee, ShoppingBag, Utensils, Mountain, Locate, Footprints } from 'lucide-react';
import { SilasLogo } from '../SilasApp';

interface MapsAppProps {
  onClose: () => void;
}

interface Landmark {
    id: string;
    x: number;
    y: number;
    name: string;
    type: 'historic' | 'food' | 'park' | 'shop';
    image: string;
    address: string;
    silasTip?: string;
}

// --- WORLD CONSTANTS ---
const WORLD_SIZE = 4000;
const BLOCK_SIZE = 250;
const ROAD_WIDTH = 100;

// Generate City Grid with "Main Street" Logic
const CITY_GRID = Array.from({ length: 64 }).map((_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const height = 40 + Math.random() * 120; // Lower buildings for cleaner map look
    
    // Create a gap for a main avenue
    let xOffset = 0;
    if (col > 3) xOffset = ROAD_WIDTH * 1.5;

    return {
        id: i,
        x: (col * (BLOCK_SIZE + ROAD_WIDTH)) - 1400 + xOffset,
        y: (row * (BLOCK_SIZE + ROAD_WIDTH)) - 1400,
        w: BLOCK_SIZE,
        h: BLOCK_SIZE,
        height,
        color: i % 5 === 0 ? '#e0f2fe' : '#f1f5f9', // Light Blue vs Slate White
        isPark: i === 27 || i === 28 || i === 35 || i === 36
    };
});

// Generate Trees along the main avenue
const TREES = Array.from({ length: 24 }).map((_, i) => ({
    id: `tree-${i}`,
    x: -450 + (i % 2 === 0 ? 0 : 900), // Sides of main street
    y: (i * 200) - 2400,
    scale: 0.8 + Math.random() * 0.4
}));

const VISUAL_LANDMARKS: Landmark[] = [
    { 
        id: 'l1', x: -550, y: -400, name: 'Old Town Library', type: 'historic', 
        address: '88 Main St',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80',
        silasTip: "1904 Architecture. Best quiet spot in the city." 
    },
    { 
        id: 'l2', x: 550, y: 100, name: 'Joe\'s Espresso', type: 'food', 
        address: '102 Market Ave',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
        silasTip: "Try the flat white. Roasted locally." 
    },
    { 
        id: 'l3', x: 50, y: 900, name: 'Memorial Park', type: 'park', 
        address: 'Central District',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&w=400&q=80',
        silasTip: "Cherry blossoms are blooming this week." 
    },
    { 
        id: 'l4', x: -550, y: 500, name: 'Vinyl Heaven', type: 'shop', 
        address: '404 Beat Blvd',
        image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80',
        silasTip: "Ask for 'Big Al' for rare jazz records." 
    },
];

export const MapsApp: React.FC<MapsAppProps> = ({ onClose }) => {
  // View State
  const [viewMode, setViewMode] = useState<'MAP' | 'STREET'>('MAP');
  const [camera, setCamera] = useState({ x: 0, y: 500, zoom: 0.6, rotation: 0, tilt: 0, height: 0 });
  
  // Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<Landmark | null>(null);
  const [userPos, setUserPos] = useState({ x: 0, y: 500 });
  const [isWalking, setIsWalking] = useState(false);
  
  // Animation Refs
  const requestRef = useRef<number>(0);
  const walkOffset = useRef(0);

  // --- CAMERA & MOVEMENT LOGIC ---
  
  useEffect(() => {
      // Transition Camera Styles
      if (viewMode === 'STREET') {
          setCamera(prev => ({ ...prev, zoom: 1.8, tilt: 85, rotation: 0 }));
      } else {
          setCamera(prev => ({ ...prev, zoom: 0.6, tilt: 0, rotation: 0, height: 0 }));
      }
  }, [viewMode]);

  // Main Loop
  useEffect(() => {
      const animate = () => {
          if (viewMode === 'STREET') {
              // Walking Logic
              if (navigatingTo || isWalking) {
                  // If navigating to target
                  let targetX = navigatingTo ? navigatingTo.x : userPos.x;
                  let targetY = navigatingTo ? navigatingTo.y : userPos.y - 1000; // Walk forward if no target

                  const dx = targetX - userPos.x;
                  const dy = targetY - userPos.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  
                  if (dist > 5) {
                      const speed = 6;
                      const moveX = (dx / dist) * speed;
                      const moveY = (dy / dist) * speed;
                      
                      setUserPos(prev => ({ x: prev.x + moveX, y: prev.y + moveY }));
                      
                      // Head Bob Calculation
                      walkOffset.current += 0.15;
                      const bob = Math.sin(walkOffset.current) * 8;
                      setCamera(prev => ({ ...prev, height: bob }));
                  } else {
                      setIsWalking(false);
                  }
              }
          }
          
          // Camera Follows User
          if (viewMode === 'STREET') {
              setCamera(prev => ({ ...prev, x: userPos.x, y: userPos.y + 200 })); // Camera slightly behind/above
          } else {
              // Smooth pan in map mode
              setCamera(prev => ({ 
                  ...prev, 
                  x: prev.x + (userPos.x - prev.x) * 0.1, 
                  y: prev.y + (userPos.y - prev.y) * 0.1 
              }));
          }

          requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
  }, [viewMode, navigatingTo, isWalking, userPos]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const hit = VISUAL_LANDMARKS.find(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())) || VISUAL_LANDMARKS[0];
      setSelectedLandmark(hit);
      setNavigatingTo(hit);
      // setViewMode('STREET'); // Optional: Don't auto switch, let user click walk
  };

  return (
    <div className="absolute inset-0 bg-[#f5f5f5] z-50 flex flex-col font-sans text-slate-900 overflow-hidden">
        
        {/* --- 3D VIEWPORT --- */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#e0e0e0]">
            
            {/* Sky Gradient (Visible in Street Mode) */}
            <div 
                className={`absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 transition-opacity duration-1000 ${viewMode === 'STREET' ? 'opacity-100' : 'opacity-0'}`} 
                style={{ transform: 'translateZ(-1000px)' }}
            />

            <motion.div
                className="absolute origin-center will-change-transform"
                animate={{
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    scale: camera.zoom,
                    rotateX: camera.tilt,
                    rotateZ: -camera.rotation,
                    translateY: viewMode === 'STREET' ? 150 : 0 // Shift horizon down in street view
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 80 }}
                style={{ 
                    width: 0, height: 0, 
                    perspective: 800, 
                    transformStyle: 'preserve-3d' 
                }}
            >
                {/* WORLD CONTAINER */}
                <div 
                    className="absolute"
                    style={{ 
                        transform: `translate3d(${-camera.x}px, ${-camera.y}px, ${-camera.height}px)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* 1. GROUND & ROADS */}
                    <div 
                        className="absolute inset-0 bg-[#f2f2f2]"
                        style={{ 
                            width: WORLD_SIZE, height: WORLD_SIZE, 
                            transform: `translate(-50%, -50%)`,
                            backfaceVisibility: 'hidden',
                            // Subtle grid pattern for "Map" look
                            backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} 
                    >
                        {/* Main Avenue (Vertical) */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[350px] bg-[#fff] border-l border-r border-gray-300 shadow-sm">
                            {/* Road Surface */}
                            <div className="absolute inset-y-0 left-4 right-4 bg-[#e6e6e6]"></div>
                            {/* Lane Markers */}
                            <div className="absolute inset-0 border-l border-r border-white/40 w-4 mx-auto border-dashed h-full opacity-50" />
                        </div>
                        
                        {/* Cross Streets */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[120px] bg-[#fff] border-t border-b border-gray-300 shadow-sm">
                             <div className="absolute inset-x-0 top-3 bottom-3 bg-[#e6e6e6]"></div>
                        </div>
                    </div>

                    {/* 2. BUILDINGS (Clean Map Blocks) */}
                    {CITY_GRID.map(block => (
                        <div key={block.id} className="absolute" style={{ transform: `translate3d(${block.x}px, ${block.y}px, 0)`, transformStyle: 'preserve-3d' }}>
                            {/* Building Body (South Face) */}
                            {!block.isPark && (
                                <div 
                                    className="absolute origin-bottom bg-[#d4d4d4] border border-[#c0c0c0]"
                                    style={{
                                        width: block.w, height: block.height,
                                        bottom: 0,
                                        transform: `rotateX(-90deg)`,
                                    }}
                                />
                            )}
                            {/* Roof (Top Down View) */}
                            <div 
                                className="absolute shadow-sm border border-black/5"
                                style={{
                                    width: block.w, height: block.h,
                                    backgroundColor: block.isPark ? '#dcfce7' : block.color, // Green for parks, grey/white for buildings
                                    transform: `translateZ(${block.isPark ? 2 : block.height}px)`,
                                    boxShadow: viewMode === 'MAP' ? '0 10px 20px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {block.isPark && (
                                    <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/grass.png')]" />
                                )}
                            </div>
                        </div>
                    ))}

                    {/* 3. TREES (Billboards) */}
                    {TREES.map(tree => (
                        <div 
                            key={tree.id} 
                            className="absolute flex flex-col items-center justify-end"
                            style={{ 
                                transform: `translate3d(${tree.x}px, ${tree.y}px, 0)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div 
                                style={{ 
                                    transform: `rotateX(-90deg) scale(${tree.scale})`, 
                                    transformOrigin: 'bottom center' 
                                }}
                                className="w-24 h-48 flex items-end justify-center"
                            >
                                <div className="w-4 h-12 bg-[#8b5a2b] mx-auto opacity-80" />
                                <div className="absolute bottom-10 w-24 h-24 bg-[#4ade80] rounded-full opacity-90 shadow-sm" />
                                <div className="absolute bottom-16 w-20 h-20 bg-[#86efac] rounded-full opacity-90 shadow-sm" />
                            </div>
                        </div>
                    ))}

                    {/* 4. LANDMARKS (Pins) */}
                    {VISUAL_LANDMARKS.map(lm => {
                        const isSelected = selectedLandmark?.id === lm.id;
                        return (
                            <div 
                                key={lm.id}
                                className="absolute z-20"
                                style={{ 
                                    transform: `translate3d(${lm.x}px, ${lm.y}px, 60px)`, // Floating
                                    transformStyle: 'preserve-3d'
                                }}
                                onClick={(e) => { e.stopPropagation(); setSelectedLandmark(lm); }}
                            >
                                {/* Billboard Container: Faces Camera */}
                                <div 
                                    style={{ 
                                        transform: `rotateZ(${camera.rotation}deg) rotateX(${-camera.tilt}deg)`,
                                        transformOrigin: 'center center',
                                        transition: 'transform 0.1s linear' 
                                    }}
                                    className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100'}`}
                                >
                                    {/* The Card */}
                                    <div className="relative bg-white p-1 rounded-xl shadow-lg border border-gray-200 overflow-hidden w-24 hover:w-28 transition-all duration-300 group-hover:scale-105">
                                        <div className="aspect-video rounded-lg overflow-hidden mb-1 bg-gray-100">
                                            <img src={lm.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-[9px] font-bold text-center leading-tight truncate px-1 pb-1 text-slate-800">
                                            {lm.name}
                                        </div>
                                    </div>
                                    
                                    {/* Pin Stem */}
                                    <div className="w-0.5 h-8 bg-slate-400 mt-[-2px]" />
                                    <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px]" />
                                </div>
                            </div>
                        );
                    })}

                    {/* 5. USER MARKER (Directional Arrow for Map, Invisible for Street) */}
                    {viewMode === 'MAP' && (
                        <div 
                            className="absolute z-30 pointer-events-none"
                            style={{ 
                                transform: `translate3d(${userPos.x}px, ${userPos.y}px, 20px)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>

        {/* --- UI OVERLAY --- */}
        
        {/* Fixed Search Bar (No Mic) */}
        <div className="absolute top-12 left-4 right-4 z-40">
            <form 
                onSubmit={handleSearch}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center p-1.5 border border-gray-100 max-w-md mx-auto"
            >
                <button type="button" onClick={onClose} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                    <X size={20} className="text-slate-400" />
                </button>
                <input 
                    className="flex-1 py-2.5 px-2 outline-none text-slate-800 placeholder-gray-400 font-medium text-[16px] bg-transparent" 
                    placeholder="Search Maps"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mr-1 border border-gray-200">
                    <User size={16} className="text-gray-500" />
                </div>
            </form>
        </div>

        {/* Controls */}
        <div className="absolute top-32 right-4 z-30 flex flex-col gap-3">
            <button 
                onClick={() => setViewMode(prev => prev === 'MAP' ? 'STREET' : 'MAP')}
                className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform border border-gray-100"
            >
                {viewMode === 'MAP' ? <User size={24} /> : <Compass size={24} className="text-blue-500" />}
            </button>
            <button 
                className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-transform border border-gray-100"
            >
                <Locate size={24} />
            </button>
            {viewMode === 'STREET' && (
                <button 
                    onMouseDown={() => setIsWalking(true)}
                    onMouseUp={() => setIsWalking(false)}
                    onTouchStart={() => setIsWalking(true)}
                    onTouchEnd={() => setIsWalking(false)}
                    className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center border transition-all ${isWalking ? 'bg-blue-500 text-white border-blue-600 scale-95' : 'bg-white text-slate-700 border-gray-100'}`}
                >
                    <Footprints size={24} />
                </button>
            )}
        </div>

        {/* Selected Landmark Info */}
        <AnimatePresence>
            {selectedLandmark && (
                <motion.div 
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    className="absolute bottom-24 left-4 right-4 z-40 max-w-md mx-auto"
                >
                    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-5 border border-gray-100">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100 shadow-inner">
                                <img src={selectedLandmark.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 truncate">{selectedLandmark.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{selectedLandmark.address}</p>
                                    </div>
                                    <button onClick={() => setSelectedLandmark(null)} className="bg-gray-100 p-1.5 rounded-full"><X size={14} className="text-gray-500" /></button>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium text-slate-700">4.8</span> • <span>0.2 mi</span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button 
                                        onClick={() => { setNavigatingTo(selectedLandmark); setViewMode('STREET'); }}
                                        className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md active:bg-blue-700 active:scale-95 transition-transform"
                                    >
                                        <Navigation size={12} fill="currentColor" /> Walk Here
                                    </button>
                                </div>
                            </div>
                        </div>
                        {selectedLandmark.silasTip && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <SilasLogo className="w-3 h-3 text-purple-600" />
                                </div>
                                <p className="text-xs text-slate-600 leading-snug font-medium">
                                    "{selectedLandmark.silasTip}"
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Bottom Explore Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-8 pt-4 px-4 z-30">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {[
                    { label: 'Food', icon: Utensils, color: 'text-orange-500' },
                    { label: 'Coffee', icon: Coffee, color: 'text-amber-700' },
                    { label: 'Shops', icon: ShoppingBag, color: 'text-blue-600' },
                    { label: 'Sights', icon: Mountain, color: 'text-green-600' },
                ].map((cat, i) => (
                    <button key={i} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform w-16">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
                            <cat.icon size={18} className={cat.color} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer"
            onClick={onClose}
        >
            <div className="w-32 h-1.5 bg-gray-300 rounded-full opacity-50" />
        </div>
    </div>
  );
};
