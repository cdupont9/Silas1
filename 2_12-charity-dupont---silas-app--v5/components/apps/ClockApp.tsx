
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, AlarmClock, Timer, Hourglass, Plus, Pause, Play, RefreshCw, Trash2 } from 'lucide-react';

interface ClockAppProps {
  onClose: () => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'WORLD' | 'ALARM' | 'STOPWATCH' | 'TIMER'>('WORLD');

  // World Clock State
  const [cities, setCities] = useState([
      { name: 'Palo Alto', offset: 0, time: '' },
      { name: 'New York', offset: 3, time: '' },
      { name: 'London', offset: 8, time: '' },
      { name: 'Tokyo', offset: 17, time: '' },
  ]);

  // Alarm State
  const [alarms, setAlarms] = useState([
      { id: 1, time: '07:00', label: 'Wake Up', active: true },
      { id: 2, time: '08:30', label: 'Meeting Prep', active: false },
  ]);

  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swInterval = useRef<any>(null);

  // Timer State
  const [timerDuration, setTimerDuration] = useState(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerInterval = useRef<any>(null);

  // --- EFFECTS ---

  // Update World Clocks
  useEffect(() => {
      const updateTimes = () => {
          const now = new Date();
          setCities(prev => prev.map(c => {
              const local = new Date(now.getTime() + c.offset * 3600000);
              return { 
                  ...c, 
                  time: local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/ AM| PM/, '') 
              };
          }));
      };
      updateTimes();
      const interval = setInterval(updateTimes, 1000);
      return () => clearInterval(interval);
  }, []);

  // Stopwatch Logic
  useEffect(() => {
      if (swRunning) {
          swInterval.current = setInterval(() => setSwTime(t => t + 10), 10);
      } else {
          clearInterval(swInterval.current);
      }
      return () => clearInterval(swInterval.current);
  }, [swRunning]);

  // Timer Logic
  useEffect(() => {
      if (timerRunning && timerRemaining > 0) {
          timerInterval.current = setInterval(() => setTimerRemaining(t => t - 1), 1000);
      } else {
          clearInterval(timerInterval.current);
          if (timerRemaining === 0) setTimerRunning(false);
      }
      return () => clearInterval(timerInterval.current);
  }, [timerRunning, timerRemaining]);

  // --- HELPERS ---
  const formatSw = (ms: number) => {
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const cs = Math.floor((ms % 1000) / 10);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}.${cs < 10 ? '0' : ''}${cs}`;
  };

  const formatTimer = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const toggleAlarm = (id: number) => {
      setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="absolute inset-0 bg-black text-white font-sans flex flex-col z-50">
        
        {/* --- WORLD CLOCK --- */}
        {activeTab === 'WORLD' && (
            <div className="flex-1 flex flex-col">
                <div className="pt-14 px-4 pb-2 flex justify-between items-center border-b border-gray-800">
                    <button className="text-orange-500 text-[17px]">Edit</button>
                    <h1 className="text-lg font-semibold">World Clock</h1>
                    <button className="text-orange-500"><Plus /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {cities.map((city, i) => (
                        <div key={i} className="flex justify-between items-center py-4 px-4 border-b border-gray-900">
                            <div>
                                <span className="text-gray-500 text-sm block">{city.offset === 0 ? 'Today' : city.offset > 0 ? `Today, +${city.offset}HRS` : `Yesterday`}</span>
                                <span className="text-xl font-normal">{city.name}</span>
                            </div>
                            <div className="text-5xl font-light">{city.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- ALARM --- */}
        {activeTab === 'ALARM' && (
            <div className="flex-1 flex flex-col">
                <div className="pt-14 px-4 pb-2 flex justify-between items-center border-b border-gray-800">
                    <button className="text-orange-500 text-[17px]">Edit</button>
                    <h1 className="text-lg font-semibold">Alarm</h1>
                    <button className="text-orange-500"><Plus /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-4">
                    <div className="py-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sleep | Wake Up</span>
                        <div className="flex justify-between items-center py-3 border-b border-gray-900">
                            <span className="text-5xl font-light text-gray-400">No Alarm</span>
                            <button className="bg-gray-800 text-gray-400 px-4 py-1.5 rounded-full text-sm font-bold">SET UP</button>
                        </div>
                    </div>
                    <div className="py-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Other</span>
                        {alarms.map(alarm => (
                            <div key={alarm.id} className="flex justify-between items-center py-4 border-b border-gray-900">
                                <div>
                                    <div className={`text-5xl font-light ${alarm.active ? 'text-white' : 'text-gray-500'}`}>{alarm.time}</div>
                                    <div className="text-gray-500 text-sm">{alarm.label}</div>
                                </div>
                                <div 
                                    onClick={() => toggleAlarm(alarm.id)}
                                    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${alarm.active ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${alarm.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- STOPWATCH --- */}
        {activeTab === 'STOPWATCH' && (
            <div className="flex-1 flex flex-col items-center pt-24">
                <div className="text-[5rem] font-light font-mono tabular-nums tracking-tight mt-10 mb-20">
                    {formatSw(swTime)}
                </div>
                <div className="flex gap-16 w-full justify-center px-8">
                    <button 
                        onClick={() => {
                            if (swRunning) {
                                setLaps(prev => [swTime, ...prev]);
                            } else {
                                setSwTime(0);
                                setLaps([]);
                            }
                        }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium border-2 border-gray-800 bg-gray-900 active:bg-gray-800`}
                    >
                        {swRunning ? 'Lap' : 'Reset'}
                    </button>
                    <button 
                        onClick={() => setSwRunning(!swRunning)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium border-2 ${swRunning ? 'border-red-900 bg-red-900/30 text-red-500' : 'border-green-900 bg-green-900/30 text-green-500'}`}
                    >
                        {swRunning ? 'Stop' : 'Start'}
                    </button>
                </div>
                <div className="flex-1 w-full px-4 mt-8 overflow-y-auto border-t border-gray-900">
                    {laps.map((lap, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-gray-900 text-lg">
                            <span className="text-gray-500">Lap {laps.length - i}</span>
                            <span className="font-mono">{formatSw(lap)}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- TIMER --- */}
        {activeTab === 'TIMER' && (
            <div className="flex-1 flex flex-col items-center justify-center pb-20">
                <div className="w-64 h-64 rounded-full border-4 border-gray-800 flex items-center justify-center relative mb-12">
                    <div 
                        className="absolute inset-0 rounded-full border-4 border-orange-500" 
                        style={{ clipPath: `inset(0 0 ${100 - (timerRemaining/timerDuration)*100}% 0)` }} // Simple visual
                    />
                    <div className="text-6xl font-light font-mono">
                        {formatTimer(timerRemaining)}
                    </div>
                </div>
                <div className="flex gap-16">
                    <button 
                        onClick={() => { setTimerRunning(false); setTimerRemaining(300); }}
                        className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-medium active:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => setTimerRunning(!timerRunning)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center font-medium ${timerRunning ? 'bg-orange-900/30 text-orange-500 border-2 border-orange-900' : 'bg-green-900/30 text-green-500 border-2 border-green-900'}`}
                    >
                        {timerRunning ? 'Pause' : 'Start'}
                    </button>
                </div>
            </div>
        )}

        {/* --- TAB BAR --- */}
        <div className="h-[83px] bg-[#1c1c1e] border-t border-gray-800 flex justify-around pt-2 pb-8">
            <button onClick={() => setActiveTab('WORLD')} className={`flex flex-col items-center gap-1 ${activeTab === 'WORLD' ? 'text-orange-500' : 'text-gray-500'}`}>
                <Globe size={24} />
                <span className="text-[10px] font-medium">World Clock</span>
            </button>
            <button onClick={() => setActiveTab('ALARM')} className={`flex flex-col items-center gap-1 ${activeTab === 'ALARM' ? 'text-orange-500' : 'text-gray-500'}`}>
                <AlarmClock size={24} />
                <span className="text-[10px] font-medium">Alarm</span>
            </button>
            <button onClick={() => setActiveTab('STOPWATCH')} className={`flex flex-col items-center gap-1 ${activeTab === 'STOPWATCH' ? 'text-orange-500' : 'text-gray-500'}`}>
                <Timer size={24} />
                <span className="text-[10px] font-medium">Stopwatch</span>
            </button>
            <button onClick={() => setActiveTab('TIMER')} className={`flex flex-col items-center gap-1 ${activeTab === 'TIMER' ? 'text-orange-500' : 'text-gray-500'}`}>
                <Hourglass size={24} />
                <span className="text-[10px] font-medium">Timer</span>
            </button>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end justify-center pb-2 cursor-pointer z-[60]" onClick={onClose}>
            <div className="w-32 h-1.5 bg-gray-500 rounded-full" />
        </div>
    </div>
  );
};
