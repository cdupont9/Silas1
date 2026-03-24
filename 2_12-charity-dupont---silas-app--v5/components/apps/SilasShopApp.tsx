
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Truck, Store, Calendar, Clock, CheckCircle, Loader2, ChevronLeft, ArrowRight, History, Coffee, Apple, Plus, Search, Filter, Trash2, Receipt, Package, ChevronRight as ChevronRightIcon, Sparkles, Gem, Minus, CreditCard, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { GlobalCartItem } from '../../types';
import { SilasLogo } from '../SilasApp';

interface SilasShopAppProps {
  onClose: () => void;
  cart: GlobalCartItem[];
  setCart: React.Dispatch<React.SetStateAction<GlobalCartItem[]>>;
}

interface PastOrder {
    id: string;
    store: string;
    date: string;
    total: number;
    itemCount: number;
    previewImages: string[];
    items: string[];
    status: string;
    trackingNum?: string;
    colorClass?: string;
}

export const SilasShopApp: React.FC<SilasShopAppProps> = ({ onClose, cart, setCart }) => {
  const [view, setView] = useState<'HOME' | 'CART' | 'CHECKOUT' | 'SUCCESS'>('HOME');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeTimeSelectorStore, setActiveTimeSelectorStore] = useState<string | null>(null);

  // Store Logistics State (Per Store)
  const [storeLogistics, setStoreLogistics] = useState<Record<string, { method: 'Delivery' | 'Pickup', time: string }>>({});

  // Mock Data for Past/Active Orders
  const [localPastOrders, setLocalPastOrders] = useState<PastOrder[]>([
      { 
          id: 'ORD-BALI-992', store: 'Juno Store', date: 'Today', total: 45.00, itemCount: 1, status: 'Out for Delivery',
          trackingNum: 'TRK-9921-X',
          items: ['Satin Ballet Slippers'],
          previewImages: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80"],
          colorClass: "bg-pink-500"
      },
      { 
          id: 'ORD-PET-881', store: 'Petco', date: 'Yesterday', total: 64.99, itemCount: 1, status: 'Shipped',
          trackingNum: 'TRK-8812-Z',
          items: ['Organic Dog Food'],
          previewImages: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80"],
          colorClass: "bg-blue-500"
      }
  ]);

  const activeOrders = localPastOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Returned');

  // Group Cart Items by Store
  const groupedCart = useMemo(() => {
      const groups: Record<string, GlobalCartItem[]> = {};
      cart.forEach(item => {
          const store = item.store || 'General';
          if (!groups[store]) groups[store] = [];
          groups[store].push(item);
      });
      return groups;
  }, [cart]);

  // Initialize logistics for new stores in cart
  useEffect(() => {
      setStoreLogistics(prev => {
          const next = { ...prev };
          Object.keys(groupedCart).forEach(store => {
              if (!next[store]) {
                  next[store] = { method: 'Delivery', time: 'ASAP (45 min)' };
              }
          });
          return next;
      });
  }, [groupedCart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
      setIsCheckingOut(true);
      
      // Simulate Processing Delay
      setTimeout(() => {
          setView('SUCCESS');
          setIsCheckingOut(false);
          
          // Generate new Order(s) based on groups
          Object.entries(groupedCart).forEach(([store, items]) => {
              const cartItems = items as GlobalCartItem[];
              const storeTotal = cartItems.reduce((s, i) => s + i.price, 0);
              const newOrder: PastOrder = {
                  id: `ORD-${store.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                  store: store,
                  date: 'Just Now',
                  total: storeTotal + 5.99,
                  itemCount: cartItems.length,
                  items: cartItems.map(i => i.name),
                  previewImages: cartItems.map(i => i.image || ''),
                  status: 'Processing',
                  trackingNum: `TRK-${Date.now().toString().slice(-4)}`,
                  colorClass: store === 'Juno Store' ? "bg-pink-500" : "bg-purple-500"
              };
              setLocalPastOrders(prev => [newOrder, ...prev]);
          });

          // Clear cart
          setTimeout(() => {
              setCart([]);
          }, 500);
      }, 2500);
  };

  const handleBack = () => {
      if (view === 'CART') setView('HOME');
      else if (view === 'CHECKOUT') setView('CART');
      else if (view === 'SUCCESS') setView('HOME'); 
      else onClose();
  };

  const removeItem = (itemId: string) => {
      setCart(prev => {
          const idx = prev.findIndex(i => i.id === itemId);
          if (idx === -1) return prev;
          const newCart = [...prev];
          newCart.splice(idx, 1);
          return newCart;
      });
  };

  const addItem = (item: GlobalCartItem) => {
      const newItem = { ...item, id: `${item.id}-${Date.now()}` };
      setCart(prev => [...prev, newItem]);
  };

  const updateStoreLogistics = (store: string, field: 'method' | 'time', value: string) => {
      setStoreLogistics(prev => {
          const current = prev[store] || { method: 'Delivery', time: 'ASAP (45 min)' };
          
          if (field === 'method') {
              // Reset time if method changes
              return {
                  ...prev,
                  [store]: {
                      ...current,
                      method: value as 'Delivery' | 'Pickup',
                      time: value === 'Delivery' ? 'ASAP (45 min)' : 'Ready in 15 min'
                  }
              };
          } else {
              // Just update time
              return {
                  ...prev,
                  [store]: {
                      ...current,
                      time: value
                  }
              };
          }
      });
  };

  const getTimeOptions = (method: 'Delivery' | 'Pickup') => {
      if (method === 'Delivery') {
          return [
              'ASAP (30-45 min)', 
              'Today, 1:00 PM - 3:00 PM', 
              'Today, 3:00 PM - 5:00 PM', 
              'Today, 5:00 PM - 7:00 PM',
              'Tomorrow, 9:00 AM - 11:00 AM', 
              'Tomorrow, 11:00 AM - 1:00 PM'
          ];
      }
      return [
          'Ready in 15 min', 
          'Ready in 30 min',
          'Today by 5:00 PM', 
          'Tomorrow Morning'
      ];
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="absolute inset-0 bg-[#0d0b14] z-50 flex flex-col font-sans text-white overflow-hidden"
    >
        {/* Header */}
        <div className="pt-14 px-6 pb-4 flex justify-between items-center z-10 bg-[#0d0b14]/95 backdrop-blur-md shrink-0 border-b border-white/10">
            {view !== 'HOME' ? (
                <button onClick={handleBack} className="flex items-center gap-1 text-purple-400 font-bold text-sm">
                    <ChevronLeft /> Back
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <SilasLogo className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">Silas Shop</span>
                </div>
            )}
            
            <div className="flex items-center gap-4">
                <button onClick={() => setView('CART')} className="relative">
                    <ShoppingBag size={24} className="text-white" />
                    {cart.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                            {cart.length}
                        </div>
                    )}
                </button>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X size={20} className="text-white" />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
            
            {view === 'HOME' && (
                <div className="pb-24">
                    {/* Greeting Moved to Top */}
                    <div className="px-6 pt-6 mb-6">
                        <h1 className="text-3xl font-light text-white">Good Morning, <br/><span className="font-bold">Eloise.</span></h1>
                    </div>

                    {/* ACTIVE ORDERS SECTION */}
                    <div className="px-6 mb-8">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Active Orders</h2>
                        {activeOrders.length > 0 ? (
                            <div className="space-y-4">
                                {activeOrders.map(order => (
                                    <div key={order.id} className="bg-[#1a1625] border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-md relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${order.colorClass || 'bg-purple-500'}`} />
                                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-white/10">
                                            {order.previewImages[0] ? (
                                                <img src={order.previewImages[0]} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-black font-bold text-xs">IMG</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-white text-base truncate">{order.store}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${
                                                    order.status.includes('Delivery') ? 'bg-purple-900/50 text-purple-300 border-purple-500/30' : 'bg-blue-900/50 text-blue-300 border-blue-500/30'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 truncate mb-1">{order.items.join(', ')}</p>
                                            {order.trackingNum && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                                                    <Truck size={12} /> {order.trackingNum}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm italic">No active orders.</div>
                        )}
                    </div>
                </div>
            )}

            {view === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-scale-up">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3">Order Placed!</h2>
                    <p className="text-gray-400 max-w-xs leading-relaxed mb-8">
                        Your personal shopper has received your order. Tracking info has been added to your dashboard.
                    </p>
                    <button onClick={() => setView('HOME')} className="text-green-400 font-bold hover:text-green-300 transition-colors">Return Home</button>
                </div>
            )}
            
            {view === 'CHECKOUT' && (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Checkout</h2>
                    <div className="space-y-4 mb-8">
                        {Object.entries(groupedCart).map(([store, items]) => {
                            const cartItems = items as GlobalCartItem[];
                            const logistics = storeLogistics[store] || { method: 'Delivery', time: 'ASAP (45 min)' };
                            const storeTotal = cartItems.reduce((s, i) => s + i.price, 0);
                            return (
                                <div key={store} className="bg-[#1a1625] p-5 rounded-3xl border border-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">{store}</h3>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-purple-400">{logistics.method}</span>
                                            <span className="block text-xs text-gray-500">{logistics.time}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-400">
                                                <span>{item.name}</span>
                                                <span>${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                                        <span>Subtotal</span>
                                        <span>${storeTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-[#1a1625] p-6 rounded-3xl border border-white/10 mb-6">
                        <div className="flex justify-between mb-4 text-gray-400 text-sm">
                            <span>Subtotal ({cart.length} items)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-400 text-sm">
                            <span>Shipping & Service</span>
                            <span className="text-white">$5.99</span>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>${(cartTotal + 5.99).toFixed(2)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-purple-600 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-900/40 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        {isCheckingOut ? <Loader2 className="animate-spin" /> : 'Pay Now'}
                    </button>
                </div>
            )}

            {view === 'CART' && (
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-6 pb-32">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-bold">My Cart</h2>
                            <span className="text-sm text-gray-400">{cart.length} Items</span>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">Your cart is empty.</div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedCart).map(([store, items]) => {
                                    const cartItems = items as GlobalCartItem[];
                                    const logistics = storeLogistics[store] || { method: 'Delivery', time: 'ASAP (45 min)' };
                                    const storeTotal = cartItems.reduce((s, i) => s + i.price, 0);
                                    const isTimeSelectorOpen = activeTimeSelectorStore === store;

                                    // Group items by name for quantity display
                                    const uniqueItems: Record<string, { item: GlobalCartItem, ids: string[], count: number }> = {};
                                    cartItems.forEach(i => {
                                        if (uniqueItems[i.name]) {
                                            uniqueItems[i.name].count++;
                                            uniqueItems[i.name].ids.push(i.id);
                                        }
                                        else uniqueItems[i.name] = { item: i, ids: [i.id], count: 1 };
                                    });

                                    return (
                                        <div key={store} className="bg-[#1a1625] rounded-3xl p-5 border border-white/10 relative z-10">
                                            {/* Store Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black">
                                                    <Store size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{store}</h3>
                                                    <p className="text-xs text-gray-400">{cartItems.length} items • ${storeTotal.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Logistics Toggles */}
                                            <div className="bg-black/30 p-1 rounded-xl flex mb-4">
                                                <button 
                                                    onClick={() => updateStoreLogistics(store, 'method', 'Delivery')}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${logistics.method === 'Delivery' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    Delivery
                                                </button>
                                                <button 
                                                    onClick={() => updateStoreLogistics(store, 'method', 'Pickup')}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${logistics.method === 'Pickup' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    Pickup
                                                </button>
                                            </div>

                                            {/* Time Selection */}
                                            <div className="relative mb-4 z-20">
                                                <div 
                                                    onClick={() => setActiveTimeSelectorStore(isTimeSelectorOpen ? null : store)}
                                                    className={`bg-[#2a2635] p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#322d40] transition-colors border ${isTimeSelectorOpen ? 'border-purple-500' : 'border-transparent'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-purple-400" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{logistics.method === 'Delivery' ? 'Delivery Time' : 'Pickup Time'}</span>
                                                            <span className="text-sm font-bold text-white">{logistics.time}</span>
                                                        </div>
                                                    </div>
                                                    {isTimeSelectorOpen ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-gray-500" />}
                                                </div>
                                                
                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {isTimeSelectorOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute top-full left-0 right-0 mt-2 bg-[#2a2635] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto"
                                                        >
                                                            {getTimeOptions(logistics.method).map((timeOption) => (
                                                                <div 
                                                                    key={timeOption}
                                                                    onClick={() => { updateStoreLogistics(store, 'time', timeOption); setActiveTimeSelectorStore(null); }}
                                                                    className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm font-medium border-b border-white/5 last:border-0 flex justify-between items-center"
                                                                >
                                                                    {timeOption}
                                                                    {logistics.time === timeOption && <CheckCircle size={14} className="text-purple-400" />}
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Items List */}
                                            <div className="space-y-3 relative z-10">
                                                {Object.values(uniqueItems).map(({ item, ids, count }) => (
                                                    <div key={item.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 relative group">
                                                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-black font-bold text-[8px]">ITEM</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm text-white truncate pr-6">{item.name}</div>
                                                            <div className="text-xs text-gray-400">{item.category || 'General'}</div>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="font-bold text-white">${(item.price * count).toFixed(2)}</span>
                                                                
                                                                {/* Quantity Stepper */}
                                                                <div className="flex items-center gap-3 bg-white/10 rounded-full px-2 py-1">
                                                                    <button 
                                                                        onClick={() => removeItem(ids[0])}
                                                                        className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all"
                                                                    >
                                                                        <Minus size={10} className="text-white" />
                                                                    </button>
                                                                    <span className="text-xs font-bold w-3 text-center">{count}</span>
                                                                    <button 
                                                                        onClick={() => addItem(item)}
                                                                        className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all"
                                                                    >
                                                                        <Plus size={10} className="text-white" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sticky Checkout Bar */}
                    {cart.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1625] border-t border-white/10 p-6 pb-8 z-30">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Est. Total</span>
                                    <div className="text-3xl font-black text-white">${(cartTotal + 5.99).toFixed(2)}</div>
                                </div>
                                <button 
                                    onClick={() => setView('CHECKOUT')}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                                >
                                    Checkout <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer bg-gradient-to-t from-[#0d0b14] to-transparent pointer-events-none"
        >
            <div className="w-32 h-1.5 bg-white/20 rounded-full pointer-events-auto" onClick={onClose} />
        </div>
    </motion.div>
  );
};
