import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ChevronLeft, Activity, CreditCard, MessageSquare, Voicemail, Sparkles, BrainCircuit, ShoppingBag, Book, Footprints, Users, Map, FileText, Image as ImageIcon, Plane, Heart, Ban, X, Play, Pause, Loader2, MapPin, Clock, Scroll, Receipt, Shield, User, Car, Package, LogIn, AlertCircle, Plus, Search, Trash2, Globe, Phone, Calendar as CalendarIcon, CloudRain, CloudSun, TrendingUp, Newspaper, Lock as LockIcon, Check, ThumbsUp, ThumbsDown, Shirt, Video, Zap, Settings, ToggleLeft, ToggleRight, Music } from 'lucide-react';
import { generateSpeech, generateImage, generateSmartResponse, getFashionAdvice } from '../../services/geminiService';
import { GlobalCartItem, SilasActivity } from '../../types';

// --- CONSTANTS ---

const NEWS_ITEMS = [
    { id: 1, title: "Juno Corp Acquires BioSynthetics in Record Deal", source: "MarketWatch", time: "1h ago" },
    { id: 2, title: "Senate Passes 'Right to Disconnect' Neuro-Privacy Bill", source: "The Atlantic", time: "3h ago" },
    { id: 3, title: "Weather Modification Project: Clear Skies Promised for Weekend", source: "Metro Weather", time: "5h ago" },
    { id: 4, title: "Historic 'Unsent Letters' Archive Opened to Public AI", source: "Digital History", time: "8h ago" },
    { id: 5, title: "JoyRide Announces Autonomous Fleet Expansion to Suburbs", source: "TechCrunch", time: "10h ago" },
    { id: 6, title: "Memory Implant Startups Face New Regulations", source: "Wired", time: "12h ago" },
    { id: 7, title: "The Return of Analog: Why Gen Z is Buying Typewriters", source: "The New York Times", time: "1d ago" },
    { id: 8, title: "Global Coffee Shortage: Synthetics to the Rescue?", source: "Eater", time: "1d ago" },
    { id: 9, title: "Urban Farming Skyscrapers: A Solution to Food Deserts", source: "Architectural Digest", time: "2d ago" },
    { id: 10, title: "Virtual Reality Courtrooms: The Future of Justice?", source: "Legal Times", time: "2d ago" }
];

// --- Types ---
interface EvidenceItem {
    id: string;
    type: 'text' | 'voice' | 'photo' | 'document' | 'location' | 'obituary' | 'recipe' | 'ticket' | 'web' | 'email';
    icon: any;
    label: string;
    date: string;
    detail: string;
    content?: string;
    title: string;
    imageUrl?: string;
    imagePrompt?: string;
    audioTranscript?: string;
    audioUrl?: string;
    contextMessages?: { sender: string; text: string; isMe: boolean; isTarget?: boolean }[]; 
}

interface PersonProfile {
    id: string;
    name: string;
    relation: string;
    status: string;
    confidence: number;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    summary: string;
    evidence: EvidenceItem[];
    influences: boolean;
    influenceTopics: string[];
}

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    priority: 'HIGH' | 'NORMAL';
    due?: string;
}

interface TrackingOrder {
    id: string;
    item: string;
    store: string;
    status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
    eta: string;
    progress: number;
}

interface SilasAppProps {
  onClose: () => void;
  globalCart?: GlobalCartItem[];
  setGlobalCart?: React.Dispatch<React.SetStateAction<GlobalCartItem[]>>;
  silasConfig: { permissionsGranted: boolean; isSignedIn: boolean; };
  setSilasConfig: React.Dispatch<React.SetStateAction<{ permissionsGranted: boolean; isSignedIn: boolean; }>>;
  onOpenApp?: (appName: string) => void;
  activityLog?: SilasActivity[];
}

// --- Custom Components ---

export const SilasLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
    </defs>
    <path d="M50 5 L90 20 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V20 L50 5Z" fill="url(#silasGrad)" stroke="white" strokeWidth="2"/>
    <path d="M35 35 H65 M35 35 V50 H65 V65 H35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MessageBubble: React.FC<{ text: string, isMe: boolean, isTarget?: boolean }> = ({ text, isMe, isTarget }) => (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3 relative w-full`}>
        <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-[16px] leading-snug relative whitespace-pre-wrap break-words ${
            isMe 
            ? 'bg-blue-500 text-white rounded-br-sm' 
            : 'bg-[#262626] text-white rounded-bl-sm'
        }`}>
            {text}
        </div>
        {isTarget && (
            <div className="absolute -inset-4 pointer-events-none z-20">
                <svg className="w-full h-full overflow-visible">
                    <motion.path
                        d="M 10,25 C 10,10 30,-5 80,5 C 130,15 140,40 120,55 C 100,70 40,65 20,50 C 5,40 10,25 10,25"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        transform="scale(1.1, 1.2)" 
                    />
                </svg>
            </div>
        )}
    </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 transition-colors ${active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 0 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

// --- AUDIO HELPERS ---
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

const INITIAL_PROFILES: PersonProfile[] = [
      {
          id: 'shiloh',
          name: 'Shiloh',
          relation: 'Best Friend (Deceased)',
          status: 'Archived',
          confidence: 100.0,
          color: 'text-amber-200',
          bgColor: 'bg-amber-900/20',
          borderColor: 'border-amber-500/50',
          icon: <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/20" />,
          summary: "Identified as Best Friend (2015-2023). Status confirmed as 'Deceased'. Legacy Mode active via Grief Protocols.",
          influences: true,
          influenceTopics: ['Music', 'Travel', 'Food'],
          evidence: [
              { 
                  id: 'ev1',
                  type: 'obituary', 
                  icon: Scroll, 
                  label: 'Obituary Record', 
                  date: 'Aug 24, 2023', 
                  detail: 'Match found in NYT Archives. Confidence: 99.9%.',
                  content: "Shiloh Lewis, 28, passed away peacefully on August 24th, 2023. A spirited adventurer, Shiloh is survived by her loving family and countless friends who were touched by her light.",
                  title: "Obituary: Shiloh Lewis",
                  contextMessages: [] 
              },
              {
                  id: 'ev2',
                  type: 'photo',
                  icon: MapPin,
                  label: 'Grave Site',
                  date: 'Sep 01, 2023',
                  detail: 'Location verified: Serenity Gardens Cemetery.',
                  title: "Photo: Resting Place",
                  imagePrompt: "A weathered grey granite headstone in a cemetery with the engraved name 'SHILOH LEWIS' and dates '1995 - 2023', surrounded by green grass and a small bouquet of dried flowers, natural overcast lighting, realistic photography"
              },
              { 
                  id: 'ev4',
                  type: 'voice', 
                  icon: Mic, 
                  label: 'Last Voicemail', 
                  date: 'Aug 23, 2023', 
                  detail: 'Biometric voice ID matches "Shiloh". High emotional resonance detected.',
                  audioTranscript: "Hey El! Signal is spotty up here but I'm safe. Just wanted to hear your voice. Love you, bye!",
                  title: "Voicemail: The Hike"
              },
              {
                  id: 'ev99',
                  type: 'ticket',
                  icon: Scroll,
                  label: 'Concert Ticket',
                  date: 'July 15, 2022',
                  detail: 'The Eras Tour - Section 102',
                  title: "Artifact: Concert Stub",
                  imagePrompt: "A torn concert ticket stub for The Eras Tour dated July 15 2022, sitting on a wooden table, nostalgic lighting, close up"
              }
          ]
      },
      {
          id: 'daniel',
          name: 'Daniel',
          relation: 'Husband',
          status: 'Active',
          confidence: 99.9,
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-500/50',
          icon: <Heart className="w-5 h-5 text-blue-400 fill-blue-400/20" />,
          summary: "Primary relationship. High frequency of contact. Shared financial assets and location data indicate cohabitation.",
          influences: true,
          influenceTopics: ['Shopping', 'Calendar', 'Finance'],
          evidence: [
              {
                  id: 'ev5',
                  type: 'document',
                  icon: FileText,
                  label: 'Legal Document',
                  date: 'June 20, 2020',
                  detail: 'Marriage Certificate scan detected in secure vault.',
                  title: "Certificate: Marriage License",
                  imagePrompt: "A formal marriage certificate document for Daniel Sawyer and Eloise Sawyer, dated June 20 2020, official government seal, paper texture, high quality scan"
              },
              {
                  id: 'ev7',
                  type: 'location',
                  icon: Map,
                  label: 'Shared Location',
                  date: 'Live',
                  detail: 'Device proximity >12hrs/day.',
                  title: "Location: 1042 Silicon Ave"
              },
              {
                  id: 'ev88',
                  type: 'recipe',
                  icon: Receipt,
                  label: 'Dinner Receipt',
                  date: 'Last Friday',
                  detail: 'Nobu - $320.00',
                  title: "Receipt: Anniversary",
                  content: "Dinner at Nobu. Anniversary celebration. Note: 'Happy Anniversary' written on bill."
              }
          ]
      },
      {
          id: 'kids',
          name: 'Talulah & Rue',
          relation: 'Daughters',
          status: 'Protected',
          confidence: 99.5,
          color: 'text-orange-400',
          bgColor: 'bg-orange-900/20',
          borderColor: 'border-orange-500/50',
          icon: <Activity className="w-5 h-5 text-orange-400" />,
          summary: "Children detected. High volume of photo capture and calendar events (School, Pediatrician).",
          influences: true,
          influenceTopics: ['Shopping', 'Schedule', 'Safety'],
          evidence: []
      },
      {
          id: 'mom',
          name: 'Mom',
          relation: 'Mother',
          status: 'Active',
          confidence: 98.5,
          color: 'text-pink-400',
          bgColor: 'bg-pink-900/20',
          borderColor: 'border-pink-500/50',
          icon: <User className="w-5 h-5 text-pink-400" />,
          summary: "Maternal figure. Communication characterized by check-ins and family event planning.",
          influences: true,
          influenceTopics: ['Calendar', 'Recipes', 'Health'],
          evidence: [
              {
                  id: 'ev11',
                  type: 'voice',
                  icon: Voicemail,
                  label: 'Voicemail Log',
                  date: 'Oct 22, 2023',
                  detail: 'Sentiment Analysis: Caring/Anxious.',
                  title: "Voicemail: Sunday Dinner",
                  audioTranscript: "Hi honey, just checking if you're coming for roast on Sunday. Dad bought that wine you like. Call me back!"
              },
              {
                  id: 'ev_recipe',
                  type: 'recipe',
                  icon: Book,
                  label: 'Shared Recipe',
                  date: 'Thanksgiving 2022',
                  detail: 'Grandma\'s Stuffing',
                  title: "Artifact: Handwritten Recipe",
                  imagePrompt: "A handwritten recipe card for 'Grandma's Famous Stuffing', cursive writing, stained paper, kitchen countertop background"
              }
          ]
      },
      {
          id: 'thomas',
          name: 'Thomas',
          relation: 'Ex-Partner',
          status: 'Archived',
          confidence: 85.0,
          color: 'text-red-400',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-500/50',
          icon: <Ban className="w-5 h-5 text-red-400" />,
          summary: "Previous romantic partner. Communication ceased July 2023. Archival data suggests lingering digital footprint in Photos and Messages.",
          influences: false,
          influenceTopics: [],
          evidence: []
      },
      {
          id: 'dad',
          name: 'Dad',
          relation: 'Father',
          status: 'Active',
          confidence: 96.0,
          color: 'text-green-400',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-500/50',
          icon: <User className="w-5 h-5 text-green-400" />,
          summary: "Paternal figure. Frequent calls about car maintenance and weather.",
          influences: true,
          influenceTopics: ['Finance', 'Safety'],
          evidence: [
              {
                  id: 'ev_dad_vm',
                  type: 'voice',
                  icon: Voicemail,
                  label: 'Voicemail Log',
                  date: 'Yesterday',
                  detail: 'Topic: Car Service',
                  title: "Voicemail: Check Engine Light",
                  audioTranscript: "Hey kiddo, saw your car in the driveway. That tire looks low. Stop by the station and fill it up, okay? Love you."
              },
              {
                  id: 'ev_dad_pic',
                  type: 'photo',
                  icon: ImageIcon,
                  label: 'Old Photo',
                  date: '1998',
                  detail: 'Fishing Trip',
                  title: "Photo: Fishing Trip 1998",
                  imagePrompt: "A faded 90s photograph of a father and young daughter holding fishing rods by a lake, sunny day, film grain"
              }
          ]
      },
      {
          id: 'aris',
          name: 'Dr. Aris',
          relation: 'Therapist',
          status: 'Professional',
          confidence: 99.0,
          color: 'text-purple-400',
          bgColor: 'bg-purple-900/20',
          borderColor: 'border-purple-500/50',
          icon: <Activity className="w-5 h-5 text-purple-400" />,
          summary: "Medical professional. Weekly appointments detected on calendar.",
          influences: true,
          influenceTopics: ['Health', 'Schedule'],
          evidence: []
      }
  ];

export const SilasApp: React.FC<SilasAppProps> = ({ onClose, globalCart = [], setGlobalCart, silasConfig, setSilasConfig, onOpenApp, activityLog = [] }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'MEMORY' | 'ACTIVITY' | 'PROFILE'>('HOME');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  // Navigation State
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem | null>(null);
  const [profiles, setProfiles] = useState<PersonProfile[]>(INITIAL_PROFILES);
  const [activeTile, setActiveTile] = useState<string | null>(null);

  // Article Reader State
  const [readingArticle, setReadingArticle] = useState<any>(null);
  const [articleBody, setArticleBody] = useState<string>('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);

  const availableTopics = ['Shopping', 'Music', 'Travel', 'Finance', 'Health', 'Calendar', 'Social', 'Safety', 'Recipes'];

  // Todo & Tracking State
  const [todos, setTodos] = useState<TodoItem[]>([
      { id: '1', text: "Order ballet slippers for Talulah", completed: false, priority: 'HIGH', due: 'Today, 4:00 PM' },
      { id: '2', text: "Call Dr. Aris about prescription", completed: false, priority: 'NORMAL', due: 'Tomorrow, 9:00 AM' },
      { id: '3', text: "Confirm dinner with Daniel", completed: true, priority: 'NORMAL', due: 'Yesterday' },
  ]);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState('');

  // Initialize todo selection
  useEffect(() => {
      if (!selectedTodoId && todos.length > 0) {
          setSelectedTodoId(todos[0].id);
      }
  }, [todos.length]);

  // Derived State for Dynamic Todo Tile
  const activeTodos = todos.filter(t => !t.completed);
  const firstActiveTodo = activeTodos.length > 0 ? activeTodos[0] : null;
  const todoTileTitle = firstActiveTodo ? firstActiveTodo.text : "All Tasks Complete";
  const todoTileSubtitle = firstActiveTodo 
      ? `${firstActiveTodo.due ? `Due: ${firstActiveTodo.due}` : 'Pending'} • ${activeTodos.length - 1 > 0 ? `${activeTodos.length - 1} others` : 'No other tasks'}` 
      : "Great job! You're caught up.";

  const [trackingOrders, setTrackingOrders] = useState<TrackingOrder[]>([
      { id: 'TRK-9921', item: "Ballet Slippers (Pink)", store: 'Juno Store', status: 'Out for Delivery', eta: 'Today by 8 PM', progress: 85 },
      { id: 'TRK-8812', item: "Organic Dog Food (30lb)", store: 'PetCo', status: 'Shipped', eta: 'Tomorrow', progress: 60 },
  ]);

  // Add Evidence/Person State
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState<'ALL'|'TEXT'|'CALL'|'PHOTO'|'EMAIL'>('ALL');

  // Preferences State
  const [allergies, setAllergies] = useState(['Peanuts', 'Latex']);
  const [likes, setLikes] = useState(['Modern Style', 'Healthy Food', 'Sci-Fi']);
  const [dislikes, setDislikes] = useState(['Clutter', 'Spicy Food']);
  const [allergyInput, setAllergyInput] = useState('');
  const [likeInput, setLikeInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');

  // Memory Horizon State
  const [memoryHorizon, setMemoryHorizon] = useState(3);
  const horizonLabels = ["30 DAYS", "6 MONTHS", "1 YEAR", "4 YEARS", "LIFETIME"];

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Image Generation State
  const [evidenceImages, setEvidenceImages] = useState<Record<string, string>>({});
  const [loadingImage, setLoadingImage] = useState(false);

  // Info Modal State
  const [showInfo, setShowInfo] = useState(false);
  
  // Login State Animation
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Interactive Tile States
  const [rideRequested, setRideRequested] = useState(false);

  // OUTFIT SIMULATION STATE (Simulated Dynamic Generation)
  const [weatherOutfit, setWeatherOutfit] = useState<any>(null);
  const [generatingOutfit, setGeneratingOutfit] = useState(false);

  const addTag = (type: 'allergy'|'like'|'dislike') => {
    if(type === 'allergy' && allergyInput.trim()) { setAllergies([...allergies, allergyInput.trim()]); setAllergyInput(''); }
    if(type === 'like' && likeInput.trim()) { setLikes([...likes, likeInput.trim()]); setLikeInput(''); }
    if(type === 'dislike' && dislikeInput.trim()) { setDislikes([...dislikes, dislikeInput.trim()]); setDislikeInput(''); }
  };

  const removeTag = (type: 'allergy'|'like'|'dislike', tag: string) => {
    if(type === 'allergy') setAllergies(allergies.filter(t => t !== tag));
    if(type === 'like') setLikes(likes.filter(t => t !== tag));
    if(type === 'dislike') setDislikes(dislikes.filter(t => t !== tag));
  };

  const togglePersonInfluence = (personId: string, topic: string) => {
      setProfiles(prev => prev.map(p => {
          if (p.id !== personId) return p;
          const hasTopic = p.influenceTopics.includes(topic);
          const newTopics = hasTopic
              ? p.influenceTopics.filter(t => t !== topic)
              : [...p.influenceTopics, topic];
          return {
              ...p,
              influenceTopics: newTopics,
          };
      }));
  };

  const toggleInfluenceActive = (personId: string) => {
      setProfiles(prev => prev.map(p => {
          if(p.id !== personId) return p;
          return { ...p, influences: !p.influences };
      }));
  };

  // --- ARTICLE HANDLING ---
  const handleOpenArticle = async (item: any) => {
      setReadingArticle(item);
      setArticleBody('');
      setIsGeneratingArticle(true);
      
      try {
          const prompt = `Write a short, realistic news article (about 150 words) for the headline: "${item.title}". Source style: ${item.source}. Include a brief lead-in and 2-3 paragraphs. No markdown formatting, just plain text with line breaks.`;
          const content = await generateSmartResponse(item.title, prompt);
          setArticleBody(content);
      } catch (e) {
          setArticleBody("Unable to load article content. Please check connection.");
      } finally {
          setIsGeneratingArticle(false);
      }
  };

  const getMockSearchResults = () => {
      const person = profiles.find(p => p.id === selectedPerson);
      if (!person) return [];
      
      const allMockItems = [
          { type: 'text', label: `Text: "Hey ${person.name}, where are you?"`, detail: 'From Messages app', date: 'Yesterday' },
          { type: 'text', label: `Text: "Can you grab milk?"`, detail: 'From Messages app', date: '2 days ago' },
          { type: 'voice', label: `Call: ${person.name} (Missed)`, detail: 'Incoming Call', date: 'Last week' },
          { type: 'photo', label: `Photo with ${person.name}`, detail: 'Face detected in library', date: 'Aug 12, 2023' },
          { type: 'email', label: `Email: Re: Dinner Plans`, detail: 'Subject match', date: 'Oct 15, 2023' },
          { type: 'web', label: `Link: ${person.name}'s Wishlist`, detail: 'Found in Notes', date: 'Sep 20, 2023' },
      ];

      return allMockItems.filter(item => {
          if (evidenceCategory !== 'ALL' && item.type.toUpperCase() !== evidenceCategory) return false;
          if (searchQuery && !item.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          return true;
      });
  };

  // --- ACTIONS ---
  const handleDeleteEvidence = (evidenceId: string) => {
      if (selectedPerson) {
          setProfiles(prev => prev.map(p => {
              if (p.id !== selectedPerson) return p;
              return { ...p, evidence: p.evidence.filter(e => e.id !== evidenceId) };
          }));
          setActiveEvidence(null);
          // Stop audio if playing
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch (e) {}
              audioSourceRef.current = null;
          }
          setIsPlayingAudio(false);
      }
  };

  const handleAddEvidence = (item: any) => {
      if (selectedPerson) {
          const newEvidence: EvidenceItem = {
              id: Date.now().toString(),
              type: item.type,
              icon: item.type === 'text' ? MessageSquare : item.type === 'voice' ? Phone : item.type === 'email' ? FileText : item.type === 'web' ? Globe : ImageIcon,
              label: item.label,
              title: item.label,
              detail: item.detail,
              date: item.date,
              content: `${item.label} - Added manually from device search. Original source: ${item.detail}.`,
          };

          setProfiles(prev => prev.map(p => {
              if (p.id !== selectedPerson) return p;
              return { ...p, evidence: [newEvidence, ...p.evidence] };
          }));
          setShowAddEvidence(false);
          setSearchQuery('');
      }
  };

  const handleAddNewPerson = () => {
      if (!newPersonName.trim()) return;
      const newId = Date.now().toString();
      const newProfile: PersonProfile = {
          id: newId,
          name: newPersonName,
          relation: newPersonRelation || 'Unknown',
          status: 'Monitoring',
          confidence: 50.0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-900/20',
          borderColor: 'border-gray-500/50',
          icon: <User className="w-5 h-5 text-gray-400" />,
          summary: "New entity added to monitoring graph. Analyzing connections...",
          evidence: [],
          influences: true,
          influenceTopics: []
      };
      setProfiles(prev => [...prev, newProfile]);
      setShowAddPersonModal(false);
      setNewPersonName('');
      setNewPersonRelation('');
  };

  const handleDeletePerson = (id: string) => {
      setProfiles(prev => prev.filter(p => p.id !== id));
      setSelectedPerson(null);
  };

  // --- TODO ACTIONS ---
  const addTodo = () => {
      if (!newTodo.trim()) return;
      setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodo, completed: false, priority: 'NORMAL', due: 'Today' }]);
      setNewTodo('');
  };

  const toggleTodo = (id: string) => {
      const isCompleting = !todos.find(t => t.id === id)?.completed;
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      
      if (isCompleting) {
          const idx = todos.findIndex(t => t.id === id);
          if (idx !== -1 && idx + 1 < todos.length) {
              setSelectedTodoId(todos[idx + 1].id);
          }
      } else {
          setSelectedTodoId(id);
      }
  };

  const deleteTodo = (id: string) => {
      const idx = todos.findIndex(t => t.id === id);
      setTodos(prev => prev.filter(t => t.id !== id));
      
      if (selectedTodoId === id) {
          if (todos.length > 1) {
              // Calculate next index: stay at current visual index (idx) unless we were last
              // Because item at idx is gone, item at idx+1 becomes idx
              const remaining = todos.filter(t => t.id !== id);
              if (remaining.length > 0) {
                  // If we deleted the last item, select the new last item
                  const safeIdx = Math.min(idx, remaining.length - 1);
                  setSelectedTodoId(remaining[safeIdx].id);
              } else {
                  setSelectedTodoId(null);
              }
          } else {
              setSelectedTodoId(null);
          }
      }
  };

  const handleSignIn = () => {
      setIsLoggingIn(true);
      setTimeout(() => {
          setSilasConfig(prev => ({ ...prev, isSignedIn: true }));
          setIsLoggingIn(false);
      }, 1500);
  };

  const handleSignOut = () => {
      setSilasConfig(prev => ({ ...prev, isSignedIn: false }));
      setActiveTab('HOME');
  };

  const handleBack = () => {
      if (activeTile) {
          setActiveTile(null);
          return;
      }
      if (activeEvidence) {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch (e) {}
              audioSourceRef.current = null;
          }
          setIsPlayingAudio(false);
          setActiveEvidence(null);
          return;
      }
      if (selectedPerson) {
          setSelectedPerson(null);
          return;
      }
      if (activeTab === 'PROFILE' || activeTab === 'ACTIVITY') {
          setActiveTab('HOME');
          return;
      }
      onClose();
  };

  const getThemeClasses = (theme: string) => {
      const themes: Record<string, { bg: string, border: string, text: string, iconBg: string }> = {
          red: { bg: 'bg-red-900/20', border: 'border-red-500/50', text: 'text-red-400', iconBg: 'bg-red-500/10' },
          blue: { bg: 'bg-blue-900/20', border: 'border-blue-500/50', text: 'text-blue-400', iconBg: 'bg-blue-500/10' },
          purple: { bg: 'bg-purple-900/20', border: 'border-purple-500/50', text: 'text-purple-400', iconBg: 'bg-purple-500/10' },
          teal: { bg: 'bg-teal-900/20', border: 'border-teal-500/50', text: 'text-teal-400', iconBg: 'bg-teal-500/10' },
          green: { bg: 'bg-emerald-900/20', border: 'border-emerald-500/50', text: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
          orange: { bg: 'bg-orange-900/20', border: 'border-orange-500/50', text: 'text-orange-400', iconBg: 'bg-orange-500/10' },
          zinc: { bg: 'bg-zinc-900/20', border: 'border-zinc-500/50', text: 'text-zinc-400', iconBg: 'bg-zinc-500/10' },
          cyan: { bg: 'bg-cyan-900/20', border: 'border-cyan-500/50', text: 'text-cyan-400', iconBg: 'bg-cyan-500/10' },
      };
      return themes[theme] || themes.zinc;
  };

  const DashboardTile = ({ type, title, subtitle, icon: Icon, theme = 'zinc', onClick, wide, height }: any) => {
      const styles = getThemeClasses(theme);
      return (
          <motion.div 
              layoutId={`tile-${type}`}
              onClick={onClick}
              className={`relative rounded-2xl p-4 border cursor-pointer group ${styles.bg} ${styles.border} ${wide ? 'col-span-2' : ''} ${height ? height : 'h-40'} flex flex-col justify-between relative overflow-hidden hover:bg-opacity-30 transition-all`}
              whileTap={{ scale: 0.98 }}
          >
              <div className="flex justify-between items-start z-10">
                  <div className={`p-2 rounded-lg ${styles.iconBg} backdrop-blur-sm border ${styles.border} border-opacity-30`}>
                      <Icon className={`w-5 h-5 ${styles.text}`} />
                  </div>
                  <span className={`text-[10px] font-mono opacity-60 ${styles.text} tracking-widest`}>
                      {type}
                  </span>
              </div>
              <div className="z-10 mt-auto">
                  <h3 className={`text-lg font-bold leading-tight ${styles.text} brightness-110 drop-shadow-sm`}>{title}</h3>
                  <p className={`text-[11px] opacity-70 font-medium mt-1 leading-snug ${styles.text}`}>{subtitle}</p>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${styles.text}`} />
          </motion.div>
      );
  };

  const getActivityIcon = (iconName?: string) => {
      switch (iconName) {
          case 'Search': return Search;
          case 'Message': return MessageSquare;
          case 'Cart': return ShoppingBag;
          case 'Sparkles': return Sparkles;
          case 'Check': return Check;
          case 'Mic': return Mic;
          default: return Zap;
      }
  };

  // --- Audio Logic ---
  const toggleAudio = async () => {
      if (isPlayingAudio) {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch (e) {}
              audioSourceRef.current = null;
          }
          setIsPlayingAudio(false);
          return;
      }

      if (!activeEvidence?.audioTranscript) return;

      setIsLoadingAudio(true);
      try {
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          }
          if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
          }

          let voiceName = 'Kore';
          if (activeEvidence.title.includes('Thomas')) voiceName = 'Puck';
          if (activeEvidence.title.includes('Mom')) voiceName = 'Kore';
          if (activeEvidence.title.includes('Shiloh')) voiceName = 'Fenrir'; 
          if (activeEvidence.title.includes('Dad')) voiceName = 'Charon'; 

          const base64 = await generateSpeech(activeEvidence.audioTranscript, voiceName);
          
          if (base64) {
              const audioBuffer = await decodeAudioData(decodeBase64(base64), audioContextRef.current);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              
              source.onended = () => {
                  setIsPlayingAudio(false);
                  audioSourceRef.current = null;
              };
              
              source.start();
              audioSourceRef.current = source;
              setIsPlayingAudio(true);
          }
      } catch (err) {
          console.error("Evidence audio error", err);
      } finally {
          setIsLoadingAudio(false);
      }
  };

  // Audio Cleanup
  useEffect(() => {
      return () => {
          if (audioSourceRef.current) {
              try { audioSourceRef.current.stop(); } catch(e) {}
          }
          if (audioContextRef.current) {
              audioContextRef.current.close();
          }
      };
  }, []);

  // Evidence Image Generation
  useEffect(() => {
      if (activeEvidence?.imagePrompt && !evidenceImages[activeEvidence.title]) {
          setLoadingImage(true);
          generateImage(activeEvidence.imagePrompt).then(url => {
              if (url) {
                  setEvidenceImages(prev => ({...prev, [activeEvidence.title]: url}));
              }
              setLoadingImage(false);
          });
      }
  }, [activeEvidence]);

  // Outfit Simulation Logic (Using Gemini)
  useEffect(() => {
      if (activeTile === 'WEATHER' && !weatherOutfit) {
          setGeneratingOutfit(true);
          
          const fetchOutfit = async () => {
              try {
                  const weatherCtx = "58°F, Cloudy, Chance of rain";
                  const wardrobe = ["Wool Maxi Coat", "Chelsea Boots", "Trench Coat", "Cashmere Scarf"];
                  
                  const recommendations = await getFashionAdvice(weatherCtx, wardrobe);
                  
                  if (recommendations && recommendations.length > 0) {
                      const bestOpt = recommendations[0];
                      let imageUrl = null;
                      
                      if (bestOpt.imagePrompt) {
                          imageUrl = await generateImage(bestOpt.imagePrompt + ", fashion photography style, female subject, no text, realistic lighting");
                      }
                      
                      setWeatherOutfit({
                          title: bestOpt.title,
                          items: [bestOpt.item || "Layers"],
                          reason: bestOpt.description,
                          imageUrl: imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80"
                      });
                  } else {
                      // Fallback logic handled in catch/finally to ensure display
                      throw new Error("No recommendations returned");
                  }
              } catch (e) {
                  // Fallback ensures UI never gets stuck
                  setWeatherOutfit({
                      title: "Rainy Day Chic",
                      items: ["Burberry Trench", "Hunter Boots"],
                      reason: "Rain expected. Prioritizing waterproofing.",
                      imageUrl: "https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&w=400&q=80" 
                  });
              } finally {
                  setGeneratingOutfit(false);
              }
          };
          
          fetchOutfit();
      }
  }, [activeTile]);

  if (!silasConfig.isSignedIn) {
      return (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-sans text-white p-8"
          >
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 mb-8 shadow-[0_0_60px_rgba(34,197,94,0.15)] relative">
                  <SilasLogo className="w-16 h-16 text-green-400" />
                  {isLoggingIn && <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-50" />}
              </div>
              <h1 className="text-4xl font-light mb-2 tracking-tight">Silas <span className="font-bold text-green-400">Intelligence</span></h1>
              <p className="text-gray-500 mb-12 text-sm tracking-widest uppercase">System Version 2.0</p>
              <button 
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="w-full max-w-xs py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all"
              >
                  {isLoggingIn ? (<><Loader2 className="animate-spin" size={20} /> Authenticating...</>) : (<><LogIn size={20} /> Sign In</>)}
              </button>
          </motion.div>
      );
  }

  if (silasConfig.isSignedIn && !silasConfig.permissionsGranted) {
      return (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-sans text-white p-8"
          >
              <AlertCircle size={48} className="text-yellow-500 mb-6" />
              <h2 className="text-2xl font-bold mb-4 text-center">Permissions Required</h2>
              <p className="text-gray-400 text-center mb-8 max-w-sm leading-relaxed">
                  Silas Intelligence requires connection to your Safety Profile to function. Please enable "Connect to Silas" in your device Settings.
              </p>
              <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button onClick={onClose} className="w-full py-3 border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-colors">Go to Home Screen</button>
                  <button onClick={handleSignOut} className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Sign Out</button>
              </div>
          </motion.div>
      );
  }

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
          if (offset.x > 100 || velocity.x > 200) {
              handleBack();
          }
      }}
      className="absolute inset-0 bg-black z-50 flex flex-col font-sans text-white overflow-hidden h-full w-full"
    >
       <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-black to-black pointer-events-none"></div>
       <div className="absolute top-[-20%] right-[-30%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

       {!activeEvidence && !activeTile && !readingArticle && (
           <div className="pt-14 pb-2 px-6 flex justify-between items-center z-20 bg-transparent shrink-0">
               <div className="flex items-center gap-3">
                   <SilasLogo className="w-8 h-8" />
                   <div>
                       <h1 className="text-lg font-bold leading-none tracking-tight">Silas Intelligence</h1>
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest">System v2.0</span>
                   </div>
               </div>
               <div 
                   onClick={() => setActiveTab('PROFILE')}
                   className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border cursor-pointer active:scale-95 transition-transform overflow-hidden ${activeTab === 'PROFILE' ? 'ring-2 ring-white' : ''}`}
               >
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="Profile" />
               </div>
           </div>
       )}

       {!activeEvidence && !readingArticle && (
           <div className="flex-1 overflow-y-auto pb-32 relative z-10 no-scrollbar">
                {activeTab === 'HOME' && !selectedPerson && (
                    <div className="px-6 animate-fade-in pt-6 space-y-4">
                        
                        {/* --- NEW INFLUENCERS TILE --- */}
                        <div className="flex gap-4 mb-2">
                             <div 
                                onClick={() => setActiveTab('MEMORY')}
                                className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-95 transition-transform"
                             >
                                 <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-500/20 text-purple-400">
                                     <Users size={18} />
                                 </div>
                                 <div>
                                     <div className="text-sm font-bold text-white">Active Influencers</div>
                                     <div className="text-[10px] text-gray-400">{profiles.filter(p => p.influences).length} Personas guiding your feed.</div>
                                 </div>
                                 <ChevronLeft className="w-4 h-4 text-gray-600 rotate-180 ml-auto" />
                             </div>
                        </div>

                        <DashboardTile type="TODO" title={todoTileTitle} subtitle={todoTileSubtitle} icon={AlertCircle} theme="red" wide={true} height="h-32" onClick={() => setActiveTile('TODO')} />
                        <DashboardTile type="TRACKING" title="Incoming Orders" subtitle={`${trackingOrders.length} Packages arriving.`} icon={Package} theme="blue" wide={true} height="h-28" onClick={() => setActiveTile('TRACKING')} />
                        <DashboardTile type="CALENDAR" title="Next Event: Dinner" subtitle="7:00 PM at Nobu with Daniel." icon={CalendarIcon} theme="purple" wide={true} height="h-28" onClick={() => setActiveTile('DINNER')} />
                        <DashboardTile type="WEATHER" title="Weather: Outfit Suggestion" subtitle="58°F Cloudy. Wear the Wool Maxi Coat." icon={CloudSun} theme="teal" wide={true} height="h-28" onClick={() => setActiveTile('WEATHER')} />
                        <div className="grid grid-cols-2 gap-4">
                            <DashboardTile type="TRAVEL" title="Travel Plans" subtitle="Costa Rica Trip" icon={Plane} theme="cyan" onClick={() => setActiveTile('FLY')} />
                            <DashboardTile type="FINANCE" title="Finances" subtitle="Review Spending" icon={TrendingUp} theme="green" onClick={() => setActiveTile('FINANCE')} />
                            <DashboardTile type="SECURITY" title="Home Security" subtitle="System Armed" icon={LockIcon} theme="zinc" onClick={() => setActiveTile('SECURITY')} />
                            
                            {/* NEWS SECTION */}
                            <div className="col-span-2 space-y-2 mt-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Headlines</h3>
                                {NEWS_ITEMS.map(item => (
                                    <div key={item.id} onClick={() => handleOpenArticle(item)} className="bg-zinc-900/30 p-3 rounded-xl flex items-center gap-3 border border-zinc-500/30 backdrop-blur-sm cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                        <div className="w-10 h-10 bg-zinc-500/20 rounded-lg flex items-center justify-center shrink-0 border border-zinc-500/20">
                                            <Newspaper size={16} className="text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate leading-tight">{item.title}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">{item.source} • {item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ACTIVITY LOG TAB --- */}
                {activeTab === 'ACTIVITY' && (
                    <div className="px-6 animate-fade-in pb-24">
                        <div className="mt-4 mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Activity Log</h2>
                            <p className="text-gray-500 text-sm">Recent actions performed by Silas.</p>
                        </div>
                        <div className="space-y-4">
                            {activityLog.length === 0 ? (
                                <div className="text-center py-10 text-gray-600 text-sm">
                                    No recent activity. Try "Hey Silas".
                                </div>
                            ) : (
                                activityLog.map((log) => {
                                    const Icon = getActivityIcon(log.iconName);
                                    return (
                                        <div key={log.id} className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 text-purple-400 border border-zinc-700">
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium text-sm">{log.action}</h3>
                                                <p className="text-gray-500 text-xs truncate">{log.detail}</p>
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-mono">
                                                {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* --- MEMORY TAB --- */}
                {activeTab === 'MEMORY' && !selectedPerson && (
                    <div className="px-6 animate-fade-in pb-24">
                        <div className="mt-4 mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Memory Graph</h2>
                            <p className="text-gray-500 text-sm">Key individuals identified in your network.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {profiles.map((person) => (
                                <div key={person.id} onClick={() => setSelectedPerson(person.id)} className={`p-4 rounded-2xl border cursor-pointer hover:opacity-80 transition-opacity flex flex-col justify-between h-40 relative overflow-hidden ${person.bgColor} ${person.borderColor}`}>
                                    <div className="flex justify-between items-start z-10">
                                        {person.icon}
                                        <span className={`text-[10px] font-mono opacity-70 ${person.color}`}>{person.confidence}%</span>
                                    </div>
                                    <div className="z-10">
                                        <h3 className={`font-bold text-lg leading-tight ${person.color}`}>{person.name}</h3>
                                        <p className={`text-[10px] opacity-70 mt-1 ${person.color}`}>{person.relation}</p>
                                    </div>
                                    <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-xl opacity-20 bg-current ${person.color}`} />
                                </div>
                            ))}
                            <button onClick={() => setShowAddPersonModal(true)} className="p-4 rounded-2xl border border-dashed border-gray-700 hover:border-gray-500 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 h-40 text-gray-500 hover:text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"><Plus size={24} /></div>
                                <span className="text-xs font-bold uppercase tracking-widest">Add Entity</span>
                            </button>
                        </div>

                        {/* Active Influencers */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Users size={14} /> Active Influencers
                            </div>
                            <div className="space-y-3">
                                {profiles.filter(p => p.influences).map(inf => (
                                    <div key={inf.id} className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${inf.bgColor}`}>
                                                {inf.icon}
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm text-white`}>{inf.name}</div>
                                                {inf.influenceTopics.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {inf.influenceTopics.map(tag => (
                                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => toggleInfluenceActive(inf.id)}
                                            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${inf.influences ? 'bg-green-500' : 'bg-gray-700'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${inf.influences ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PROFILE TAB --- */}
                {selectedPerson && (
                    <div className="px-6 animate-fade-in">
                        {(() => {
                            const person = profiles.find(p => p.id === selectedPerson);
                            if(!person) return null;
                            return (
                                <>
                                    <div className="flex items-center gap-4 mb-6 mt-2">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${person.borderColor} ${person.bgColor}`}>
                                            {person.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{person.name}</h2>
                                            <p className="text-gray-400 text-sm">{person.relation}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#111] p-4 rounded-2xl border border-gray-800 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                <Settings size={14} /> Influence Configuration
                                            </div>
                                            <div 
                                                onClick={() => toggleInfluenceActive(person.id)}
                                                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${person.influences ? 'bg-green-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${person.influences ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {availableTopics.map(topic => {
                                                const isActive = person.influenceTopics.includes(topic);
                                                return (
                                                    <button
                                                        key={topic}
                                                        onClick={() => togglePersonInfluence(person.id, topic)}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                                                            isActive 
                                                                ? `${person.color} ${person.bgColor} ${person.borderColor}` 
                                                                : 'text-gray-500 border-white/5 bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {topic}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-[#111] p-4 rounded-2xl border border-gray-800 mb-6">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <BrainCircuit size={14} /> Silas Summary
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{person.summary}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Collected Evidence</h3>
                                        <button onClick={() => setShowAddEvidence(true)} className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                                            <Plus size={12} /> Add Evidence
                                        </button>
                                    </div>
                                    <div className="space-y-3 pb-8">
                                        {person.evidence.map((ev, i) => (
                                            <div key={i} onClick={() => setActiveEvidence(ev)} className="bg-[#111] p-4 rounded-xl border border-gray-800 flex items-center gap-4 cursor-pointer hover:border-gray-600 transition-colors">
                                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                                    {ev.imageUrl || evidenceImages[ev.title] ? (<img src={evidenceImages[ev.title] || ev.imageUrl} className="w-full h-full object-cover opacity-80" />) : (<ev.icon size={18} />)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-white truncate">{ev.label}</h4>
                                                    <p className="text-xs text-gray-500 truncate">{ev.detail}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-mono">{ev.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => handleDeletePerson(person.id)} className="w-full py-4 mb-24 border border-red-900/50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-900/10 transition-colors active:scale-95">
                                        <Trash2 size={18} /> Remove from Memory
                                    </button>
                                </>
                            )
                        })()}
                    </div>
                )}

                {activeTab === 'PROFILE' && (
                    <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 animate-fade-in">
                        {/* Header Profile Info */}
                        <div className="flex flex-col items-center mb-8 relative">
                            {/* Glow Effect */}
                            <div className="absolute top-0 w-32 h-32 bg-purple-600/30 rounded-full blur-[40px] pointer-events-none"></div>
                            
                            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-blue-500 mb-4 z-10 relative">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Eloise Sawyer</h2>
                            <p className="text-sm text-gray-500">Profile & Safety Settings</p>
                        </div>

                        {/* Personal Identity */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <User size={14} /> Personal Identity
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Name</span>
                                    <span className="text-white font-medium text-sm">Eloise Sawyer</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Age</span>
                                    <span className="text-white font-medium text-sm">31</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 text-sm">Address</span>
                                    <span className="text-white font-medium text-sm text-right">1042 Silicon Ave<br/>Palo Alto, CA</span>
                                </div>
                            </div>
                        </div>

                        {/* Memory Horizon */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Clock size={14} /> Memory Horizon
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/5">
                                {/* Slider Component */}
                                <div className="relative mb-8 mt-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="4" 
                                        value={memoryHorizon} 
                                        onChange={(e) => setMemoryHorizon(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                        style={{
                                            background: `linear-gradient(to right, #9333ea ${memoryHorizon * 25}%, #1f2937 ${memoryHorizon * 25}%)`
                                        }}
                                    />
                                    {/* Visual Track Marks (Optional refinement, but input handles logic) */}
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {horizonLabels.map((label, i) => (
                                        <span key={i} className={`text-center ${memoryHorizon === i ? 'text-white' : ''}`}>
                                            {label.split(' ').map((line, li) => <div key={li}>{line}</div>)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                                    <Sparkles size={14} /> Personalized Recommendations
                                </div>
                                <span className="text-[9px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-500/20">Synced with Juno</span>
                            </div>

                            {/* Allergies */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 mb-4">
                                <div className="flex items-center gap-2 mb-4 text-red-400 font-bold text-sm">
                                    <AlertCircle size={16} /> Allergies
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {allergies.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-red-900/20 text-red-200 text-xs font-medium border border-red-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('allergy', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add allergy..."
                                        value={allergyInput}
                                        onChange={(e) => setAllergyInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('allergy')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('allergy')} />
                                </div>
                            </div>

                            {/* Likes */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 mb-4">
                                <div className="flex items-center gap-2 mb-4 text-green-400 font-bold text-sm">
                                    <ThumbsUp size={16} /> Likes
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {likes.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-green-900/20 text-green-200 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('like', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add preference..."
                                        value={likeInput}
                                        onChange={(e) => setLikeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('like')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('like')} />
                                </div>
                            </div>

                            {/* Dislikes */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold text-sm">
                                    <ThumbsDown size={16} /> Dislikes
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {dislikes.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-orange-900/20 text-orange-200 text-xs font-medium border border-orange-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('dislike', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add dislike..."
                                        value={dislikeInput}
                                        onChange={(e) => setDislikeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('dislike')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('dislike')} />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Car size={14} /> Vehicle
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Model</span>
                                    <span className="text-white font-medium text-sm">Tesla Model 3</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Plate</span>
                                    <span className="text-white font-medium text-sm">8XYZ992</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Heart size={14} /> Emergency Contacts
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Daniel (Husband)</span>
                                    <span className="text-[10px] bg-red-900/40 text-red-300 px-2 py-1 rounded font-bold border border-red-500/20">Primary</span>
                                </div>
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Mom</span>
                                    <span className="text-[10px] bg-pink-900/40 text-pink-300 px-2 py-1 rounded font-bold border border-pink-500/20">Parent</span>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Dr. Aris</span>
                                    <span className="text-[10px] bg-red-950/60 text-red-400 px-2 py-1 rounded font-bold border border-red-500/20">Medical</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {activeTile && (
                        <motion.div 
                            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={(e) => { e.stopPropagation(); setActiveTile(null); }} />
                            <motion.div layoutId={`tile-${activeTile}`} className={`bg-[#111] border border-gray-800 rounded-3xl p-6 pointer-events-auto relative z-10 shadow-2xl flex flex-col overflow-hidden w-[90%] max-w-sm max-h-[80vh]`} onClick={(e) => e.stopPropagation()}>
                                <div className={`flex justify-between items-start mb-6 shrink-0`}>
                                    <h2 className="text-2xl font-bold tracking-tight text-white">
                                        {activeTile === 'DINNER' ? 'Next Event' : activeTile === 'FLY' ? 'Travel Plans' : activeTile === 'TODO' ? 'Tasks' : activeTile === 'TRACKING' ? 'Orders' : activeTile === 'SECURITY' ? 'Home Status' : activeTile === 'WEATHER' ? 'Weather Insight' : activeTile === 'FINANCE' ? 'Financial Health' : activeTile}
                                    </h2>
                                    <button onClick={() => setActiveTile(null)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><X size={16} /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar relative">
                                    {/* FINANCE TILE */}
                                    {activeTile === 'FINANCE' && (
                                        <div className="flex flex-col h-full space-y-6">
                                            <div className="bg-green-900/10 border border-green-500/30 p-5 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-green-500/20 rounded-full"><TrendingUp size={20} className="text-green-400" /></div>
                                                    <span className="text-sm font-bold text-green-400 uppercase tracking-widest">Silas Analysis</span>
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    "Your spending on 'Dining Out' is 15% higher this month due to anniversary celebrations. I suggest reducing non-essential subscriptions."
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Subscription Audit</h3>
                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">N</div>
                                                        <div>
                                                            <div className="font-bold text-white text-sm">Netflix Premium</div>
                                                            <div className="text-xs text-gray-500">$22.99 / mo</div>
                                                        </div>
                                                    </div>
                                                    <button className="text-red-400 text-xs font-bold border border-red-900/50 px-3 py-1.5 rounded-lg hover:bg-red-900/20">Cancel</button>
                                                </div>
                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Activity size={18} /></div>
                                                        <div>
                                                            <div className="font-bold text-white text-sm">MyFitnessPal</div>
                                                            <div className="text-xs text-gray-500">$9.99 / mo</div>
                                                        </div>
                                                    </div>
                                                    <button className="text-gray-400 text-xs font-bold border border-zinc-700 px-3 py-1.5 rounded-lg">Keep</button>
                                                </div>
                                            </div>
                                            
                                            <button className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm mt-auto">
                                                Open Charity Bank
                                            </button>
                                        </div>
                                    )}
                                    {activeTile === 'TODO' && (
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1 space-y-3 pb-4 overflow-y-auto no-scrollbar relative">
                                                <AnimatePresence mode="popLayout">
                                                {todos.map(todo => (
                                                    <motion.div 
                                                        layout
                                                        key={todo.id} 
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                        onClick={() => setSelectedTodoId(todo.id)}
                                                        className={`p-3 rounded-xl flex flex-col gap-2 group border transition-all relative ${
                                                            selectedTodoId === todo.id 
                                                                ? 'bg-red-900/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] z-10' 
                                                                : 'bg-red-900/10 border-red-500/30 hover:bg-red-900/20'
                                                        }`}
                                                    >
                                                        {/* Selection Indicator */}
                                                        {selectedTodoId === todo.id && (
                                                            <motion.div 
                                                                layoutId="todo-selection"
                                                                className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-r-full"
                                                            />
                                                        )}
                                                        
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }} 
                                                                className={`w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${todo.completed ? 'bg-red-500' : 'bg-transparent'}`}
                                                            >
                                                                {todo.completed && <Check size={12} className="text-white" />}
                                                            </div>
                                                            <span className={`flex-1 text-sm font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{todo.text}</span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} 
                                                                className="text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        {todo.due && <div className="pl-8 text-[10px] text-red-300 font-mono opacity-80 flex items-center gap-1"><Clock size={10} /> Due: {todo.due}</div>}
                                                    </motion.div>
                                                ))}
                                                </AnimatePresence>
                                            </div>
                                            <div className="mt-auto bg-zinc-900 rounded-xl p-2 flex items-center border border-zinc-700">
                                                <input type="text" placeholder="Add new task..." className="flex-1 bg-transparent text-white px-3 outline-none text-sm" value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} />
                                                <button onClick={addTodo} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-500 transition-colors"><Plus size={18} /></button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTile === 'TRACKING' && (
                                        <div className="flex flex-col h-full space-y-4">
                                            {trackingOrders.map(order => (
                                                <div key={order.id} className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-2xl relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                                        <div>
                                                            <h3 className="font-bold text-white text-sm">{order.item}</h3>
                                                            <p className="text-[10px] text-blue-300">{order.store}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3 relative z-10">
                                                        <Clock size={10} /> ETA: {order.eta}
                                                    </div>
                                                    <div className="w-full h-1 bg-blue-900/30 rounded-full overflow-hidden relative z-10">
                                                        <div className="h-full bg-blue-500" style={{ width: `${order.progress}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center text-[10px] text-gray-500">
                                                Synced from Mail & Juno
                                            </div>
                                        </div>
                                    )}
                                    {activeTile === 'DINNER' && (
                                        <div className="flex flex-col h-full text-center">
                                            <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                                                <CalendarIcon size={32} className="text-purple-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold mb-1 text-white">Dinner at Nobu</h2>
                                            <p className="text-sm text-gray-400 mb-6">Tonight • 7:00 PM - 9:00 PM</p>
                                            
                                            <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-2xl text-left mb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs text-purple-300 font-bold uppercase tracking-widest">Transport</span>
                                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Traffic: Light</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {rideRequested ? (
                                                        <button className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-default">
                                                            <Check size={16} /> Ride Scheduled
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setRideRequested(true)}
                                                            className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                                                        >
                                                            <Car size={16} /> Request JoyRide
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onOpenApp && onOpenApp('calendar')} 
                                                className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm"
                                            >
                                                Open Calendar
                                            </button>
                                        </div>
                                    )}
                                    {activeTile === 'WEATHER' && (
                                        <div className="flex flex-col h-full text-center">
                                            <div className="flex items-center justify-center gap-4 mb-6">
                                                <CloudRain size={48} className="text-teal-400" />
                                                <div className="text-left">
                                                    <div className="text-4xl font-bold text-white">58°F</div>
                                                    <div className="text-sm text-gray-400">Cloudy • Rain at 4PM</div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-teal-900/20 border border-teal-500/30 p-4 rounded-2xl mb-6">
                                                <div className="flex items-center gap-2 mb-3 text-teal-300 font-bold uppercase tracking-widest text-[10px]">
                                                    <Shirt size={12} /> Outfit Suggestion
                                                </div>
                                                <div className="aspect-[4/5] bg-gray-800 rounded-xl mb-3 overflow-hidden relative">
                                                    {generatingOutfit ? (
                                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                                                            <span className="text-[10px] text-teal-300 animate-pulse">GENERATING LOOK...</span>
                                                        </div>
                                                    ) : weatherOutfit ? (
                                                         <img src={weatherOutfit.imageUrl} className="w-full h-full object-cover opacity-80" />
                                                    ) : (
                                                         <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Generating...</div>
                                                    )}
                                                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur-md">
                                                        {weatherOutfit?.items?.[0] || "Loading..."}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-teal-100 leading-relaxed text-left">
                                                    {weatherOutfit?.reason || "Analyzing weather patterns..."}
                                                </p>
                                            </div>

                                            <button 
                                                onClick={() => onOpenApp && onOpenApp('weather')}
                                                className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm"
                                            >
                                                Open Weather App
                                            </button>
                                        </div>
                                    )}
                                    {activeTile === 'FLY' && (
                                        <div className="flex flex-col h-full text-center">
                                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                                                <Plane size={32} className="text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold mb-1 text-white">Trip to Costa Rica</h2>
                                            <p className="text-sm text-gray-400 mb-6">Flight CF-882 • Mar 12 - Mar 19</p>
                                            
                                            <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl text-left mb-6">
                                                <div className="flex items-center gap-2 mb-2 text-gray-300 font-bold uppercase tracking-widest text-[10px]">
                                                    <Sparkles size={12} /> Silas Insight
                                                </div>
                                                <p className="text-sm leading-relaxed text-gray-300">
                                                    "I've synced this trip with Daniel's calendar. He has marked these dates as free. Don't forget to pack sunscreen."
                                                </p>
                                            </div>

                                            <button 
                                                onClick={() => onOpenApp && onOpenApp('charityfly')}
                                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors text-sm shadow-lg shadow-blue-900/20"
                                            >
                                                View in Lifetime Flights
                                            </button>
                                        </div>
                                    )}
                                    {activeTile === 'SECURITY' && (
                                        <div className="flex flex-col h-full space-y-4">
                                            <div className="bg-green-900/20 border border-green-500/30 p-5 rounded-2xl text-center relative overflow-hidden">
                                                <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                                                <Shield size={32} className="text-green-500 mx-auto mb-2" />
                                                <h2 className="text-xl font-bold text-white mb-1">System Armed</h2>
                                                <p className="text-green-400 text-xs">All sensors active. Perimeter secure.</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <LockIcon size={16} className="text-white" />
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 block">Front Door</span>
                                                    <span className="text-sm font-bold text-white">Locked</span>
                                                </div>
                                                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <LockIcon size={16} className="text-white" />
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 block">Garage</span>
                                                    <span className="text-sm font-bold text-white">Closed</span>
                                                </div>
                                                <div className="col-span-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                            <Video size={16} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="text-white font-bold block text-sm">Cameras</span>
                                                            <span className="text-[10px] text-gray-500">4 Active</span>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-bold bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">View Feed</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === 'PROFILE' && (
                    <div className="flex-1 overflow-y-auto px-6 pb-24 pt-4 animate-fade-in">
                        {/* Header Profile Info */}
                        <div className="flex flex-col items-center mb-8 relative">
                            {/* Glow Effect */}
                            <div className="absolute top-0 w-32 h-32 bg-purple-600/30 rounded-full blur-[40px] pointer-events-none"></div>
                            
                            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-blue-500 mb-4 z-10 relative">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Eloise Sawyer</h2>
                            <p className="text-sm text-gray-500">Profile & Safety Settings</p>
                        </div>

                        {/* Personal Identity */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <User size={14} /> Personal Identity
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Name</span>
                                    <span className="text-white font-medium text-sm">Eloise Sawyer</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Age</span>
                                    <span className="text-white font-medium text-sm">31</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400 text-sm">Address</span>
                                    <span className="text-white font-medium text-sm text-right">1042 Silicon Ave<br/>Palo Alto, CA</span>
                                </div>
                            </div>
                        </div>

                        {/* Memory Horizon */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Clock size={14} /> Memory Horizon
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/5">
                                {/* Slider Component */}
                                <div className="relative mb-8 mt-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="4" 
                                        value={memoryHorizon} 
                                        onChange={(e) => setMemoryHorizon(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                        style={{
                                            background: `linear-gradient(to right, #9333ea ${memoryHorizon * 25}%, #1f2937 ${memoryHorizon * 25}%)`
                                        }}
                                    />
                                    {/* Visual Track Marks (Optional refinement, but input handles logic) */}
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {horizonLabels.map((label, i) => (
                                        <span key={i} className={`text-center ${memoryHorizon === i ? 'text-white' : ''}`}>
                                            {label.split(' ').map((line, li) => <div key={li}>{line}</div>)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                                    <Sparkles size={14} /> Personalized Recommendations
                                </div>
                                <span className="text-[9px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-500/20">Synced with Juno</span>
                            </div>

                            {/* Allergies */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 mb-4">
                                <div className="flex items-center gap-2 mb-4 text-red-400 font-bold text-sm">
                                    <AlertCircle size={16} /> Allergies
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {allergies.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-red-900/20 text-red-200 text-xs font-medium border border-red-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('allergy', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add allergy..."
                                        value={allergyInput}
                                        onChange={(e) => setAllergyInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('allergy')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('allergy')} />
                                </div>
                            </div>

                            {/* Likes */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 mb-4">
                                <div className="flex items-center gap-2 mb-4 text-green-400 font-bold text-sm">
                                    <ThumbsUp size={16} /> Likes
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {likes.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-green-900/20 text-green-200 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('like', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add preference..."
                                        value={likeInput}
                                        onChange={(e) => setLikeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('like')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('like')} />
                                </div>
                            </div>

                            {/* Dislikes */}
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold text-sm">
                                    <ThumbsDown size={16} /> Dislikes
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {dislikes.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-orange-900/20 text-orange-200 text-xs font-medium border border-orange-500/20 flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag('dislike', tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/5">
                                    <input 
                                        className="bg-transparent text-sm text-white w-full outline-none placeholder-gray-600"
                                        placeholder="Add dislike..."
                                        value={dislikeInput}
                                        onChange={(e) => setDislikeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag('dislike')}
                                    />
                                    <Plus size={16} className="text-gray-500 cursor-pointer" onClick={() => addTag('dislike')} />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Car size={14} /> Vehicle
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Model</span>
                                    <span className="text-white font-medium text-sm">Tesla Model 3</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Plate</span>
                                    <span className="text-white font-medium text-sm">8XYZ992</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <Heart size={14} /> Emergency Contacts
                            </div>
                            <div className="bg-[#1c1c1e] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Daniel (Husband)</span>
                                    <span className="text-[10px] bg-red-900/40 text-red-300 px-2 py-1 rounded font-bold border border-red-500/20">Primary</span>
                                </div>
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Mom</span>
                                    <span className="text-[10px] bg-pink-900/40 text-pink-300 px-2 py-1 rounded font-bold border border-pink-500/20">Parent</span>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <span className="text-white font-medium text-sm">Dr. Aris</span>
                                    <span className="text-[10px] bg-red-950/60 text-red-400 px-2 py-1 rounded font-bold border border-red-500/20">Medical</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ARTICLE READER */}
                <AnimatePresence>
                    {readingArticle && (
                        <motion.div 
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="absolute inset-0 bg-[#000] z-[70] flex flex-col font-serif"
                        >
                            <div className="pt-14 px-6 pb-4 flex justify-between items-center border-b border-white/10 font-sans bg-black z-20">
                                <button onClick={() => setReadingArticle(null)} className="flex items-center gap-1 text-white/70 hover:text-white">
                                    <ChevronLeft /> Back
                                </button>
                                <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest">
                                    <Newspaper size={12} /> {readingArticle.source}
                                </div>
                                <div className="w-8" />
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 text-white/90">
                                <h1 className="text-3xl font-bold mb-4 leading-tight font-sans text-white">{readingArticle.title}</h1>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-sans mb-8">
                                    <span>{readingArticle.time}</span>
                                    <span>•</span>
                                    <span>{readingArticle.source}</span>
                                    <span>•</span>
                                    <span>3 min read</span>
                                </div>
                                
                                <div className="w-full h-48 bg-zinc-800 rounded-xl mb-8 overflow-hidden relative border border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-bold font-sans tracking-tighter">
                                        {readingArticle.source.toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-3 left-3 text-[10px] text-white/70 font-sans">
                                        Photo: AP / {readingArticle.source} Wire
                                    </div>
                                </div>

                                {isGeneratingArticle ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-white/10 rounded w-full" />
                                        <div className="h-4 bg-white/10 rounded w-full" />
                                        <div className="h-4 bg-white/10 rounded w-3/4" />
                                        <div className="h-4 bg-white/10 rounded w-full mt-6" />
                                        <div className="h-4 bg-white/10 rounded w-5/6" />
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-lg leading-relaxed text-gray-300 font-serif">
                                        {articleBody.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 bg-zinc-900 border-t border-white/10 font-sans">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1"><SilasLogo className="w-5 h-5" /></div>
                                    <div>
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">AI Context</span>
                                        <p className="text-xs text-gray-500">
                                            This article aligns with your interest in "{readingArticle.id === 5 ? 'Travel' : readingArticle.id === 2 ? 'Finance' : 'Technology'}". 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- ADD EVIDENCE MODAL --- */}
                <AnimatePresence>
                    {showAddEvidence && (
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            className="absolute inset-0 z-[70] bg-[#1C1C1E] flex flex-col"
                        >
                            <div className="pt-14 px-4 pb-4 border-b border-gray-800 flex justify-between items-center bg-[#1C1C1E] sticky top-0 z-10">
                                <button onClick={() => setShowAddEvidence(false)} className="text-blue-500 text-[17px]">Cancel</button>
                                <span className="font-bold text-white text-[17px]">Add Evidence</span>
                                <div className="w-12" />
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto">
                                <div className="bg-[#2C2C2E] p-2 rounded-xl flex items-center gap-2 mb-4 sticky top-0 z-10">
                                    <Search className="text-gray-500 ml-2" size={18} />
                                    <input type="text" placeholder="Search device history..." className="bg-transparent text-white w-full outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                </div>
                                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                                    {['ALL', 'TEXT', 'CALL', 'PHOTO', 'EMAIL'].map(cat => (
                                        <button key={cat} onClick={() => setEvidenceCategory(cat as any)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${evidenceCategory === cat ? 'bg-white text-black' : 'bg-[#2C2C2E] text-gray-400'}`}>{cat}</button>
                                    ))}
                                </div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1">Suggested Matches</h3>
                                <div className="space-y-3">
                                    {getMockSearchResults().map((item, i) => (
                                        <div key={i} onClick={() => handleAddEvidence(item)} className="bg-[#2C2C2E] p-4 rounded-xl flex items-center gap-4 cursor-pointer active:bg-[#3A3A3C]">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                                                {item.type === 'text' && <MessageSquare size={18} className="text-green-400" />}
                                                {item.type === 'voice' && <Phone size={18} className="text-blue-400" />}
                                                {item.type === 'photo' && <ImageIcon size={18} className="text-purple-400" />}
                                                {item.type === 'email' && <FileText size={18} className="text-yellow-400" />}
                                                {item.type === 'web' && <Globe size={18} className="text-cyan-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white text-sm truncate">{item.label}</div>
                                                <div className="text-xs text-gray-400 truncate">{item.detail}</div>
                                            </div>
                                            <Plus size={20} className="text-blue-500" />
                                        </div>
                                    ))}
                                    {getMockSearchResults().length === 0 && (
                                        <div className="text-center text-gray-500 py-10 text-sm">No matches found for this query.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- ADD PERSON MODAL --- */}
                <AnimatePresence>
                    {showAddPersonModal && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                            onClick={() => setShowAddPersonModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                className="bg-[#1C1C1E] border border-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Add New Entity</h3>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Name</label>
                                        <input type="text" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Sarah Miller" autoFocus />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Relationship</label>
                                        <input type="text" value={newPersonRelation} onChange={e => setNewPersonRelation(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Colleague" />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowAddPersonModal(false)} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors">Cancel</button>
                                    <button onClick={handleAddNewPerson} disabled={!newPersonName.trim()} className={`flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold transition-colors ${!newPersonName.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}>Add</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- EVIDENCE DETAIL VIEW --- */}
                <AnimatePresence>
                {activeEvidence && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-50 bg-[#000000] flex flex-col" 
                    >
                        <div className="pt-14 pb-4 px-4 flex items-center gap-4 bg-[#1C1C1E] border-b border-gray-800 z-50 shadow-md">
                            <button onClick={() => { if (audioSourceRef.current) { try { audioSourceRef.current.stop(); } catch(e) {} audioSourceRef.current = null; } setIsPlayingAudio(false); setActiveEvidence(null); }} className="flex items-center text-blue-500 gap-1 active:opacity-50">
                                <ChevronLeft className="w-8 h-8" /> <span className="text-[17px] font-medium">Back</span>
                            </button>
                            <div className="flex-1 text-center pr-12">
                                <span className="font-bold text-gray-200 block text-sm">{activeEvidence.title}</span>
                                <span className="text-[10px] text-gray-500">{activeEvidence.date}</span>
                            </div>
                            <button onClick={() => handleDeleteEvidence(activeEvidence.id)} className="p-2 text-red-500 active:opacity-50"><Trash2 size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-[#000000]">
                            {evidenceImages[activeEvidence.title] || activeEvidence.imageUrl ? (
                                    <div className="flex justify-center mb-8 mt-4">
                                        <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-lg p-2 shadow-2xl rotate-1 overflow-hidden relative">
                                            <img src={evidenceImages[activeEvidence.title] || activeEvidence.imageUrl} className="w-full h-full object-cover filter contrast-125" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none mix-blend-overlay"></div>
                                        </div>
                                    </div>
                            ) : loadingImage ? (
                                    <div className="flex justify-center mb-8 mt-4 h-[300px] items-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                                            <span className="text-xs text-gray-500 font-mono animate-pulse">RECONSTRUCTING ARTIFACT...</span>
                                        </div>
                                    </div>
                            ) : (
                                <div className="flex justify-center mb-8 mt-4">
                                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/20 border border-gray-800">
                                        <activeEvidence.icon className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>
                            )}
                            <div className="text-center mb-8">
                                <p className="text-gray-300 text-lg font-medium leading-relaxed px-4">{activeEvidence.content || activeEvidence.detail}</p>
                            </div>
                            {activeEvidence.audioTranscript && (
                                <div className="bg-[#1C1C1E] rounded-2xl p-6 mb-8 border border-gray-800">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button onClick={toggleAudio} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform">
                                            {isLoadingAudio ? <Loader2 className="animate-spin" /> : isPlayingAudio ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                                            </button>
                                        <div className="flex-1">
                                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div className="h-full bg-white" animate={{ width: isPlayingAudio ? "100%" : "0%" }} transition={{ duration: 10, ease: "linear" }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400 font-mono leading-relaxed p-3 bg-black/50 rounded-lg border border-gray-800/50">"{activeEvidence.audioTranscript}"</div>
                                </div>
                            )}
                            {activeEvidence.contextMessages && (
                                <div className="space-y-2 mb-8">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Historical Context</h4>
                                    {activeEvidence.contextMessages.map((msg, i) => (
                                        <MessageBubble key={i} text={msg.text} isMe={msg.isMe} isTarget={msg.isTarget} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>

           </div>
       )}

       {!activeEvidence && (
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0a0f] border-t border-white/10 z-50 flex justify-around items-center pb-6 px-4 shrink-0">
                <NavItem icon={Activity} label="Dashboard" active={activeTab === 'HOME'} onClick={() => { setActiveTab('HOME'); setSelectedPerson(null); setActiveTile(null); }} />
                <NavItem icon={BrainCircuit} label="Memory" active={activeTab === 'MEMORY'} onClick={() => { setActiveTab('MEMORY'); setSelectedPerson(null); setActiveTile(null); }} />
                <NavItem icon={Zap} label="Activity" active={activeTab === 'ACTIVITY'} onClick={() => { setActiveTab('ACTIVITY'); setSelectedPerson(null); setActiveTile(null); }} />
                <NavItem icon={User} label="Profile" active={activeTab === 'PROFILE'} onClick={() => { setActiveTab('PROFILE'); setSelectedPerson(null); setActiveTile(null); }} />
           </div>
       )}

        <div className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer pointer-events-auto" onClick={onClose}>
            <div className="w-32 h-1.5 bg-gray-500 rounded-full opacity-50" />
        </div>
    </motion.div>
  );
};