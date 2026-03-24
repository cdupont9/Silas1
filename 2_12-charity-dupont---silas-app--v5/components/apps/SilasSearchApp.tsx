
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, AlertTriangle, CheckCircle, XCircle, ShoppingCart, Scan, Microscope, Menu, ArrowRight, List, Package, Tag, Image, Clock, Truck, DollarSign, X, ChevronDown, Check, ShoppingBag, Filter } from 'lucide-react';
import { SilasLogo } from '../SilasApp';
import { GoogleGenAI } from "@google/genai";
import { generateImage } from '../../services/geminiService';
import { GlobalCartItem } from '../../types';

interface SilasSearchAppProps {
  onClose: () => void;
  addToCart?: (item: GlobalCartItem) => void;
}

// --- Types ---

interface ProductDetail {
  name: string;
  category: string;
  summary: string;
  detailsLabel: string; 
  details: { name: string; purpose: string }[];
  usage: {
    recommended: string[];
    avoid: string[];
  };
  dangers: string[];
  stores: string[];
  imageUrl?: string; 
  // Added for Logistics
  priceEstimate?: number; 
}

interface ListResultItem {
    label: string;
    desc: string;
    nextQuery: string;
    type: 'category' | 'brand' | 'product' | 'material' | 'concept';
    imageUrl?: string;
}

interface ListResult {
  title: string;
  items: ListResultItem[];
}

type SearchResponse = 
  | { type: 'list'; data: ListResult }
  | { type: 'detail'; data: ProductDetail };

interface StoreOption {
    name: string;
    price: number;
    delivery: string;
    type: 'FASTEST' | 'CHEAPEST' | 'SILAS_PICK' | 'STANDARD';
    logoColor: string;
}

export const SilasSearchApp: React.FC<SilasSearchAppProps> = ({ onClose, addToCart }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<SearchResponse | null>(null);
  const [inputFocus, setInputFocus] = useState(false);
  
  // Filter State
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRODUCT' | 'MATERIAL' | 'CONCEPT'>('ALL');
  
  // Navigation History Stack
  const [history, setHistory] = useState<{ query: string; result: SearchResponse }[]>([]);
  
  // Logistics / Smart Shop State
  const [showLogistics, setShowLogistics] = useState(false);
  const [logisticsOptions, setLogisticsOptions] = useState<StoreOption[]>([]);
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      // Auto-focus input on launch
      if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const generateStoreOptions = (productName: string, basePrice: number = 29.99): StoreOption[] => {
      // Mock logistics generation based on product
      return [
          { name: 'Juno', price: basePrice + 5, delivery: 'Today (2 hrs)', type: 'SILAS_PICK', logoColor: 'bg-black text-white' },
          { name: 'Amazon', price: basePrice, delivery: 'Tomorrow', type: 'FASTEST', logoColor: 'bg-yellow-500 text-black' },
          { name: 'Walmart', price: basePrice - 2, delivery: '3 Days', type: 'CHEAPEST', logoColor: 'bg-blue-600 text-white' },
      ];
  };

  const handleBuyWithSilas = () => {
      if (!currentResult || currentResult.type !== 'detail') return;
      
      // Generate mock options
      const opts = generateStoreOptions(currentResult.data.name, currentResult.data.priceEstimate || 25);
      setLogisticsOptions(opts);
      setShowLogistics(true);
      setPurchaseComplete(false);
  };

  const confirmPurchase = () => {
      if (!currentResult || currentResult.type !== 'detail') return;
      
      setIsAddingToCart(true);
      const chosenOption = logisticsOptions[selectedStoreIndex];

      setTimeout(() => {
          if (addToCart) {
              addToCart({
                  id: `search-buy-${Date.now()}`,
                  name: currentResult.data.name,
                  price: chosenOption.price,
                  store: chosenOption.name,
                  category: currentResult.data.category,
                  addedAt: new Date(),
                  image: currentResult.data.imageUrl,
                  deliveryMethod: 'HOME'
              });
          }
          setIsAddingToCart(false);
          setPurchaseComplete(true);
          setTimeout(() => {
              setShowLogistics(false);
              setPurchaseComplete(false);
          }, 2000);
      }, 1500);
  };

  const executeSearch = async (searchQuery: string, addToHistory = true) => {
      if (!searchQuery.trim()) return;

      // Start fresh search
      setIsLoading(true);
      setInputFocus(false);
      
      // Save history if navigating deeper
      if (addToHistory && currentResult) {
          setHistory(prev => [...prev, { query, result: currentResult }]);
      }
      
      // Reset current view
      setCurrentResult(null); 
      setQuery(searchQuery);
      setActiveFilter('ALL'); // Reset filter on new search

      try {
          const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
          const ai = new GoogleGenAI({ apiKey });
          
          // 1. Get Text Data
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `
                You are a sophisticated search intent engine. Analyze the query: "${searchQuery}".
                
                DETERMINE INTENT:
                1. SPECIFIC PRODUCT: If the user is looking for a specific product detail (e.g. "iPhone 15 Pro specs", "Nutritional value of Apple"), return type "detail".
                2. EXPLORATION/LIST: If the query is broad (e.g. "Best Laptops"), OR asks about components/materials (e.g. "credit card material", "what is glass made of"), return type "list".

                REQUIREMENTS:
                - If "list", provide EXACTLY 4 distinct, high-quality results. Keep it simple and straightforward.
                - Interpret "material" queries correctly: "Credit card material" -> Results: "PVC", "Polycarbonate", "Titanium", etc. NOT specific credit card offers.
                - Interpret "product" queries correctly: "Best Soap" -> Results: "Dove", "Dr. Bronner's", etc.
                - Classify each item type accurately as 'product', 'material', or 'concept'.

                RETURN ONLY JSON.

                FORMAT 1: LIST
                {
                  "type": "list",
                  "data": {
                    "title": "Top Results for [Query]",
                    "items": [
                      { 
                        "label": "Item Name", 
                        "desc": "Why it's relevant.", 
                        "nextQuery": "Search query to drill down into this specific item",
                        "type": "product" // or "material", "concept"
                      }
                    ]
                  }
                }

                FORMAT 2: DETAIL
                {
                  "type": "detail",
                  "data": {
                    "name": "Full Product Name",
                    "category": "Category",
                    "summary": "Concise summary.",
                    "detailsLabel": "Key Specs" or "Components",
                    "details": [
                      { "name": "Feature/Material", "purpose": "Description" }
                    ],
                    "usage": {
                      "recommended": ["Use case"],
                      "avoid": ["Warning"]
                    },
                    "dangers": ["Hazards"],
                    "stores": ["Retailer"],
                    "priceEstimate": 25.00 // Number
                  }
                }
              `,
              config: { responseMimeType: 'application/json' }
          });

          if (!response.text) throw new Error("No response");
          const data = JSON.parse(response.text) as SearchResponse;

          // 2. Handle List View (Stream Images)
          if (data.type === 'list') {
              // Initialize empty list structure
              const resultObj: SearchResponse = { 
                  type: 'list', 
                  data: { title: data.data.title, items: [] } 
              };
              
              // We'll update state incrementally as images arrive
              const candidates = data.data.items;

              // Process all in parallel for max speed
              candidates.forEach(async (item) => {
                  try {
                      // Generate Image - Focus on accuracy based on type
                      let prompt = `Product shot of ${item.label}. High resolution, commercial advertisement photography, studio lighting, isolated on white background.`;
                      
                      if (item.type === 'material' || item.type === 'concept') {
                          prompt = `Close up texture shot of ${item.label} material. Photorealistic, high quality, studio lighting, neutral background.`;
                      }

                      const url = await generateImage(prompt);
                      
                      // Only add if image generation succeeded
                      if (url) {
                          const validItem = { ...item, imageUrl: url };
                          
                          setCurrentResult(prev => {
                              // If this is the first valid item, initialize the state
                              if (!prev || prev.type !== 'list') {
                                  return { ...resultObj, data: { ...resultObj.data, items: [validItem] } };
                              }
                              // Otherwise append
                              return {
                                  ...prev,
                                  data: { ...prev.data, items: [...prev.data.items, validItem] }
                              };
                          });
                          
                          // Hide loader as soon as we have at least one item
                          setIsLoading(false);
                      }
                  } catch (e) {
                      console.warn(`Failed to generate image for ${item.label}`);
                  }
              });

          } 
          // 3. Handle Detail View (Wait for single image)
          else if (data.type === 'detail') {
              const prompt = `Product photography of ${data.data.name}. Professional studio lighting, white background, high quality commercial advertisement.`;
              const url = await generateImage(prompt);
              
              if (url) {
                  data.data.imageUrl = url;
                  setCurrentResult(data);
                  setIsLoading(false);
              } else {
                  setIsLoading(false);
              }
          }

      } catch (err) {
          console.error("Silas Search Error", err);
          setIsLoading(false);
      }
  };

  const handleManualSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setHistory([]); 
      executeSearch(query, false);
  };

  const handleBack = () => {
      if (history.length > 0) {
          const prev = history[history.length - 1];
          setCurrentResult(prev.result);
          setQuery(prev.query);
          setHistory(prev => prev.slice(0, -1));
      } else {
          onClose();
      }
  };

  // Filter Logic
  const getFilteredItems = () => {
      if (!currentResult || currentResult.type !== 'list') return [];
      if (activeFilter === 'ALL') return currentResult.data.items;
      return currentResult.data.items.filter(item => item.type.toUpperCase() === activeFilter);
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="absolute inset-0 bg-[#F2F2F7] z-50 flex flex-col font-sans text-black overflow-hidden"
    >
        {/* Header */}
        <div className="pt-14 px-6 pb-4 bg-white z-20 sticky top-0 shadow-sm border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleBack} 
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
                    >
                        <ChevronLeft size={20} className="text-black" />
                    </button>
                    <div className="flex items-center gap-2">
                        <SilasLogo className="w-5 h-5" />
                        <span className="font-bold text-lg tracking-tight text-black">Silas Search</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleManualSearch} className="relative">
                <Search className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${inputFocus ? 'text-purple-600' : 'text-gray-400'}`} />
                <input 
                    ref={inputRef}
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    placeholder="Search product, material, or topic"
                    className="w-full bg-gray-100 text-black rounded-2xl py-3 pl-12 pr-12 text-lg font-medium outline-none border-2 border-transparent focus:border-purple-500/20 focus:bg-white transition-all shadow-inner focus:shadow-lg"
                />
                {query && (
                    <button 
                        type="button"
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        className="absolute right-3 top-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <XCircle size={18} fill="currentColor" className="text-gray-400 bg-white rounded-full" />
                    </button>
                )}
            </form>

            {/* FILTER BAR (Visible when results exist) */}
            {currentResult?.type === 'list' && (
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                    {['ALL', 'PRODUCT', 'MATERIAL', 'CONCEPT'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                activeFilter === filter 
                                    ? 'bg-black text-white' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {filter === 'ALL' ? 'All Results' : filter.charAt(0) + filter.slice(1).toLowerCase() + 's'}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
            
            {/* Empty State */}
            {!isLoading && !currentResult && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                        <Scan size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-500 mb-2">Analyze Anything</h3>
                    <p className="text-sm max-w-xs mx-auto leading-relaxed">
                        Search specific products for deep analysis, or broader terms for discovery.
                    </p>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full pb-20">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SilasLogo className="w-8 h-8 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-purple-700 font-bold text-sm tracking-widest uppercase animate-pulse">Scanning...</p>
                </div>
            )}

            {/* --- LIST VIEW --- */}
            {currentResult?.type === 'list' && (
                <div className="p-5 pb-24 space-y-4">
                    <div className="mb-2 px-1">
                        <h2 className="text-2xl font-bold text-slate-900">{currentResult.data.title}</h2>
                        <p className="text-sm text-gray-500">Silas Selections</p>
                    </div>
                    
                    <div className="space-y-4">
                        {getFilteredItems().map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => executeSearch(item.nextQuery)}
                                className="bg-white p-4 rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all"
                            >
                                <div className="w-full sm:w-24 h-32 sm:h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 relative">
                                    <img src={item.imageUrl} className="w-full h-full object-cover mix-blend-multiply" alt={item.label} />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <h3 className="font-bold text-xl text-slate-900 leading-tight">{item.label}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                            item.type === 'material' ? 'bg-gray-200 text-gray-600' : 
                                            item.type === 'product' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-snug">{item.desc}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <ChevronLeft size={20} className="text-gray-400 rotate-180" />
                                </div>
                            </motion.div>
                        ))}
                        {getFilteredItems().length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No results found for this filter.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- DETAIL VIEW --- */}
            {currentResult?.type === 'detail' && (
                <div className="p-5 space-y-6 pb-24">
                    {(() => {
                        const result = currentResult.data;
                        return (
                            <>
                                {/* Overview Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-bold text-white bg-black px-2 py-1 rounded uppercase tracking-wider">
                                                {result.category}
                                            </span>
                                        </div>
                                        {/* Main Product Image */}
                                        <div className="w-full h-56 bg-white rounded-xl mb-6 overflow-hidden relative flex items-center justify-center">
                                            <img src={result.imageUrl} className="w-full h-full object-contain" alt={result.name} />
                                        </div>

                                        <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{result.name}</h1>
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{result.summary}</p>
                                    </div>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                                </motion.div>

                                {/* Silas Smart Buy Button */}
                                <motion.button 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={handleBuyWithSilas}
                                    className="w-full py-4 bg-black text-white rounded-2xl shadow-xl flex items-center justify-between px-6 active:scale-95 transition-transform"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                            <ShoppingBag size={16} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-sm">Buy with Silas</div>
                                            <div className="text-xs text-gray-400">Comparing stores...</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} />
                                </motion.button>

                                {/* Deep Dive (Ingredients/Specs) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200"
                                >
                                    <div className="bg-slate-900 px-5 py-4 flex justify-between items-center sticky top-0 z-10">
                                        <div className="flex items-center gap-2 text-white">
                                            <Microscope size={18} className="text-purple-400" />
                                            <h3 className="font-bold text-base">{result.detailsLabel}</h3>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                            {result.details.length} DETECTED
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                                        {result.details.map((item, i) => (
                                            <div key={i} className="p-4 hover:bg-purple-50/50 transition-colors">
                                                <div className="font-bold text-slate-900 text-sm mb-1">{item.name}</div>
                                                <div className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                                                    <ArrowRight size={12} className="mt-0.5 text-purple-400 shrink-0" />
                                                    {item.purpose}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Usage Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-green-50 rounded-3xl p-5 border border-green-100"
                                    >
                                        <div className="flex items-center gap-2 mb-4 text-green-800 font-bold border-b border-green-200 pb-2">
                                            <CheckCircle size={18} className="fill-green-200" /> Best Used For
                                        </div>
                                        <ul className="space-y-3">
                                            {result.usage.recommended.map((u, i) => (
                                                <li key={i} className="text-xs text-green-900 flex items-start gap-2 leading-snug font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></div>
                                                    {u}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-red-50 rounded-3xl p-5 border border-red-100"
                                    >
                                        <div className="flex items-center gap-2 mb-4 text-red-800 font-bold border-b border-red-200 pb-2">
                                            <XCircle size={18} className="fill-red-200" /> Avoid / Do Not Use
                                        </div>
                                        <ul className="space-y-3">
                                            {result.usage.avoid.map((u, i) => (
                                                <li key={i} className="text-xs text-red-900 flex items-start gap-2 leading-snug font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0"></div>
                                                    {u}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>

                                {/* Safety Warnings */}
                                {result.dangers.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-orange-50 rounded-2xl p-5 border border-orange-200"
                                    >
                                        <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold">
                                            <AlertTriangle size={18} className="fill-orange-200" /> Safety Hazards
                                        </div>
                                        <ul className="grid gap-2">
                                            {result.dangers.map((d, i) => (
                                                <li key={i} className="text-xs text-orange-900 bg-orange-100/50 p-2 rounded-lg border border-orange-200/50">
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Stores */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingCart className="text-black" size={20} />
                                        <span className="font-bold text-black">Available Retailers</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.stores.map((store, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold border border-gray-100 text-gray-700">
                                                {store}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>

        {/* LOGISTICS / SMART SHOP MODAL */}
        <AnimatePresence>
            {showLogistics && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
                    onClick={() => setShowLogistics(false)}
                >
                    <motion.div 
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="bg-white w-full rounded-t-[2rem] p-6 pb-12 shadow-2xl overflow-hidden relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <SilasLogo className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">Silas Logistics</h3>
                                    <p className="text-xs text-gray-500">Comparing options for you...</p>
                                </div>
                            </div>
                            <button onClick={() => setShowLogistics(false)} className="bg-gray-100 rounded-full p-2"><X size={20} /></button>
                        </div>

                        <div className="space-y-3 mb-8">
                            {logisticsOptions.map((opt, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedStoreIndex(i)}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                                        selectedStoreIndex === i ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${opt.logoColor}`}>
                                            {opt.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {opt.name}
                                                {opt.type === 'SILAS_PICK' && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                {opt.delivery.includes('Today') ? <Clock size={12} className="text-green-600" /> : <Truck size={12} />}
                                                {opt.delivery}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">${opt.price.toFixed(2)}</div>
                                    </div>
                                    {selectedStoreIndex === i && <CheckCircle size={20} className="text-purple-600 ml-2" />}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={confirmPurchase}
                            disabled={isAddingToCart || purchaseComplete}
                            className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${
                                purchaseComplete ? 'bg-green-600' : 'bg-black active:scale-95'
                            }`}
                        >
                            {isAddingToCart ? (
                                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</>
                            ) : purchaseComplete ? (
                                <><CheckCircle size={20} /> Added to Silas Shop</>
                            ) : (
                                <><ShoppingCart size={20} /> Add to Cart via {logisticsOptions[selectedStoreIndex]?.name}</>
                            )}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer bg-gradient-to-t from-white/90 to-transparent"
            onClick={onClose}
        >
            <div className="w-32 h-1.5 bg-black/20 rounded-full" />
        </div>
    </motion.div>
  );
};
