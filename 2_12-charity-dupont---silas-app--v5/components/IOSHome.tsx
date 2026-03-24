
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWindow, MessageCircle, Phone, Compass, Camera, Settings, Wallet, Music, Calendar, Map, Mail, Cloud, Video, Calculator, StickyNote, Podcast, Store, Book, Activity, Moon, HardDrive, Plane, CreditCard, ShoppingBag, ArrowDownLeft, Search, ShoppingCart, Globe, Car, Navigation, Scan, Zap, Mic, ArrowRight, Lock, Receipt, X, Send } from 'lucide-react';
import { OSType, InteractiveContact, CalendarEvent, Transaction, GlobalCartItem, Song, Conversation, Email, Message, ActiveRide, SilasActivity, SilasAction } from '../types';
import { SilasApp, SilasLogo } from './SilasApp';
import { PhoneApp } from './apps/PhoneApp';
import { MessagesApp } from './apps/MessagesApp';
import { MusicApp } from './apps/MusicApp';
import { SafariApp } from './apps/SafariApp';
import { ZionStoreApp } from './apps/ZionStoreApp';
import { CharityBankApp } from './apps/CharityBankApp';
import { WalletApp } from './apps/WalletApp';
import { AppStoreApp } from './apps/AppStoreApp';
import { SettingsApp } from './apps/SettingsApp';
import { UnsentDrivesApp } from './apps/UnsentDrivesApp';
import { MailApp } from './apps/MailApp';
import { BooksApp } from './apps/BooksApp';
import { WeatherApp } from './apps/WeatherApp';
import { CalendarApp } from './apps/CalendarApp';
import { CharityFlyApp } from './apps/CharityFlyApp';
import { PhotosApp } from './apps/PhotosApp';
import { SilasSearchApp } from './apps/SilasSearchApp';
import { JoyRideApp } from './apps/JoyRideApp';
import { LostFoundApp } from './apps/LostFoundApp';
import { SilasShopApp } from './apps/SilasShopApp';
import { ClockApp } from './apps/ClockApp';
import { StatusBar } from './StatusBar';
import { generateSmartResponse, parseVoiceCommand, generateSpeech } from '../services/geminiService';

// Audio Helpers
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  let alignedData = data;
  if (data.byteLength % 2 !== 0) {
      alignedData = data.slice(0, data.byteLength - 1);
  }
  
  const dataInt16 = new Int16Array(alignedData.buffer.slice(alignedData.byteOffset, alignedData.byteOffset + alignedData.byteLength));
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface IOSHomeProps {
  onSwitchOS: (os: OSType) => void;
}

const AppIconImage = ({ src }: { src: string }) => (
  <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] shadow-md relative overflow-hidden">
    <img src={src} alt="App Icon" className="w-full h-full object-cover" />
  </div>
);

export const IOSHome: React.FC<IOSHomeProps> = ({ onSwitchOS }) => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [[page, direction], setPage] = useState([0, 0]);
  
  const [installedApps, setInstalledApps] = useState<string[]>(['zion', 'charityfly', 'lostfound', 'silas-shop']);
  const [networkMode, setNetworkMode] = useState<'STANDARD' | 'EMERGENCY'>('STANDARD');
  const [userLocation, setUserLocation] = useState("New York");

  // --- PERSISTENT STATE ---
  const [silasConfig, setSilasConfig] = useState({
      permissionsGranted: true, 
      isSignedIn: true,
      wakeWordEnabled: true
  });
  
  const [silasActivityLog, setSilasActivityLog] = useState<SilasActivity[]>([]);
  
  // VOICE INTERFACE STATE
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Conversational Context for Multi-turn (Weather -> Outfit)
  const [lastSilasQuestion, setLastSilasQuestion] = useState<string | undefined>(undefined);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef = useRef<any>(null);

  // 0.5 JOYRIDE STATE
  const [activeRide, setActiveRide] = useState<ActiveRide>({
      status: 'IDLE'
  });

  // 1. MUSIC STATE
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      if (currentSong && audioRef.current) {
          audioRef.current.src = currentSong.url;
          if (isPlaying) audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
      }
  }, [currentSong]);

  useEffect(() => {
      if (audioRef.current) {
          isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
      }
  }, [isPlaying]);

  // 2. MESSAGES STATE
  const [contacts, setContacts] = useState<InteractiveContact[]>([
      { id: 'daniel', firstName: 'Daniel', lastName: 'Sawyer', initials: 'DS', label: 'husband', phone: '(555) 928-1029', isFavorite: true, relation: 'Husband', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { id: 'c2', firstName: 'Mom', lastName: '', initials: 'M', label: 'mobile', phone: '(555) 291-0021', isFavorite: true, relation: 'Mother', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?auto=format&fit=crop&w=200&q=80' },
      { id: 'talulah', firstName: 'Talulah', lastName: '', initials: 'T', label: 'daughter', phone: '(555) 888-9999', isFavorite: true, relation: 'Daughter', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80' },
      { id: 'shiloh', firstName: 'Shiloh', lastName: '', initials: 'S', label: 'mobile', phone: '(555) 111-2222', isFavorite: true, relation: 'Best Friend (Deceased)', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      { id: 'c3', firstName: 'Sarah', lastName: 'Miller', initials: 'SM', label: 'friend', phone: '(555) 333-4444', relation: 'Friend', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { id: 'c6', firstName: 'Dr.', lastName: 'Aris', initials: 'DA', label: 'work', phone: '(555) 555-0123', relation: 'Therapist', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=200&q=80' },
      { id: 'c7', firstName: 'Dad', lastName: '', initials: 'D', label: 'mobile', phone: '(555) 123-4567', relation: 'Father', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
      { id: 'c9', firstName: 'Pizza', lastName: 'Place', initials: 'P', label: 'other', phone: '(555) 000-0000', relation: 'Service', avatar: 'text' },
      { id: 'c10', firstName: 'Thomas', lastName: '', initials: 'T', label: 'mobile', phone: '(555) 666-0666', relation: 'Ex', avatar: 'img', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_daniel', contactId: 'daniel', unread: true,
      messages: [
        { id: 'm1', text: 'Hey, are you still at work?', isMe: false, timestamp: new Date(Date.now() - 17200000) },
        { id: 'm2', text: 'Yeah, wrapping up soon.', isMe: true, timestamp: new Date(Date.now() - 17000000) },
        { id: 'm3', text: 'Hunter is out of dog food, can you order some?', isMe: false, timestamp: new Date(Date.now() - 86400000) }, 
        { id: 'm4', text: 'On it. I think Juno has express delivery.', isMe: true, timestamp: new Date(Date.now() - 86300000) },
        { id: 'm5', text: 'Love you. Drive safe.', isMe: false, timestamp: new Date(Date.now() - 6500000) },
        { id: 'm6', text: '', image: 'https://media.tenor.com/P5aaR8W0K7QAAAAM/dog-tired.gif', isMe: true, timestamp: new Date(Date.now() - 6400000) },
        { id: 'm7', text: 'Lol same.', isMe: false, timestamp: new Date(Date.now() - 6300000) },
        { id: 'm8', text: 'Can you pick up the dry cleaning on your way?', isMe: false, timestamp: new Date(Date.now() - 3600000) },
        { id: 'm9', text: 'Leaving now. See you in 20.', isMe: true, timestamp: new Date(Date.now() - 1200000) }
      ]
    },
    {
      id: 'conv_mom', contactId: 'c2', unread: false,
      messages: [
         { id: 'm1', text: 'Did you call? I missed it.', isMe: false, timestamp: new Date(Date.now() - 86400000 * 2) },
         { id: 'm2', text: 'Just checking in. I was busy earlier.', isMe: true, timestamp: new Date(Date.now() - 86000000 * 2) },
         { id: 'm3', text: 'Are we still on for Sunday dinner?', isMe: false, timestamp: new Date(Date.now() - 85000000 * 2) },
         { id: 'm4', text: 'Yes! Bring the girls.', isMe: false, timestamp: new Date(Date.now() - 84000000 * 2) },
         { id: 'm5', text: 'Did you get the package I sent?', isMe: false, timestamp: new Date(Date.now() - 86400000) },
         { id: 'm6', text: 'Not yet, tracking says tomorrow.', isMe: true, timestamp: new Date(Date.now() - 86000000) },
         { id: 'm7', text: 'Okay let me know. It is something for the house.', isMe: false, timestamp: new Date(Date.now() - 85000000) },
         { id: 'm8', text: 'Also call your Aunt Linda, it is her birthday.', isMe: false, timestamp: new Date(Date.now() - 1000000) }
      ]
    },
    {
      id: 'conv_shiloh', contactId: 'shiloh', unread: false,
      messages: [
         { id: 's1', text: 'Look at this throwback I found!', isMe: true, timestamp: new Date('2023-08-20T10:00:00') },
         { id: 's2', text: '', image: 'https://media.tenor.com/2z2X7q6X2cQAAAAM/best-friends-happy.gif', isMe: true, timestamp: new Date('2023-08-20T10:01:00') },
         { id: 's3', text: 'OMG stop, my hair looked insane back then 😂', isMe: false, timestamp: new Date('2023-08-20T10:05:00') },
         { id: 's4', text: 'We need to go back to that cabin.', isMe: false, timestamp: new Date('2023-08-20T10:06:00') },
         { id: 's5', text: 'Leaving for the hike now. Reception will be spotty.', isMe: false, timestamp: new Date('2023-08-23T07:00:00') },
         { id: 's6', text: 'Be safe! Text me when you get back.', isMe: true, timestamp: new Date('2023-08-23T07:02:00') },
         { id: 's7', text: 'Should be at the summit in an hour. View is unreal.', isMe: false, timestamp: new Date('2023-08-23T11:30:00') },
         { id: 's8', text: 'Send pics!!', isMe: true, timestamp: new Date('2023-08-23T11:32:00') }
      ]
    },
    {
      id: 'conv_sarah', contactId: 'c3', unread: true,
      messages: [
         { id: 'sa1', text: 'Brunch this weekend?', isMe: false, timestamp: new Date(Date.now() - 120000000) },
         { id: 'sa2', text: 'I can do Saturday!', isMe: true, timestamp: new Date(Date.now() - 110000000) },
         { id: 'sa3', text: 'Perfect. The usual spot?', isMe: false, timestamp: new Date(Date.now() - 100000000) },
         { id: 'sa4', text: 'See you there 🥂', isMe: false, timestamp: new Date(Date.now() - 95000000) },
         { id: 'sa5', text: 'Are you bringing Daniel?', isMe: false, timestamp: new Date(Date.now() - 5000000) },
         { id: 'sa6', text: 'No, girls trip!', isMe: true, timestamp: new Date(Date.now() - 4000000) },
         { id: 'sa7', text: 'Yessss. I have so much to tell you.', isMe: false, timestamp: new Date(Date.now() - 1000000) }
      ]
    },
    {
        id: 'conv_thomas', contactId: 'c10', unread: false,
        messages: [
            { id: 't1', text: 'Can I come get my hoodies?', isMe: false, timestamp: new Date('2023-07-10T14:00:00') },
            { id: 't2', text: 'I put them in a box on the porch.', isMe: true, timestamp: new Date('2023-07-10T14:05:00') },
            { id: 't3', text: 'Wow. Okay.', isMe: false, timestamp: new Date('2023-07-10T14:10:00') },
            { id: 't4', text: 'I miss you.', isMe: false, timestamp: new Date('2023-07-20T02:00:00') }
        ]
    }
  ]);

  const handleSendMessage = (text: string, contactId: string) => {
      // 1. Add User Message
      const userMsg: Message = { id: Date.now().toString(), text, isMe: true, timestamp: new Date() };
      setConversations(prev => {
          const exists = prev.find(c => c.contactId === contactId);
          if (exists) {
              return prev.map(c => c.contactId === contactId ? { ...c, messages: [...c.messages, userMsg], unread: false } : c);
          } else {
              return [...prev, { id: `conv_${contactId}`, contactId, messages: [userMsg], unread: false }];
          }
      });

      // 2. Schedule AI Reply (Background Task)
      setTimeout(async () => {
          try {
              const contact = contacts.find(c => c.id === contactId);
              if (!contact) return;
              
              let prompt = `You are ${contact.firstName} ${contact.lastName}. Relationship: ${contact.relation}. Replying to text: "${text}". Keep it very short.`;
              if (contact.id === 'shiloh') prompt += " You are deceased. This is a dream/glitch. Be vague.";
              
              const replyText = await generateSmartResponse(text, prompt);
              
              const replyMsg: Message = { id: (Date.now() + 1).toString(), text: replyText, isMe: false, timestamp: new Date() };
              setConversations(prev => prev.map(c => c.contactId === contactId ? { ...c, messages: [...c.messages, replyMsg], unread: activeApp !== 'messages' } : c));
          } catch(e) { console.error(e); }
      }, 3000 + Math.random() * 2000);
  };

  const handleShareItinerary = (contactId: string, details: string) => {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const userMsg: Message = { 
          id: Date.now().toString(), 
          text: `Check out my trip! ${details}`, 
          isMe: true, 
          timestamp: new Date() 
      };

      setConversations(prev => {
          const exists = prev.find(c => c.contactId === contactId);
          if (exists) {
              return prev.map(c => c.contactId === contactId ? { ...c, messages: [...c.messages, userMsg], unread: false } : c);
          } else {
              return [...prev, { id: `conv_${contactId}`, contactId, messages: [userMsg], unread: false }];
          }
      });
  };

  // 3. MAIL STATE
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1', sender: 'Silas Intelligence', subject: 'Weekly Report: Digital Footprint', preview: 'Your weekly privacy summary is ready...', body: `Hello Eloise,\n\nYour weekly data privacy summary is ready for review. We have blocked 14 tracking attempts and secured 3 passwords.\n\n- Silas System`, time: '10:42 AM', dateFull: 'Today at 10:42 AM', unread: true, isVip: true, avatarColor: 'bg-black', initials: 'SI', to: 'Eloise Sawyer'
    },
    {
      id: '2', sender: 'Juno', subject: 'Order #8821 Shipped', preview: 'Your Omni-Bone is on the way.', body: `Hi Eloise,\n\nGood news! Your order #8821 has shipped via Drone Express. Track your package in the Silas Shop app.\n\nItems:\n- Omni-Bone (L)\n- Organic Treats`, time: 'Yesterday', dateFull: 'Yesterday at 4:20 PM', unread: true, isVip: false, avatarColor: 'bg-black', initials: 'J', to: 'Eloise Sawyer'
    },
    {
      id: '3', sender: 'Dr. Aris', subject: 'Appointment Confirmation', preview: 'See you next Tuesday at 10am.', body: `Dear Eloise,\n\nThis is a reminder for your upcoming session on Tuesday, Jan 5th at 10:00 AM.\n\nPlease let us know 24 hours in advance if you need to reschedule.\n\nBest,\nDr. Aris Office`, time: 'Yesterday', dateFull: 'Yesterday at 9:00 AM', unread: false, isVip: true, avatarColor: 'bg-purple-500', initials: 'DA', to: 'Eloise Sawyer'
    },
    {
      id: '4', sender: 'Netflix', subject: 'New sign-in on Mac', preview: 'We noticed a new login from...', body: `Hi Eloise,\n\nWe detected a new sign-in to your Netflix account from a Mac device in Seattle, WA.\n\nIf this was you, you can ignore this email. If not, please reset your password immediately.`, time: 'Tuesday', dateFull: 'Tuesday at 11:15 PM', unread: true, isVip: false, avatarColor: 'bg-red-600', initials: 'N', to: 'Eloise Sawyer'
    },
    {
      id: '5', sender: 'Dad', subject: 'Checking in', preview: 'Hope the car is running ok.', body: `Hey kiddo,\n\nJust wanted to make sure you got that tire checked out. Don't let it go too long.\n\nLove, Dad`, time: 'Monday', dateFull: 'Monday at 8:30 PM', unread: false, isVip: false, avatarColor: 'bg-green-600', initials: 'D', to: 'Eloise Sawyer'
    },
    {
      id: '6', sender: 'The Morning Brew', subject: 'Tech stocks tumble, AI rises', preview: 'Todays top stories in tech and finance.', body: `Good morning,\n\nHere is what is happening in the markets today...\n\n[Link to full article]`, time: 'Monday', dateFull: 'Monday at 6:00 AM', unread: false, isVip: false, avatarColor: 'bg-blue-400', initials: 'MB', to: 'Eloise Sawyer'
    }
  ]);

  // 4. CART & TRANSACTIONS
  const [globalCart, setGlobalCart] = useState<GlobalCartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([
      { id: 't1', merchant: 'Sephora', category: 'Beauty & Cosmetics', amount: '-$142.50', date: 'Today', type: 'debit', icon: CreditCard, color: 'bg-pink-100 text-pink-600' },
      { id: 't4', merchant: 'Whole Foods Market', category: 'Groceries', amount: '-$350.22', date: 'Today', type: 'debit', icon: ShoppingCart, color: 'bg-green-100 text-green-600' },
      { id: 't3', merchant: 'Daniel Sawyer', category: 'Wire Transfer', amount: '+$8,500.00', date: 'Yesterday', type: 'credit', icon: ArrowDownLeft, color: 'bg-green-100 text-green-600' },
  ]);

  // Shared Calendar State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: 1, title: "Talulah's Recital", date: "2026-01-01", time: "10:00 AM", end: "12:00 PM", location: "Community Center", type: "Personal", color: "bg-pink-500", weatherIconName: 'Cloud', notes: "Forecast OK", silasContext: "Bring flowers.", evidence: [] },
    { id: 2, title: "New Year's Brunch", date: "2026-01-01", time: "11:00 AM", end: "1:00 PM", location: "Home", type: "Social", color: "bg-orange-500", weatherIconName: 'Sun', silasContext: "Tradition with Mom & Dad.", evidence: [] },
    { id: 3, title: "School Pickup", date: "2026-01-01", time: "3:00 PM", end: "3:30 PM", location: "Elementary School", type: "Personal", color: "bg-green-500", weatherIconName: 'Cloud', notes: "Forecast OK", silasContext: "Don't be late.", evidence: [] },
    { id: 4, title: "Vet for Hunter", date: "2026-01-01", time: "4:00 PM", end: "5:00 PM", location: "Palo Alto Vet", type: "Personal", color: "bg-blue-500", weatherIconName: 'Sun', notes: "Forecast OK", silasContext: "Annual checkup.", evidence: [] },
    { id: 5, title: "Dinner with Daniel", date: "2026-01-01", time: "7:00 PM", end: "9:00 PM", location: "Nobu", type: "Social", color: "bg-purple-500", weatherIconName: 'Moon', silasContext: "Date night.", evidence: [] },
    { id: 6, title: "Dr. Aris Appointment", date: "2026-01-05", time: "9:00 AM", end: "10:00 AM", location: "Medical Center", type: "Personal", color: "bg-blue-500", weatherIconName: 'CloudRain', silasContext: "Prescription renewal.", evidence: [] },
    { id: 7, title: "Juno Strategy Call", date: "2026-01-05", time: "2:00 PM", end: "3:00 PM", location: "Zoom", type: "Work", color: "bg-purple-500", weatherIconName: 'Cloud', silasContext: "Q1 Planning.", evidence: [] },
  ]);

  // --- SILAS VOICE LOGIC ---
  const stopAudio = () => {
      if (audioContextRef.current) {
          audioContextRef.current.suspend();
          if (activeSourceRef.current) {
              try { activeSourceRef.current.stop(); } catch(e) {}
              activeSourceRef.current = null;
          }
      }
      setIsVoiceSpeaking(false);
  };

  const speakResponse = async (text: string) => {
      // Audio disabled by user request
      return;
  };

  const handleVoiceTranscript = async (transcript: string) => {
      // Prevent Silas from responding to his own voice output loop
      if (isVoiceSpeaking || isVoiceProcessing) return;

      const normalized = transcript.toLowerCase();
      let command = "";
      
      // Wake Word Logic - Headless Mode (No UI)
      if (silasConfig.wakeWordEnabled && (normalized.includes("hey silas") || normalized.includes("silas") || normalized.startsWith("hi silas"))) {
          command = normalized;
      } else {
          return; // Ignore background noise
      }

      setVoiceTranscript(transcript);
      setIsVoiceProcessing(true);
      
      // DISABLED: Silas Action Logic
      // The user requested that Silas not perform any automatic actions.
      // We process the command to get a potential text response (if we wanted to log it), 
      // but we do NOT execute any app switching or state changes.
      
      const context = `User Location: ${userLocation}. Current App: ${activeApp || 'Home'}.`;
      // We still parse to simulate "thinking" but ignore the result payload
      await parseVoiceCommand(command, context, lastSilasQuestion);
      
      setIsVoiceProcessing(false);
      
      // Log Activity (but do nothing else)
      const newActivity: SilasActivity = {
          id: Date.now().toString(),
          action: "IGNORED", // Explicitly mark as ignored/inert
          detail: `Heard: "${transcript}" (Action disabled)`,
          timestamp: new Date(),
          type: 'VOICE',
          iconName: 'Mic'
      };
      setSilasActivityLog(prev => [newActivity, ...prev]);
  };

  // --- ROBUST PASSIVE LISTENING LOOP ---
  useEffect(() => {
      let recognition: any = null;

      const startListening = () => {
          if ('webkitSpeechRecognition' in window) {
              const SpeechRecognition = (window as any).webkitSpeechRecognition;
              recognition = new SpeechRecognition();
              recognition.continuous = true;
              recognition.interimResults = false;
              recognition.lang = 'en-US';

              recognition.onresult = (event: any) => {
                  const lastResultIdx = event.results.length - 1;
                  const text = event.results[lastResultIdx][0].transcript;
                  handleVoiceTranscript(text);
              };

              recognition.onend = () => {
                  try {
                      recognition.start();
                  } catch (e) {
                      // console.log("Restarting recognition...");
                  }
              };

              try {
                  recognition.start();
                  setIsListening(true);
                  recognitionRef.current = recognition;
              } catch (e) {
                  console.error("Start error", e);
              }
          }
      };

      const handleInteraction = () => {
          if (!recognitionRef.current) startListening();
      };
      
      window.addEventListener('click', handleInteraction);
      startListening();

      return () => {
          window.removeEventListener('click', handleInteraction);
          if (recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current = null;
          }
      };
  }, [silasConfig.wakeWordEnabled]); // Re-init listening if config changes, though handleVoiceTranscript logic handles the gate logic


  const installableAppsRegistry: Record<string, any> = {
      'zion': {
        name: 'Juno', isSpecial: true, action: () => setActiveApp('zion'),
        component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-white flex items-center justify-center shadow-md relative overflow-hidden"><div className="text-black font-serif tracking-widest font-bold text-[10px]">JUNO</div></div>
      },
      'charityfly': {
        name: 'Lifetime Flights', isSpecial: true, action: () => setActiveApp('charityfly'),
        component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-sky-100 flex items-center justify-center shadow-md border border-sky-200"><Plane size={24} className="text-sky-600 mb-0.5" /></div>
      },
      'unsent': {
        name: 'Unsent Drafts', isSpecial: true, action: () => setActiveApp('unsent'),
        component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-[#0f172a] flex items-center justify-center shadow-md border border-gray-700"><HardDrive size={28} className="text-green-500" /></div>
      },
      'silas-shop': {
        name: 'Silas Shop', isSpecial: true, action: () => setActiveApp('silas-shop'),
        component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-[#0a0a0f] flex items-center justify-center shadow-md border border-purple-900 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 to-transparent" /><ShoppingBag size={24} className="text-purple-400 relative z-10" /></div>
      },
      'lostfound': {
        name: 'Lost & Found', isSpecial: true, action: () => setActiveApp('lostfound'),
        component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-[#2c2c2e] flex items-center justify-center shadow-md border border-gray-700"><Scan size={28} className="text-orange-500" /></div>
      }
  };

  const handleInstallApp = (appId: string) => {
      if (!installedApps.includes(appId)) setInstalledApps(prev => [...prev, appId]);
  };

  // Base Apps
  const baseApps = [
    { name: 'FaceTime', component: <AppIconImage src="https://i.postimg.cc/qqYYftYQ/Face-Time-i-OS-svg.png" /> },
    { name: 'Calendar', isSpecial: true, action: () => setActiveApp('calendar'), component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-white flex flex-col items-center justify-center shadow-md font-sans"><span className="text-[10px] font-bold text-red-500 uppercase mt-1">THU</span><span className="text-[2.2rem] font-light text-black -mt-1 tracking-tighter leading-none">1</span></div> },
    { name: 'Photos', isSpecial: true, action: () => setActiveApp('photos'), component: <AppIconImage src="https://i.postimg.cc/rwFxCxX7/ios-photos.jpg" /> }, 
    { name: 'Camera', component: <AppIconImage src="https://i.postimg.cc/CxYyw859/Fotocamera-(i-OS).png" /> },
    { name: 'Mail', isSpecial: true, action: () => setActiveApp('mail'), component: <AppIconImage src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg" /> },
    { name: 'Clock', isSpecial: true, action: () => setActiveApp('clock'), component: <AppIconImage src="https://i.postimg.cc/7685mXmf/Clock-(i-OS).png" /> },
    { name: 'Maps', component: <AppIconImage src="https://i.postimg.cc/9F3LyjdW/Apple-Maps-Logo-3D.png" /> },
    { name: 'Weather', isSpecial: true, action: () => setActiveApp('weather'), component: <AppIconImage src="https://i.postimg.cc/zX8pBFwS/Weather-(i-OS).png" /> },
    { name: 'Settings', isSpecial: true, action: () => setActiveApp('settings'), component: <AppIconImage src="https://i.postimg.cc/85C02jvp/free-apple-settings-icon-svg-download-png-493162.webp" /> },
    { name: 'Wallet', action: () => setActiveApp('wallet'), isSpecial: true, component: <AppIconImage src="https://i.postimg.cc/TPbwr31d/png-clipart-apple-wallet-apple-pay-ios-9-apple-rectangle-payment-thumbnail.png" /> },
    { name: 'JoyRide', isSpecial: true, action: () => setActiveApp('joyride'), component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-white flex items-center justify-center shadow-md relative overflow-hidden"><div className="absolute inset-0 bg-black text-white flex items-center justify-center font-bold text-lg">JoyRide</div></div> },
    { name: 'Bank of Charity', isSpecial: true, action: () => setActiveApp('charity'), component: <AppIconImage src="https://i.postimg.cc/8zdRWb9r/Bank-of-Charity.png" /> },
    { name: 'Books', isSpecial: true, action: () => setActiveApp('books'), component: <AppIconImage src="https://i.postimg.cc/wTzC5JzJ/free_apple_ibooks_icon_svg_download_png_493146.webp" /> },
    { name: 'Silas', isSpecial: true, action: () => setActiveApp('silas'), component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-black flex items-center justify-center shadow-md relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-black" /><div className="relative z-10 w-8 h-8 rounded-full border border-indigo-500 flex items-center justify-center"><Activity size={18} className="text-indigo-400" /></div></div> },
    { name: 'Silas Search', isSpecial: true, action: () => setActiveApp('silas-search'), component: <div className="w-[3.8rem] h-[3.8rem] rounded-[14px] bg-white flex items-center justify-center shadow-md border border-purple-200"><SilasLogo className="w-8 h-8" /></div> },
    { name: 'App Store', isSpecial: true, action: () => setActiveApp('appstore'), component: <AppIconImage src="https://i.postimg.cc/jS73GSRH/App-Store-(i-OS)-svg.png" /> },
  ];

  const displayedApps = useMemo(() => {
      const installedComponents = installedApps.map(id => installableAppsRegistry[id]).filter(Boolean);
      return [...baseApps, ...installedComponents];
  }, [installedApps]);

  const chunk = (arr: any[], size: number) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  const pages = chunk(displayedApps, 20);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
        setPage([newPage, newDirection]);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 320 : -320,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 320 : -320,
      opacity: 0
    })
  };

  const statusBarColor = useMemo(() => {
      if (!activeApp) return 'white';
      if (['music', 'silas', 'silence2', 'silas-shop', 'unsent', 'lostfound', 'appstore', 'weather'].includes(activeApp)) {
          return 'white';
      }
      return 'black';
  }, [activeApp]);

  return (
    <div className="h-full w-full bg-black relative overflow-hidden">
      
      {/* Background Audio Player (Hidden) */}
      <audio ref={audioRef} loop={false} onEnded={() => setIsPlaying(false)} />

      {/* --- WALLPAPER (Restored and Fixed Z-Index) --- */}
      <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 z-0"
          style={{
              backgroundImage: 'url("https://i.postimg.cc/kXgL18YZ/IMG-0402.jpg")',
              filter: activeApp ? 'blur(20px) brightness(0.4)' : 'blur(0px) brightness(0.9)',
              transform: activeApp ? 'scale(1.1)' : 'scale(1)'
          }}
      />

      {/* --- APPS LAYER (Rendered First, Above Wallpaper) --- */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
            {activeApp && (
                <div className="pointer-events-auto w-full h-full absolute inset-0">
                    {activeApp === 'joyride' && (
                        <JoyRideApp 
                            onClose={() => setActiveApp(null)} 
                            activeRide={activeRide}
                            setActiveRide={setActiveRide}
                            contacts={contacts}
                        />
                    )}
                    {activeApp === 'silas' && (
                        <SilasApp 
                            onClose={() => setActiveApp(null)} 
                            silasConfig={silasConfig}
                            setSilasConfig={setSilasConfig}
                            onOpenApp={setActiveApp}
                            activityLog={silasActivityLog}
                        />
                    )}
                    {activeApp === 'silas-shop' && (
                        <SilasShopApp 
                            onClose={() => setActiveApp(null)} 
                            cart={globalCart}
                            setCart={setGlobalCart}
                        />
                    )}
                    {activeApp === 'silas-search' && (
                        <SilasSearchApp 
                            onClose={() => setActiveApp(null)} 
                            addToCart={(item) => setGlobalCart(prev => [...prev, item])}
                        />
                    )}
                    {activeApp === 'clock' && <ClockApp onClose={() => setActiveApp(null)} />}
                    {activeApp === 'phone' && <PhoneApp onClose={() => setActiveApp(null)} contacts={contacts} setContacts={setContacts} networkMode={networkMode} />}
                    {activeApp === 'messages' && <MessagesApp onClose={() => setActiveApp(null)} contacts={contacts} setContacts={setContacts} conversations={conversations} setConversations={setConversations} onSendMessage={handleSendMessage} />}
                    {activeApp === 'mail' && <MailApp onClose={() => setActiveApp(null)} emails={emails} setEmails={setEmails} />}
                    {activeApp === 'music' && <MusicApp onClose={() => setActiveApp(null)} currentSong={currentSong} isPlaying={isPlaying} onPlay={(s) => { setCurrentSong(s); setIsPlaying(true); }} onPause={() => setIsPlaying(false)} onNext={() => {}} onPrev={() => {}} />}
                    {activeApp === 'safari' && <SafariApp onClose={() => setActiveApp(null)} />}
                    {activeApp === 'zion' && <ZionStoreApp onClose={() => setActiveApp(null)} onTransaction={(t) => setTransactions(prev => [t, ...prev])} cart={globalCart} addToCart={(i) => setGlobalCart(p => [...p, i])} removeFromCart={(id) => setGlobalCart(p => p.filter(x => x.id !== id))} />}
                    {activeApp === 'charity' && <CharityBankApp onClose={() => setActiveApp(null)} transactions={transactions} onAddToCart={(i) => setGlobalCart(p => [...p, { ...i }])} />}
                    {activeApp === 'charityfly' && <CharityFlyApp onClose={() => setActiveApp(null)} onShareContext={handleShareItinerary} />}
                    {activeApp === 'appstore' && <AppStoreApp onClose={() => setActiveApp(null)} installedApps={installedApps} onInstall={handleInstallApp} onOpenApp={setActiveApp} />}
                    {activeApp === 'settings' && (
                        <SettingsApp 
                            onClose={() => setActiveApp(null)} 
                            networkMode={networkMode} 
                            setNetworkMode={setNetworkMode} 
                            silasConfig={silasConfig}
                            setSilasConfig={setSilasConfig}
                        />
                    )}
                    {activeApp === 'wallet' && <WalletApp onClose={() => setActiveApp(null)} onOpenApp={setActiveApp} />}
                    {activeApp === 'unsent' && <UnsentDrivesApp onClose={() => setActiveApp(null)} />}
                    {activeApp === 'books' && <BooksApp onClose={() => setActiveApp(null)} addToCart={(item) => setGlobalCart(prev => [...prev, item])} />}
                    {activeApp === 'photos' && <PhotosApp onClose={() => setActiveApp(null)} />}
                    {activeApp === 'weather' && <WeatherApp onClose={() => setActiveApp(null)} calendarEvents={calendarEvents} />}
                    {activeApp === 'calendar' && (
                        <CalendarApp 
                            onClose={() => setActiveApp(null)} 
                            events={calendarEvents} 
                            setEvents={setCalendarEvents} 
                            activeRide={activeRide}
                            setActiveRide={setActiveRide}
                            onOpenJoyRide={() => setActiveApp('joyride')}
                        />
                    )}
                    {activeApp === 'lostfound' && <LostFoundApp onClose={() => setActiveApp(null)} />}
                </div>
            )}
        </AnimatePresence>
      </div>

      <div className="absolute top-0 left-0 w-full z-[60] pointer-events-none">
          <StatusBar os={OSType.IOS} color={statusBarColor} showLock={!activeApp} />
      </div>
      
      {/* Grid (Hidden when app active) */}
      <div className={`absolute inset-0 flex flex-col pt-14 pb-2 transition-all duration-300 z-10 ${activeApp ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
          <div className="flex-1 w-full relative">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div 
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 px-6 grid grid-cols-4 gap-x-5 gap-y-10 content-start pt-8"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x;
                        if (swipe < -30) {
                            paginate(1);
                        } else if (swipe > 30) {
                            paginate(-1);
                        }
                    }}
                    style={{ touchAction: 'pan-y' }}
                >
                    {pages[page] && pages[page].map((app) => (
                        <motion.div key={app.name} whileTap={{ scale: 0.9 }} onClick={app.action} className="flex flex-col items-center gap-2 cursor-pointer select-none">
                            {app.component}
                            <span className="text-[11px] font-medium text-white tracking-normal drop-shadow-lg text-center leading-3 h-3 overflow-visible text-shadow">{app.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mb-6 relative z-10">
            {pages.map((_, i) => (
                <div 
                    key={i} 
                    onClick={() => setPage([i, i > page ? 1 : -1])} 
                    className={`w-2 h-2 rounded-full shadow-sm transition-colors cursor-pointer ${i === page ? 'bg-white' : 'bg-white/40'}`} 
                />
            ))}
          </div>

          <div className="mx-3 mb-2 h-[5.5rem] bg-white/20 backdrop-blur-2xl rounded-[2.2rem] flex items-center justify-center relative z-10 gap-5 px-4 shadow-lg border border-white/10">
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setActiveApp('phone')} className="w-[3.8rem] h-[3.8rem] cursor-pointer"><AppIconImage src="https://i.postimg.cc/Fsqj5bKw/Phone-i-OS.png" /></motion.div>
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setActiveApp('safari')} className="w-[3.8rem] h-[3.8rem] cursor-pointer"><AppIconImage src="https://i.postimg.cc/YSXFRQTg/Safari-browser-logo-svg.png" /></motion.div>
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setActiveApp('messages')} className="w-[3.8rem] h-[3.8rem] cursor-pointer"><AppIconImage src="https://i.postimg.cc/NMwDh6pC/IMessage-logo-svg.png" /></motion.div>
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setActiveApp('music')} className="w-[3.8rem] h-[3.8rem] cursor-pointer"><AppIconImage src="https://i.postimg.cc/7685mXmf/Clock-(i-OS).png" /></motion.div>
          </div>
      </div>
    </div>
  );
};
