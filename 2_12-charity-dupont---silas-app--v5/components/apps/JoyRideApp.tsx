
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Menu, Search, Clock, Star, Share2, Phone, Shield, X, User, Car, Calendar, ChevronDown, ChevronUp, AlertCircle, RefreshCw, Flag, CheckCircle, CreditCard } from 'lucide-react';
import { ActiveRide, InteractiveContact } from '../../types';

interface JoyRideAppProps {
  onClose: () => void;
  activeRide: ActiveRide;
  setActiveRide: React.Dispatch<React.SetStateAction<ActiveRide>>;
  contacts: InteractiveContact[];
}

export const JoyRideApp: React.FC<JoyRideAppProps> = ({ onClose, activeRide, setActiveRide, contacts }) => {
  const [view, setView] = useState<'MAP' | 'SEARCH' | 'RIDE_SELECT' | 'CONFIRMING' | 'ACTIVE'>('MAP');
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  
  // Booking State
  const [pickup, setPickup] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [rider, setRider] = useState<{name: string, id: string}>({ name: 'Me', id: 'me' });
  const [showRiderMenu, setShowRiderMenu] = useState(false);
  const [selectedCar, setSelectedCar] = useState('saver');
  const [isScheduled, setIsScheduled] = useState(false);

  // Active Ride UI State
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [showSafetySheet, setShowSafetySheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync internal view state with global activeRide
  useEffect(() => {
      if (activeRide.status !== 'IDLE') {
          setView('ACTIVE');
      } else {
          setView('MAP'); // Reset to map if ride is cancelled externally
      }
  }, [activeRide.status]);

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookRide = () => {
      setView('CONFIRMING');
      setTimeout(() => {
          setActiveRide({
              status: 'CONFIRMED',
              driverName: "Michael",
              carModel: selectedCar === 'xl' ? "Chevy Suburban" : "Toyota Camry",
              plateNumber: "8XYZ992",
              rating: "4.9",
              eta: "4 mins",
              destination: destination || "Dropoff Location",
              source: 'APP',
              riderId: rider.id
          });
      }, 2000);
  };

  const handleChangeDriver = () => {
      setShowDriverMenu(false);
      showToast("Finding new driver...");
      setTimeout(() => {
          setActiveRide(prev => ({
              ...prev,
              driverName: "Jessica",
              carModel: "Honda Accord",
              plateNumber: "2ABC123",
              rating: "4.8",
              eta: "6 mins"
          }));
          showToast("Driver Updated");
      }, 1500);
  };

  const handleCancelRide = () => {
      setShowDriverMenu(false);
      setActiveRide({ status: 'IDLE' });
      setDestination('');
      setView('MAP');
      showToast("Ride Cancelled");
  };

  const handleShare = (contactName: string) => {
      setShareSuccess(contactName);
      setTimeout(() => {
          setShareSuccess(null);
          setShowShareSheet(false);
          showToast(`Shared with ${contactName}`);
      }, 1500);
  };

  const CarOption = ({ id, name, price, eta, icon: Icon, selected }: any) => (
      <div 
        onClick={() => setSelectedCar(id)}
        className={`flex items-center justify-between p-4 cursor-pointer transition-all active:bg-gray-100 ${selected ? 'bg-gray-100 border-2 border-black rounded-xl' : 'border-b border-gray-100 last:border-0'}`}
      >
          <div className="flex items-center gap-4">
              <div className="w-16 h-10 relative">
                  <img src={id === 'xl' ? 'https://img.icons8.com/?size=100&id=19296&format=png&color=000000' : 'https://img.icons8.com/?size=100&id=15169&format=png&color=000000'} className="w-full h-full object-contain" />
              </div>
              <div>
                  <div className="font-bold text-base text-black flex items-center gap-2">
                      {name} <User size={12} className="text-gray-500" /> {id === 'xl' ? 6 : 4}
                  </div>
                  <div className="text-xs text-gray-500">{eta}</div>
              </div>
          </div>
          <div className="font-bold text-black text-lg">{price}</div>
      </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col font-sans overflow-hidden text-black">
        {/* --- MAP BACKGROUND (Simulated) --- */}
        <div className="absolute inset-0 z-0 bg-[#f3f4f6]">
            {/* Base Map Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/map-markers.png')]"></div>
            
            {/* Map Roads Simulation (Standard Grey Style) */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                <path d="M-100 100 L800 300" stroke="#000" strokeWidth="40" fill="none" />
                <path d="M200 -100 L200 900" stroke="#000" strokeWidth="50" fill="none" />
                <path d="M-50 500 L650 500" stroke="#000" strokeWidth="30" fill="none" />
                <path d="M400 0 L100 800" stroke="#000" strokeWidth="25" fill="none" />
            </svg>
            
            {/* Current Location Marker */}
            {view !== 'ACTIVE' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 bg-black rounded-full ring-4 ring-black/20 shadow-xl"></div>
                </div>
            )}

            {/* Active Ride Cars */}
            {view === 'ACTIVE' && (
                <motion.div 
                    initial={{ x: -100, y: 100 }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-6 translate-y-6 z-10"
                >
                    <div className="bg-black text-white p-2 rounded shadow-lg transform -rotate-12">
                        <Car size={16} fill="white" />
                    </div>
                </motion.div>
            )}
        </div>

        {/* --- HEADER (Menu) --- */}
        {view !== 'SEARCH' && (
            <div className="absolute top-0 left-0 pt-12 pl-4 z-20 pointer-events-none">
                 <button onClick={onClose} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-black pointer-events-auto active:scale-90 transition-transform">
                    <Menu size={20} />
                </button>
            </div>
        )}

        {/* --- TOAST --- */}
        <AnimatePresence>
            {toastMessage && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl z-50 flex items-center gap-2"
                >
                    <CheckCircle size={16} className="text-white" /> {toastMessage}
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- IDLE / MAP STATE --- */}
        {view === 'MAP' && (
            <div className="absolute bottom-0 w-full p-4 pb-12 z-10 flex flex-col gap-3">
                
                {/* Rider Switcher Pill */}
                <div className="self-end mb-2">
                     <button 
                        onClick={() => setShowRiderMenu(!showRiderMenu)}
                        className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold flex items-center gap-2 active:bg-gray-50 text-black border border-gray-100"
                    >
                        Rider: {rider.name} <ChevronDown size={14} />
                    </button>
                    <AnimatePresence>
                        {showRiderMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                <div className="p-2 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase pl-3">Switch Rider</div>
                                <div onClick={() => { setRider({name: 'Me', id: 'me'}); setShowRiderMenu(false); }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium flex items-center justify-between">
                                    Me {rider.id === 'me' && <CheckCircle size={14} className="text-black" />}
                                </div>
                                {contacts.filter(c => c.id !== 'shiloh').map(c => (
                                    <div key={c.id} onClick={() => { setRider({name: c.firstName, id: c.id}); setShowRiderMenu(false); }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium flex items-center justify-between">
                                        {c.firstName} {rider.id === c.id && <CheckCircle size={14} className="text-black" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Search Box */}
                <div 
                    onClick={() => setView('SEARCH')}
                    className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform"
                >
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg"><Search size={18} /></div>
                    <span className="text-xl font-bold text-black">Where to?</span>
                    <div className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1">
                        <Clock size={12} /> Now
                    </div>
                </div>

                {/* Recent Suggestions */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm min-w-[140px] cursor-pointer border border-gray-100" onClick={() => { setDestination('Home'); setView('RIDE_SELECT'); }}>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"><Clock size={16} /></div>
                        <div className="font-bold text-sm">Home</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm min-w-[140px] cursor-pointer border border-gray-100" onClick={() => { setDestination('Juno Store'); setView('RIDE_SELECT'); }}>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"><Clock size={16} /></div>
                        <div className="font-bold text-sm">Juno</div>
                    </div>
                </div>
            </div>
        )}

        {/* --- SEARCH / DESTINATION ENTRY --- */}
        {view === 'SEARCH' && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col p-4 pt-14 animate-slide-in">
                <button onClick={() => setView('MAP')} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full text-black"><ChevronDown size={24} className="rotate-90" /></button>
                <div className="space-y-4 pt-4">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center pt-2 gap-1">
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            <div className="w-0.5 h-8 bg-gray-200" />
                            <div className="w-2 h-2 bg-black rounded-sm" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="bg-gray-100 p-2 rounded-lg flex items-center">
                                <input 
                                    value={pickup} 
                                    onChange={e => setPickup(e.target.value)} 
                                    className="bg-transparent font-medium w-full outline-none text-black placeholder-gray-400 text-sm" 
                                />
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg flex items-center">
                                <input 
                                    autoFocus
                                    value={destination} 
                                    onChange={e => setDestination(e.target.value)} 
                                    placeholder="Where to?" 
                                    className="bg-transparent font-bold w-full outline-none text-black placeholder-gray-500 text-lg"
                                    onKeyDown={e => e.key === 'Enter' && setView('RIDE_SELECT')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-4 py-3 cursor-pointer active:bg-gray-50 border-b border-gray-100" onClick={() => { setDestination('Home'); setView('RIDE_SELECT'); }}>
                        <div className="bg-gray-200 p-2 rounded-full"><Clock size={16} /></div> 
                        <div>
                            <div className="font-bold text-black">Home</div>
                            <div className="text-xs text-gray-500">1042 Silicon Ave</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 py-3 cursor-pointer active:bg-gray-50 border-b border-gray-100" onClick={() => { setDestination('Juno Store'); setView('RIDE_SELECT'); }}>
                        <div className="bg-gray-200 p-2 rounded-full"><Clock size={16} /></div>
                        <div>
                            <div className="font-bold text-black">Juno Store</div>
                            <div className="text-xs text-gray-500">550 University Ave</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- RIDE SELECT --- */}
        {view === 'RIDE_SELECT' && (
            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 flex flex-col max-h-[70%]">
                <div className="p-4 border-b border-gray-100 flex justify-center cursor-pointer" onClick={() => setView('SEARCH')}>
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <h3 className="text-center font-bold text-xs uppercase text-gray-400 mb-2">Choose a ride</h3>
                    <CarOption id="saver" name="JoyRide" price="$14.92" eta="4 min away" icon={Car} selected={selectedCar === 'saver'} />
                    <CarOption id="comfort" name="Comfort" price="$21.50" eta="6 min away" icon={Car} selected={selectedCar === 'comfort'} />
                    <CarOption id="xl" name="JoyRide XL" price="$32.20" eta="9 min away" icon={Car} selected={selectedCar === 'xl'} />
                </div>

                <div className="p-4 border-t border-gray-100 pb-8 bg-white">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3 px-1">
                        <div className="flex items-center gap-1"><CreditCard size={12} /> Personal **** 4242</div>
                    </div>
                    <button 
                        onClick={handleBookRide}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
                    >
                        Choose {selectedCar === 'saver' ? 'JoyRide' : selectedCar === 'comfort' ? 'Comfort' : 'JoyRide XL'}
                    </button>
                </div>
            </div>
        )}

        {/* --- CONFIRMING --- */}
        {view === 'CONFIRMING' && (
            <div className="absolute bottom-0 w-full bg-white p-8 rounded-t-3xl z-30 shadow-2xl flex flex-col items-center pb-12">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="font-bold text-xl text-black">Connecting you to a driver...</h3>
                <p className="text-gray-500 text-sm mt-2">Looking for nearby cars</p>
                <button onClick={() => setView('RIDE_SELECT')} className="mt-8 text-gray-400 font-bold text-sm">Cancel Request</button>
            </div>
        )}

        {/* --- ACTIVE RIDE --- */}
        {view === 'ACTIVE' && (
            <>
                {/* Active Ride Header (Map Overlay) */}
                <div className="absolute top-12 left-0 right-0 px-4 z-10 flex justify-center pointer-events-none">
                    <div className="bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-slide-in pointer-events-auto">
                        <div className="text-right">
                            <div className="font-bold text-sm">Meet at pickup</div>
                            <div className="text-xs text-gray-400">{activeRide.eta} away</div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs border-2 border-black">
                            {activeRide.eta.split(' ')[0]}
                        </div>
                    </div>
                </div>

                {/* Driver Sheet */}
                <div className="absolute bottom-0 w-full z-10 pointer-events-auto bg-white rounded-t-2xl shadow-2xl p-5 pb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-center w-1/3">
                            <div className="text-2xl font-bold text-black">{activeRide.plateNumber}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase">{activeRide.carModel}</div>
                        </div>
                        <div className="w-1/3 flex justify-center">
                             <div className="w-20 h-12 relative">
                                <img src="https://img.icons8.com/?size=100&id=15169&format=png&color=000000" className="w-full h-full object-contain" />
                             </div>
                        </div>
                        <div className="text-center w-1/3 flex flex-col items-center relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative z-10">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[10px] font-bold mt-1 flex items-center gap-1">
                                {activeRide.rating} <Star size={8} fill="black" />
                            </div>
                            <div className="text-xs font-bold mt-1">{activeRide.driverName}</div>
                        </div>
                    </div>

                    <div className="flex gap-2 border-t border-gray-100 pt-4">
                        <div className="flex-1">
                            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Send a message</div>
                            <div className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-500 font-medium">Any pickup notes?</div>
                        </div>
                        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200">
                            <Phone size={20} />
                        </button>
                        <button onClick={() => setShowSafetySheet(true)} className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center active:bg-blue-100">
                            <Shield size={20} fill="currentColor" />
                        </button>
                    </div>

                    <button onClick={handleCancelRide} className="w-full mt-4 text-red-600 text-sm font-bold py-2">
                        Cancel Ride
                    </button>
                </div>
            </>
        )}

        {/* --- SAFETY SHEET --- */}
        <AnimatePresence>
            {showSafetySheet && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
                    onClick={() => setShowSafetySheet(false)}
                >
                    <motion.div 
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="bg-white w-full rounded-t-3xl p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={24} className="text-blue-600 fill-blue-100" />
                            <h3 className="font-bold text-xl text-black">Safety Toolkit</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer active:bg-gray-50">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><AlertCircle size={20} /></div>
                                <div className="flex-1">
                                    <div className="font-bold text-black">Emergency Call</div>
                                    <div className="text-xs text-gray-500">Call 911 immediately</div>
                                </div>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer active:bg-gray-50" onClick={() => { setShowSafetySheet(false); setShowShareSheet(true); }}>
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Share2 size={20} /></div>
                                <div className="flex-1">
                                    <div className="font-bold text-black">Share Trip Status</div>
                                    <div className="text-xs text-gray-500">Send live location to friends</div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowSafetySheet(false)} className="w-full mt-6 py-4 bg-gray-100 rounded-xl font-bold text-black">Close</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- SHARE SHEET --- */}
        <AnimatePresence>
            {showShareSheet && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
                    onClick={() => setShowShareSheet(false)}
                >
                    <motion.div 
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="bg-white w-full rounded-t-3xl p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-black">Share Trip Status</h3>
                            <button onClick={() => setShowShareSheet(false)} className="p-2 bg-gray-100 rounded-full text-black"><X size={20} /></button>
                        </div>

                        {shareSuccess ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center text-green-600">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Share2 size={24} />
                                </div>
                                <h4 className="font-bold text-lg">Sent to {shareSuccess}</h4>
                                <p className="text-sm text-gray-500">They can now track your ride live.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {contacts.filter(c => c.id !== 'shiloh').map(contact => (
                                    <div 
                                        key={contact.id} 
                                        onClick={() => handleShare(contact.firstName)}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer active:scale-95 transition-transform"
                                    >
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                                            {contact.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-black">{contact.firstName} {contact.lastName}</div>
                                            <div className="text-xs text-gray-500">{contact.phone}</div>
                                        </div>
                                        <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">Send</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer pointer-events-auto"
            onClick={onClose}
        >
            <div className="w-32 h-1.5 bg-black rounded-full opacity-20" />
        </div>
    </div>
  );
};
