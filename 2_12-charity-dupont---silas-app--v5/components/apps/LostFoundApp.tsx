
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Scan, Footprints, ChevronLeft, Clock, MapPin, Camera, Settings, ArrowUp, CheckCircle, Navigation, Radar, Layers, Home, XCircle, AlertCircle } from 'lucide-react';

interface LostFoundAppProps {
  onClose: () => void;
}

interface HistoryItem {
    id: string;
    item: string;
    status: 'LOST' | 'FOUND';
    date: string;
    location: string;
    image?: string;
}

// --- CONSTANTS & LAYOUTS ---
const FLOORS = [1, 2, 'B'];

interface SearchNode {
    id: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    room: string;
}

// Architectural layouts using SVG paths for realism
const FLOOR_SVG_PATHS: Record<string | number, string> = {
    1: "M 10 10 H 90 V 90 H 60 V 70 H 40 V 90 H 10 V 10 M 60 10 V 40 M 10 50 H 40", // Open concept with bump outs
    2: "M 15 15 H 85 V 85 H 55 V 60 H 45 V 85 H 15 V 15 M 50 15 V 85 M 15 50 H 85", // 4-Bedroom style layout
    'B': "M 25 25 H 75 V 75 H 25 V 25 M 25 50 H 50 V 75" // Smaller basement, utility rooms
};

const FLOOR_LABELS: Record<string | number, { text: string, x: number, y: number }[]> = {
    1: [
        { text: 'Living Room', x: 25, y: 30 },
        { text: 'Kitchen', x: 75, y: 25 },
        { text: 'Dining', x: 75, y: 70 },
        { text: 'Entry', x: 50, y: 85 }
    ],
    2: [
        { text: 'Master Bed', x: 30, y: 30 },
        { text: 'Guest Bed', x: 70, y: 30 },
        { text: 'Office', x: 30, y: 70 },
        { text: 'Bath', x: 70, y: 70 }
    ],
    'B': [
        { text: 'Storage', x: 35, y: 40 },
        { text: 'Utility', x: 60, y: 60 }
    ]
};

// Generate distinct step patterns for each floor
const GENERATE_STEPS = (floor: string | number): SearchNode[] => {
    const steps: SearchNode[] = [];
    if (floor === 1) {
        // Scatter pattern for Floor 1
        for(let i=0; i<5; i++) steps.push({ id: `f1-l-${i}`, x: 20 + (i*10), y: 20 + (i*8), room: 'Living' });
        for(let i=0; i<4; i++) steps.push({ id: `f1-k-${i}`, x: 70 + (i*5), y: 20 + (i*10), room: 'Kitchen' });
        for(let i=0; i<3; i++) steps.push({ id: `f1-e-${i}`, x: 50, y: 80 - (i*10), room: 'Entry' });
    } else if (floor === 2) {
        // Grid pattern for Floor 2 rooms
        steps.push({ id: 'f2-m-1', x: 25, y: 25, room: 'Master' });
        steps.push({ id: 'f2-m-2', x: 35, y: 35, room: 'Master' });
        steps.push({ id: 'f2-g-1', x: 75, y: 25, room: 'Guest' });
        steps.push({ id: 'f2-o-1', x: 25, y: 75, room: 'Office' });
        steps.push({ id: 'f2-h-1', x: 50, y: 50, room: 'Hall' });
        steps.push({ id: 'f2-h-2', x: 50, y: 60, room: 'Hall' });
    } else {
        // Basement tight cluster
        steps.push({ id: 'fb-1', x: 35, y: 35, room: 'Storage' });
        steps.push({ id: 'fb-2', x: 40, y: 40, room: 'Storage' });
        steps.push({ id: 'fb-3', x: 60, y: 60, room: 'Utility' });
    }
    return steps;
};

export const LostFoundApp: React.FC<LostFoundAppProps> = ({ onClose }) => {
  const [step, setStep] = useState<'INPUT' | 'SEARCHING' | 'HISTORY' | 'FOUND'>('INPUT');
  const [currentFloor, setCurrentFloor] = useState<string | number>(1);
  
  const [lostItemName, setLostItemName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  
  // Search Logic
  const [searchedNodes, setSearchedNodes] = useState<string[]>([]); // IDs of clicked steps
  const [activeFloorNodes, setActiveFloorNodes] = useState<SearchNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Currently inspecting

  // Mock History Data
  const [history, setHistory] = useState<HistoryItem[]>([
      { id: '1', item: 'Leather Wallet', status: 'FOUND', date: 'Yesterday, 2:30 PM', location: 'Living Room (Under Sofa)', image: 'https://images.unsplash.com/photo-1627123424574-18bd03048ca3?auto=format&fit=crop&w=150&q=80' },
      { id: '2', item: 'Car Keys', status: 'LOST', date: 'Oct 24, 9:00 AM', location: 'Last seen: Kitchen', image: 'https://images.unsplash.com/photo-1622630732303-8e94514a1746?auto=format&fit=crop&w=150&q=80' },
      { id: '3', item: 'AirPods Pro', status: 'FOUND', date: 'Oct 12, 6:15 PM', location: 'Bedroom (Nightstand)', image: 'https://images.unsplash.com/photo-1588156979435-379b9d802b74?auto=format&fit=crop&w=150&q=80' },
  ]);

  // Mock Scanned Items Library
  const scannedItems = [
      { id: 's1', name: 'Vintage Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80' },
      { id: 's2', name: 'Blue Notebook', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80' },
      { id: 's3', name: 'Water Bottle', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=150&q=80' },
  ];

  // Floor & Node Logic
  useEffect(() => {
      const nodes = GENERATE_STEPS(currentFloor);
      setActiveFloorNodes(nodes);
  }, [currentFloor]);

  const handleScanClick = () => {
      setShowScanModal(true);
  };

  const handleSelectScannedItem = (item: { name: string, image: string }) => {
      setLostItemName(item.name);
      setShowScanModal(false);
  };

  const handleNewScan = () => {
      setShowScanModal(false);
      setIsUploading(true);
      setTimeout(() => {
          setIsUploading(false);
          const newItemName = "New Item " + Math.floor(Math.random() * 100);
          setLostItemName(newItemName);
          const newItem: HistoryItem = {
              id: Date.now().toString(),
              item: newItemName,
              status: 'LOST',
              date: 'Just Now',
              location: 'Unknown Location',
              image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=150&q=80'
          };
          setHistory(prev => [newItem, ...prev]);
      }, 2000);
  };

  const startFinding = () => {
      if(!lostItemName) return;
      setStep('SEARCHING');
      setCurrentFloor(1);
      setSearchedNodes([]);
      setSelectedNodeId(null);
  };

  const handleStepClick = (nodeId: string) => {
      // Toggle selection or select new
      if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
      } else {
          setSelectedNodeId(nodeId);
      }
  };

  const handleMarkEmpty = () => {
      if (selectedNodeId) {
          setSearchedNodes(prev => [...prev, selectedNodeId]);
          setSelectedNodeId(null);
      }
  };

  const handleItemFound = () => {
      setStep('FOUND');
      setHistory(prev => prev.map(i => i.item === lostItemName ? { ...i, status: 'FOUND', location: `Found on Floor ${currentFloor}` } : i));
  };

  return (
    <div className="absolute inset-0 bg-[#1c1c1e] z-50 flex flex-col font-sans text-white overflow-hidden">
        {/* Header */}
        <div className="pt-14 px-6 pb-4 flex justify-between items-center bg-[#1c1c1e] z-20 border-b border-white/5">
            {step === 'INPUT' ? (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Navigation className="text-blue-500 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold">Locator</h1>
                </div>
            ) : (
                <button onClick={() => setStep('INPUT')} className="flex items-center gap-1 text-blue-500 font-medium">
                    <ChevronLeft /> Back
                </button>
            )}
            
            {step === 'INPUT' ? (
                <div className="flex gap-2">
                    <button onClick={handleScanClick} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                        <Camera size={20} className="text-blue-400" />
                    </button>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Settings size={20} className="text-gray-400" />
                </button>
            )}
        </div>

        {/* --- INPUT VIEW --- */}
        {step === 'INPUT' && (
            <div className="flex-1 p-6 flex flex-col relative">
                
                {/* Upload/Analyze Overlay */}
                <AnimatePresence>
                    {isUploading && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center rounded-3xl"
                        >
                            <div className="w-32 h-32 relative mb-8">
                                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-2xl" />
                                <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl border-t-transparent animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Scan className="w-12 h-12 text-white animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Analyzing Item...</h3>
                            <p className="text-gray-400 text-sm">Identifying features and syncing with location history.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scan Selection Modal */}
                <AnimatePresence>
                    {showScanModal && (
                        <motion.div 
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="absolute inset-0 z-40 bg-[#1c1c1e] flex flex-col"
                        >
                            <div className="pt-6 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-[#1c1c1e]">
                                <h2 className="text-xl font-bold">Select Item</h2>
                                <button onClick={() => setShowScanModal(false)} className="p-2 bg-gray-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                <div 
                                    onClick={handleNewScan}
                                    className="w-full aspect-video bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-2 mb-8 cursor-pointer hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Camera size={32} className="text-blue-500" />
                                    </div>
                                    <span className="font-bold text-gray-300">Scan New Item</span>
                                </div>

                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recently Scanned</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {scannedItems.map(item => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handleSelectScannedItem(item)}
                                            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-500 transition-all"
                                        >
                                            <div className="aspect-square relative">
                                                <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                <span className="absolute bottom-2 left-2 font-medium text-sm text-white line-clamp-1">{item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-3 text-white">Find it fast.</h2>
                        <p className="text-gray-400 text-lg">Select an item or scan to start tracking.</p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search..."
                                value={lostItemName}
                                onChange={(e) => setLostItemName(e.target.value)}
                                className="w-full bg-[#2c2c2e] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg outline-none focus:border-blue-500 transition-all placeholder-gray-600 text-white shadow-inner"
                            />
                        </div>
                        
                        <div className="flex gap-3 justify-center flex-wrap">
                            {['Wallet', 'Keys', 'Phone', 'Bag'].map(tag => (
                                <button 
                                    key={tag} 
                                    onClick={() => setLostItemName(tag)} 
                                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
                                        lostItemName === tag 
                                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105' 
                                        : 'bg-[#2c2c2e] text-gray-300 border-white/5 hover:bg-[#3a3a3c]'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button 
                        onClick={() => setStep('HISTORY')}
                        className="py-4 bg-[#2c2c2e] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#3a3a3c] transition-colors text-white"
                    >
                        <Clock size={20} className="text-gray-400" /> History
                    </button>
                    <button 
                        onClick={startFinding}
                        disabled={!lostItemName}
                        className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${lostItemName ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 active:scale-95' : 'bg-[#2c2c2e] text-gray-500 cursor-not-allowed'}`}
                    >
                        <Navigation size={20} /> Locate
                    </button>
                </div>
            </div>
        )}

        {/* --- HISTORY VIEW --- */}
        {step === 'HISTORY' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="px-2 mb-2">
                    <h2 className="text-2xl font-bold">Item Log</h2>
                    <p className="text-gray-500 text-sm">Everything you've tracked.</p>
                </div>
                
                {history.map(item => (
                    <div key={item.id} className="bg-[#2c2c2e] rounded-2xl p-4 flex gap-4 items-center border border-white/5 active:scale-[0.99] transition-transform">
                        <div className="w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                            {item.image ? (
                                <img src={item.image} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><Scan className="text-gray-600" /></div>
                            )}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.status === 'FOUND' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg truncate text-white">{item.item}</h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${item.status === 'FOUND' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
                                <MapPin size={14} className="text-gray-500" /> {item.location}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Clock size={12} /> {item.date}
                            </div>
                        </div>
                        <ChevronLeft className="rotate-180 text-gray-600" size={20} />
                    </div>
                ))}
            </div>
        )}

        {/* --- FOUND VIEW --- */}
        {step === 'FOUND' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-green-500/10">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(34,197,94,0.4)] animate-bounce">
                    <CheckCircle size={64} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Item Found!</h2>
                <p className="text-gray-400 mb-8">
                    You've successfully retrieved the <span className="text-white font-bold">{lostItemName}</span>.
                </p>
                <button onClick={() => setStep('INPUT')} className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg active:scale-95 transition-transform">
                    Track Something Else
                </button>
            </div>
        )}

        {/* --- SEARCHING VIEW (IMMERSIVE BLUEPRINT) --- */}
        {step === 'SEARCHING' && (
            <div className="absolute inset-0 bg-[#000508] flex flex-col overflow-hidden">
                
                {/* Scanning Radar Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,transparent_20%,#000_100%)] z-10" />
                <motion.div 
                    className="absolute inset-0 z-0 pointer-events-none opacity-10"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    style={{ 
                        backgroundImage: "linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}
                />

                {/* MAIN MAP CONTAINER - MAXIMIZED */}
                <div className="absolute inset-0 flex items-center justify-center p-8 pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentFloor}
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-sm aspect-[4/5] relative" // Restrained size
                        >
                            {/* SVG Blueprint Layer */}
                            <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,255,0.1)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Floor Layout */}
                                <path 
                                    d={FLOOR_SVG_PATHS[currentFloor]} 
                                    fill="none" 
                                    stroke="rgba(255,255,255,0.3)" 
                                    strokeWidth="0.5" 
                                    vectorEffect="non-scaling-stroke"
                                />
                                <path 
                                    d={FLOOR_SVG_PATHS[currentFloor]} 
                                    fill="rgba(0, 40, 60, 0.3)" 
                                    stroke="cyan" 
                                    strokeWidth="1" 
                                    vectorEffect="non-scaling-stroke"
                                    className="opacity-60"
                                />
                            </svg>

                            {/* Room Labels */}
                            {FLOOR_LABELS[currentFloor]?.map((label, i) => (
                                <div 
                                    key={i} 
                                    className="absolute text-[10px] text-cyan-500/50 font-mono uppercase tracking-widest pointer-events-none"
                                    style={{ left: `${label.x}%`, top: `${label.y}%`, transform: 'translate(-50%, -50%)' }}
                                >
                                    {label.text}
                                </div>
                            ))}

                            {/* Interactive Steps / Nodes */}
                            {activeFloorNodes.map((node) => {
                                const isSearched = searchedNodes.includes(node.id);
                                const isSelected = selectedNodeId === node.id;

                                return (
                                    <div 
                                        key={node.id}
                                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-20"
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                        onClick={() => handleStepClick(node.id)}
                                    >
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ 
                                                scale: isSelected ? 2 : 1,
                                                filter: isSelected ? 'drop-shadow(0 0 8px cyan)' : 'none'
                                            }}
                                            transition={{ delay: Math.random() * 0.5 }}
                                        >
                                            <Footprints 
                                                size={20} 
                                                className={`transition-all duration-300 ${
                                                    isSearched 
                                                        ? 'text-white/10' 
                                                        : isSelected 
                                                            ? 'text-cyan-400'
                                                            : 'text-white/30 hover:text-white'
                                                }`}
                                                fill={isSearched ? 'none' : 'currentColor'}
                                            />
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Verification UI - FIXED POSITION SAFE AREA */}
                <AnimatePresence>
                    {selectedNodeId && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="absolute bottom-32 left-0 right-0 z-[60] flex justify-center pointer-events-none px-6"
                        >
                            <div className="bg-[#1c1c1e]/90 border border-cyan-500/50 backdrop-blur-xl p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] w-full max-w-[280px] pointer-events-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                        <Scan size={14} className="animate-pulse" />
                                        Scanning...
                                    </span>
                                    <button onClick={() => setSelectedNodeId(null)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                                </div>
                                <div className="text-center mb-4">
                                    <h3 className="text-white font-bold text-lg">Item Detected Here?</h3>
                                    <p className="text-gray-400 text-xs">Confirm visual match.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleMarkEmpty}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold text-sm border border-gray-700 transition-colors"
                                    >
                                        No
                                    </button>
                                    <button 
                                        onClick={handleItemFound}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-colors"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floor Selector - MOVED UP */}
                <div className="absolute bottom-48 right-6 z-50 flex flex-col gap-2">
                    {FLOORS.map(f => (
                        <button
                            key={f}
                            onClick={() => setCurrentFloor(f)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all border ${
                                currentFloor === f 
                                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)]' 
                                    : 'bg-black/60 text-gray-400 border-white/10 hover:text-white hover:bg-white/10 backdrop-blur-md'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="text-[10px] text-center font-mono text-gray-500 mt-1 uppercase tracking-widest">FLOOR</div>
                </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-0 w-full p-6 pb-12 z-20 pointer-events-none">
                    <div className="flex items-center gap-4 bg-[#1c1c1e]/90 p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md pointer-events-auto">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 animate-pulse">
                            <Radar size={24} className="text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scanner Signal</span>
                                <span className="text-blue-400 font-mono text-xs font-bold">ACTIVE</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                                Scanning Floor {currentFloor}... Select footprint to verify.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer pointer-events-auto"
            onClick={onClose}
        >
            <div className="w-32 h-1.5 bg-gray-500 rounded-full opacity-50" />
        </div>
    </div>
  );
};
