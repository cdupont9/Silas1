
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Search, List, Calendar as CalendarIcon, MapPin, Clock, X, Send, Sparkles, CloudRain, Sun, Cloud, AlertCircle, Check, Video, Mail, MessageSquare, Bot, User, Mic, Car, Navigation, ArrowRight } from 'lucide-react';
import { generateSmartResponse } from '../../services/geminiService';
import { SilasLogo } from '../SilasApp';
import { CalendarEvent, ActiveRide } from '../../types';

interface CalendarAppProps {
  onClose: () => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  activeRide: ActiveRide;
  setActiveRide: React.Dispatch<React.SetStateAction<ActiveRide>>;
  onOpenJoyRide: () => void;
}

export const CalendarApp: React.FC<CalendarAppProps> = ({ onClose, events, setEvents, activeRide, setActiveRide, onOpenJoyRide }) => {
  const [selectedDay, setSelectedDay] = useState(1); // Set to Jan 1st
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Updated Data for Jan 2026
  const currentMonth = "January";
  const currentYear = 2026;
  const daysInMonth = 31;
  const startDayOffset = 4; // Jan 1 2026 is a Thursday
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getIcon = (name?: string) => {
      if(name === 'Sun') return Sun;
      if(name === 'Cloud') return Cloud;
      if(name === 'CloudRain') return CloudRain;
      return undefined;
  };

  const isZoom = (location: string) => location.toLowerCase().includes('zoom') || location.toLowerCase().includes('home');

  // Format date helper: "2026-01-01" from selectedDay
  const getSelectedDateString = () => {
      return `2026-01-${selectedDay < 10 ? '0' : ''}${selectedDay}`;
  };

  const currentDayEvents = events.filter(e => e.date === getSelectedDateString());

  // iOS-style colors map
  const getColorClass = (bgClass: string) => {
      if(bgClass.includes('orange')) return 'bg-orange-500';
      if(bgClass.includes('green')) return 'bg-green-500';
      if(bgClass.includes('blue')) return 'bg-blue-500';
      if(bgClass.includes('purple')) return 'bg-purple-500';
      if(bgClass.includes('pink')) return 'bg-pink-500';
      if(bgClass.includes('indigo')) return 'bg-indigo-500';
      return 'bg-blue-500';
  }

  const requestJoyRide = () => {
      if (selectedEvent) {
          setActiveRide({
              status: 'CONFIRMED',
              driverName: "Michael",
              carModel: "Toyota Camry",
              plateNumber: "8XYZ992",
              rating: "4.9",
              eta: "10:45 AM",
              destination: selectedEvent.location,
              source: 'CALENDAR',
              riderId: 'me'
          });
      }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="absolute inset-0 bg-white z-50 flex flex-col font-sans text-black overflow-hidden"
    >
        {/* --- MAIN HEADER --- */}
        <div className="pt-12 px-4 pb-2 flex justify-between items-end bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center gap-1 text-red-500 cursor-pointer active:opacity-50" onClick={onClose}>
                <ChevronLeft size={24} className="-ml-2" />
                <span className="text-[17px] font-medium">{currentYear}</span>
            </div>
            <div className="flex gap-5 text-red-500">
                <List size={24} />
                <Search size={24} />
                <Plus size={24} />
            </div>
        </div>

        {/* --- CALENDAR CONTENT --- */}
        <div className="flex-1 overflow-y-auto pb-24">
            {/* Month Header */}
            <div className="px-4 py-4 flex justify-between items-end">
                <div>
                    <h1 className="text-[34px] font-bold text-black leading-tight">{currentMonth}</h1>
                    <p className="text-gray-500">{currentYear}</p>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="px-2 mb-6">
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((d, i) => (
                        <div key={i} className="text-center text-[11px] font-semibold text-gray-400 uppercase">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-4">
                    {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `2026-01-${day < 10 ? '0' : ''}${day}`;
                        const isToday = day === 1; // Jan 1st is "today" in this sim context
                        const isSelected = day === selectedDay;
                        const hasEvent = events.some(e => e.date === dateStr);

                        return (
                            <div key={day} onClick={() => setSelectedDay(day)} className="flex flex-col items-center gap-1 cursor-pointer">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[19px] font-medium transition-colors ${isToday ? 'bg-red-500 text-white' : isSelected ? 'bg-black text-white' : 'text-black'}`}>
                                    {day}
                                </div>
                                <div className={`w-1.5 h-1.5 rounded-full ${hasEvent ? (isToday || isSelected ? 'bg-white/50' : 'bg-gray-400') : 'bg-transparent'}`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Agenda View */}
            <div className="bg-[#F2F2F7] min-h-[400px] border-t border-gray-200">
                <div className="px-4 py-3 bg-[#F2F2F7] sticky top-0 z-10 flex justify-between items-baseline border-b border-gray-200/50">
                    <span className="text-gray-500 text-sm font-semibold uppercase">{currentMonth} {selectedDay}, {currentYear}</span>
                    {selectedDay === 1 && <span className="text-blue-500 text-sm font-medium">Today</span>}
                </div>
                
                <div className="bg-white">
                    {currentDayEvents.length > 0 ? (
                        currentDayEvents.map((event) => {
                            const WeatherIcon = getIcon(event.weatherIconName);
                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex py-3 pr-4 ml-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group relative cursor-pointer"
                                >
                                    {/* Time Column */}
                                    <div className="flex flex-col items-end w-[70px] mr-3 shrink-0">
                                        <span className="text-[15px] font-semibold text-black leading-tight">{event.time}</span>
                                        <span className="text-[11px] text-gray-500 font-medium">{event.end}</span>
                                    </div>
                                    
                                    {/* Color Indicator */}
                                    <div className={`w-1 rounded-full ${getColorClass(event.color)} shrink-0 mr-3 self-stretch my-0.5`}></div>
                                    
                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-[17px] font-semibold text-black truncate leading-tight">{event.title}</h3>
                                        <div className="flex items-center gap-1 text-[13px] text-gray-500 mt-0.5">
                                            {isZoom(event.location) ? <Video size={10} /> : <MapPin size={10} />} 
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        {/* Weather Hint (Hidden if Zoom) */}
                                        {WeatherIcon && !isZoom(event.location) && event.notes && (
                                            <div className="flex items-center gap-1 text-[11px] text-blue-500 font-medium mt-1">
                                                <WeatherIcon size={10} />
                                                <span>{event.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <CalendarIcon size={40} className="opacity-20" />
                            <span className="text-sm font-medium">No Events</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- EVENT DETAIL OVERLAY --- */}
        <AnimatePresence>
            {selectedEvent && (
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute inset-0 bg-[#F2F2F7] z-50 flex flex-col"
                >
                    <div className="pt-12 px-4 pb-2 flex justify-between items-center bg-[#F2F2F7] border-b border-gray-200">
                        <button onClick={() => { setSelectedEvent(null); }} className="text-red-500 flex items-center gap-1 text-[17px]">
                            <ChevronLeft size={24} className="-ml-2" /> Back
                        </button>
                        <span className="font-semibold text-[17px]">Event Details</span>
                        <span className="text-red-500 font-medium text-[17px]">Edit</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Event Title Card */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderLeftColor: selectedEvent.color.replace('bg-', '').replace('-500', '') }}>
                            <h2 className="text-2xl font-bold text-black mb-1">{selectedEvent.title}</h2>
                            <p className="text-lg text-gray-500">{selectedEvent.location}</p>
                        </div>

                        {/* SILAS / JOYRIDE SUGGESTION */}
                        {!isZoom(selectedEvent.location) && (
                            <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                                
                                <div className="flex justify-between items-start mb-3 pl-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Silas Suggestion</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">{activeRide.status === 'IDLE' ? 'Recommendation' : 'Ride Active'}</span>
                                </div>

                                <div className="pl-2 mb-4">
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                        Traffic is light. I can schedule a ride to pick you up at <span className="font-bold text-black">10:45 AM</span> to ensure you arrive on time.
                                    </p>
                                </div>

                                <div className="pl-2">
                                    {activeRide.status === 'IDLE' ? (
                                        <button 
                                            onClick={requestJoyRide}
                                            className="w-full bg-black text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                                        >
                                            <Car size={16} /> Schedule JoyRide ($14.92)
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={onOpenJoyRide}
                                            className="w-full bg-green-50 text-green-700 border border-green-200 font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                        >
                                            <Check size={16} /> Ride Scheduled - View
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Time Card */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 flex justify-between items-center border-b border-gray-100">
                                <span className="text-gray-500">Starts</span>
                                <span className="text-black font-medium">{selectedEvent.date} at {selectedEvent.time}</span>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <span className="text-gray-500">Ends</span>
                                <span className="text-black font-medium">{selectedEvent.date} at {selectedEvent.end}</span>
                            </div>
                        </div>

                        {/* Weather Card (Conditional) */}
                        {(() => {
                            const WeatherIcon = getIcon(selectedEvent.weatherIconName);
                            if (!isZoom(selectedEvent.location) && WeatherIcon) {
                                return (
                                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 shadow-sm border border-blue-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                            <WeatherIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black">Weather Forecast</h3>
                                            <p className="text-sm text-gray-500">{selectedEvent.notes || "Conditions look good."}</p>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })()}

                        {/* SILAS INTELLIGENCE / EVIDENCE */}
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <Bot size={16} className="text-purple-600" />
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Silas Context</span>
                            </div>
                            
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 relative overflow-hidden">
                                {/* Context */}
                                <div className="flex gap-3 mb-4">
                                    <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Why is this here?</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{selectedEvent.silasContext}</p>
                                    </div>
                                </div>

                                {/* Evidence List */}
                                {selectedEvent.evidence && selectedEvent.evidence.length > 0 && (
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Supporting Evidence</span>
                                        {selectedEvent.evidence.map((ev, i) => (
                                            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-100">
                                                    {ev.type === 'email' && <Mail size={14} className="text-blue-500" />}
                                                    {ev.type === 'message' && <MessageSquare size={14} className="text-green-500" />}
                                                    {ev.type === 'voice' && <Mic size={14} className="text-orange-500" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-xs font-bold text-gray-900">{ev.source}</span>
                                                        <span className="text-[9px] text-gray-400">{ev.timestamp}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 truncate">"{ev.content}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Invitees (Mock) */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <span className="text-gray-500 text-sm block mb-3">Invitees</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">AV</div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">SM</div>
                                <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs">+</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex justify-between items-start px-6 pt-3 text-red-500 z-10">
            <span className="font-medium text-[17px]">Today</span>
            <span className="font-medium text-[17px]">Calendars</span>
            <span className="font-medium text-[17px]">Inbox</span>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer" onClick={onClose}>
            <div className="w-32 h-1.5 bg-black rounded-full opacity-20" />
        </div>
    </motion.div>
  );
};
