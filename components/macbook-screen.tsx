"use client"

// MacBook Screen Portfolio - v34 VERIFIED CLEAN
// ALL 27 useState hooks at lines 161-205 (top level only)
// showConversationList=164, selectedNote=165, viewingPhoto=166
// NO useState inside if(mobileScreen) blocks - verified March 25, 2026
import { useState, useEffect, useRef } from "react"
import { User, Folder, Wifi, Battery, Search, Lock, ChevronLeft, ChevronRight, RotateCw, Share, Share2, Plus, Grid3X3, X, MessageCircle, Power, Camera, Flashlight, MoreHorizontal, Heart, Trash2, Home, FileText, Image as ImageIcon, Volume2, VolumeX, BookOpen, Layers, Mail, MapPin, GraduationCap, Briefcase, Play } from "lucide-react"
import { TicTacToeGame, TicTacToeState, initialTicTacToeState } from "./tictactoe-game"
import { BrainGames, BrainGamesState, initialBrainGamesState } from "./brain-games"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { CharityChat, ChatMessage, getCharityResponse, shouldAutoHeart } from "@/components/charity-chat"

interface WindowState {
  isOpen: boolean
  isMinimized: boolean
  isMinimizing?: boolean
  size?: { width: number; height: number }
}

interface SafariWindowState extends WindowState {
  project: string | null
}

interface WidgetPosition {
  x: number
  y: number
}

// Message contacts for the Messages app
// Mobile (iPhone) message contacts
const mobileMessageContacts = [
  {
    id: 'welcome',
    name: 'Charity',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-03-17%20at%205.41.24%E2%80%AFPM.jpeg-IqAgTgZhAtj7ZVseWJ9tdnbTkwQk0b.png',
    isMe: true,
    lastMessage: 'Welcome to my portfolio on my iPhone!',
    time: 'now',
    unread: true,
    messages: [
      { from: 'charity', text: "Hey! Welcome to my portfolio on my iPhone!", time: '10:30 AM' },
      { from: 'charity', text: "Feel free to check out my case studies! Tap on any one of my case studies and explore.", time: '10:30 AM' },
      { from: 'charity', text: "I'm a UX/UI designer passionate about creating meaningful digital experiences. Enjoy!", time: '10:31 AM' },
    ]
  },
  {
    id: 'teammate',
    name: 'Teammate Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Splash%20%281%29-KqSMOY1x1FPRUHBclJqGixgpztpco8.png',
    lastMessage: 'Sports dating app - "Don\'t Play Alone"',
    time: '9:45 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Teammate - Sports Dating App", time: '9:40 AM' },
      { from: 'project', text: "A dating app for sports fans that connects like-minded individuals based on their team preferences and game schedules.", time: '9:42 AM' },
      { from: 'project', text: "Key features: Character-based matching, safe public venues at sports events, and sports-driven connections.", time: '9:45 AM' },
    ]
  },
  {
    id: 'meetly',
    name: 'Meetly Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-LUuEKdvoQBApg1puQoNvsyyFbBow2B.png',
    lastMessage: 'Social coordination made easy',
    time: '9:30 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Meetly - Social Group Coordination", time: '9:25 AM' },
      { from: 'project', text: "Helps social groups coordinate meetups by combining the power of a calendar with the ease of a messaging app.", time: '9:28 AM' },
      { from: 'project', text: "Eliminated coordination fatigue with voting screens and contextual chat for planning.", time: '9:30 AM' },
    ]
  },
  {
    id: 'silas',
    name: 'Silas Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_this_icon_202603301129.png-WEqKbKT0bK2vdV3JIdGyh61HGChPcI.jpeg',
    lastMessage: 'Your AI lifestyle assistant',
    time: '9:15 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Silas - AI Lifestyle Assistant", time: '9:10 AM' },
      { from: 'project', text: "An AI-powered assistant that integrates with your financial tools, calendar, and shopping preferences.", time: '9:12 AM' },
      { from: 'project', text: "Features personalized suggestions, proactive reminders, and seamless API integrations.", time: '9:15 AM' },
    ]
  }
]

// Desktop (MacBook) message contacts
const messageContacts = [
  {
    id: 'welcome',
    name: 'Charity',
    avatar: null,
    isMe: true,
    lastMessage: 'Welcome to my portfolio on my MacBook!',
    time: 'now',
    unread: true,
    messages: [
      { from: 'charity', text: "Hey! Welcome to my portfolio on my MacBook!", time: '10:30 AM' },
      { from: 'charity', text: "Feel free to explore around - check out my Projects folder on the desktop or click on any of my case studies below.", time: '10:30 AM' },
      { from: 'charity', text: "I'm a UX/UI designer passionate about creating meaningful digital experiences. Feel free to message me here and talk to me in iMessages. Happy to respond!", time: '10:31 AM' },
    ]
  },
  {
    id: 'teammate',
    name: 'Teammate Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Splash%20%281%29-KqSMOY1x1FPRUHBclJqGixgpztpco8.png',
    lastMessage: 'Sports dating app - "Don\'t Play Alone"',
    time: '9:45 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Teammate - Sports Dating App", time: '9:40 AM' },
      { from: 'project', text: "A dating app for sports fans that connects like-minded individuals based on their team preferences and game schedules.", time: '9:42 AM' },
      { from: 'project', text: "Key features: Character-based matching, safe public venues at sports events, and sports-driven connections.", time: '9:45 AM' },
    ]
  },
  {
    id: 'meetly',
    name: 'Meetly Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-LUuEKdvoQBApg1puQoNvsyyFbBow2B.png',
    lastMessage: 'Social coordination made easy',
    time: '9:30 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Meetly - Social Group Coordination", time: '9:25 AM' },
      { from: 'project', text: "Helps social groups coordinate meetups by combining the power of a calendar with the ease of a messaging app.", time: '9:28 AM' },
      { from: 'project', text: "Eliminated coordination fatigue with voting screens and contextual chat for planning.", time: '9:30 AM' },
    ]
  },
  {
    id: 'silas',
    name: 'Silas Project',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_this_icon_202603301129.png-WEqKbKT0bK2vdV3JIdGyh61HGChPcI.jpeg',
    lastMessage: 'Your intelligent AI companion',
    time: '9:15 AM',
    unread: false,
    messages: [
      { from: 'project', text: "Silas - The Integrated AI Companion", time: '9:10 AM' },
      { from: 'project', text: "A smart companion built into your phone's OS that connects your calendar, bank, and messages for proactive support.", time: '9:12 AM' },
      { from: 'project', text: "Uses read-only access for context and only requests permissions when needed - always with user approval.", time: '9:15 AM' },
    ]
  }
]

// Background options - videos and images
const BACKGROUND_OPTIONS = [
  { id: 'sunflower', type: 'video', url: 'https://videos.pexels.com/video-files/5150392/5150392-hd_1920_1080_30fps.mp4', preview: 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=300', name: 'Sunflower' },
  { id: 'mountains', type: 'image', url: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1920', preview: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=300', name: 'Mountains' },
  { id: 'sunset', type: 'image', url: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1920', preview: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=300', name: 'Sunset' },
  { id: 'aurora', type: 'image', url: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1920', preview: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=300', name: 'Aurora' },
]

// Audio URL - Neo Soul Jazz Lo-fi Mix
const AUDIO_URL = "https://xvhipnkxts77d4uo.public.blob.vercel-storage.com/YTDown.com_YouTube_Lo-fi-R_B-Morning-Work-Mix-Chill-Neo-Sou_Media_-BtHbT_Ambo_001_1080p.mp3"

// Memoji image URL
const MEMOJI_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-03-17%20at%205.41.24%E2%80%AFPM.jpeg-IqAgTgZhAtj7ZVseWJ9tdnbTkwQk0b.png"

// Full photo for About window
const CHARITY_PHOTO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%2Bof%2Bcharity-hI722zEcgf9H0VQnx7WpB16iAEEtIe.webp"

// Resume PDF URL (served locally to avoid cross-origin blocking)
const RESUME_PDF_URL = "/Charity_Dupont_Resume.pdf"

// Project Icons
const TEAMMATE_ICON = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Splash%20%281%29-KqSMOY1x1FPRUHBclJqGixgpztpco8.png"
const MEETLY_ICON = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20%282%29-LUuEKdvoQBApg1puQoNvsyyFbBow2B.png"
const SILAS_ICON = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_this_icon_202603301129.png-WEqKbKT0bK2vdV3JIdGyh61HGChPcI.jpeg"

type ScreenState = "login" | "loading" | "desktop" | "netflix" | "netflixLoading"

// Case study content for each project
const caseStudies = {
  teammate: {
    title: "Teammate",
    subtitle: "Sports Dating App",
    hero: "Don't Play Alone",
    overview: "Sports fans often struggle to find partners who understand their lifestyle. Traditional dating apps ignore the 'logistics of fandom,' leading to mismatched expectations and arguments over weekend schedules.",
    role: "Product Designer",
    timeline: "3 Weeks (2024)",
    tools: ["Figma", "Adobe Photoshop", "User Research", "Competitive Analysis"],
    challenge: "While competitors focus on static personality traits, no current app solves the dynamic scheduling conflicts sports fans face. Users find current dating apps lacking in depth and safety.",
    solution: "Teammate leverages sports APIs to filter matches by fandom intensity and streamlines the 'first date' logistics by auto-scheduling dates around live game events.",
    results: ["Character-based matching", "Safe public venues", "Sports-driven connections"],
    color: "from-rose-500 to-pink-600",
    icon: TEAMMATE_ICON,
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-CrKpENIJ1QkNGw5Ph7xHp3T8f3pYSc.png",
    isFullCaseStudy: true
  },
  meetly: {
    title: "Meetly",
    subtitle: "Social Group Coordination App",
    hero: "Coordinate meetups effortlessly",
    overview: "A mobile application to help friends and social groups better coordinate their meetups and share schedules effortlessly. Users face significant hassle and frustration when trying to schedule meetups.",
    role: "Co-Product Designer",
    timeline: "May 2024",
    tools: ["Figma", "User Research", "Prototyping", "Usability Testing"],
    challenge: "Juggling busy schedules and conflicting availabilities often leads to headache, missed opportunities, and social disappointment. There is a complete absence of a dedicated app specifically designed for social coordination with friends.",
    solution: "Meetly simplifies scheduling through user-friendly tools and voting options. The interface eliminates lengthy communication by allowing participants to input availability and preferences easily, while voting features facilitate shared decision-making.",
    results: ["Eliminated coordination fatigue", "Simplified group decisions", "Calendar integration"],
    color: "from-purple-400 to-indigo-500",
    icon: MEETLY_ICON,
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2023-YaC5eUy2iN2JImZekZb30iItst7UyL.png",
    isFullCaseStudy: true
  },
  silas: {
    title: "Silas",
    subtitle: "The Integrated AI Companion",
    hero: "Less thinking. More living.",
    overview: "Silas is an Integrated AI Companion that bridges the gap between fragmented digital data and physical-world needs. It integrates across existing apps and turns passive data into executable intelligence.",
    role: "Product Designer",
    timeline: "Anticipatory Project",
    tools: ["Figma", "Prototyping", "UX Research", "Anticipatory Design"],
    challenge: "Users live across 20+ reactive apps where calendar data is passive, banking records don't enable smart reordering, memory is disconnected from context, and messages do not automatically become tasks.",
    solution: "Silas uses Read-Only permissions to securely bridge the gap between apps. It provides a centralized Command Center, contextual commerce via Juno, financial intelligence through smart reordering, and proactive travel coordination.",
    results: ["Reduced cognitive load", "Context continuity", "Execution speed", "Data transparency"],
    color: "from-blue-500 to-purple-600",
    icon: SILAS_ICON,
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%201-DCyAK5AHlLld0eGIjOCKLL6GQSQLj4.png",
    isFullCaseStudy: true
  }
}

// Mobile screen states
type MobileScreenState = "lock" | "home" | "messages" | "caseStudy" | "notes" | "about" | "photos" | "safari" | "camera" | "tictactoe" | "braingames"

export function MacBookScreen() {
  const isMobile = useIsMobile()
  const [screenState, setScreenState] = useState<ScreenState>("login")
  const [mobileScreen, setMobileScreen] = useState<MobileScreenState>("lock")
  const [mobileCaseStudy, setMobileCaseStudy] = useState<string | null>(null)
  
  // Netflix experience state
  const [netflixModal, setNetflixModal] = useState<{ type: 'project' | 'about' | 'gallery' | null, data?: string | number }>({ type: null })
  const [showConversationList, setShowConversationList] = useState(true)
  const [selectedNote, setSelectedNote] = useState<number | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState<number | null>(null)
  const [viewingVideo, setViewingVideo] = useState<number | null>(null)
  const [viewingMediaIndex, setViewingMediaIndex] = useState<number | null>(null)
  const [password, setPassword] = useState("")
  const [aboutWindow, setAboutWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [projectsFolder, setProjectsFolder] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [safariWindow, setSafariWindow] = useState<SafariWindowState>({ isOpen: false, isMinimized: false, project: null })
  // Track multiple open case study windows
  const [openCaseStudies, setOpenCaseStudies] = useState<{ [key: string]: { isOpen: boolean, isMinimized: boolean, position: { x: number, y: number } } }>({})
  const [messagesWindow, setMessagesWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [notesWindow, setNotesWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [desktopSelectedNote, setDesktopSelectedNote] = useState<'experience' | 'about'>('experience')
  const [selectedContact, setSelectedContact] = useState('welcome')
  const [mobileConversations, setMobileConversations] = useState(mobileMessageContacts)
  const [desktopConversations, setDesktopConversations] = useState(messageContacts)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [photosWindow, setPhotosWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [caseStudiesFolder, setCaseStudiesFolder] = useState<WindowState>({ isOpen: true, isMinimized: false })
  
  // Tic-Tac-Toe game state
  const [tictactoeWindow, setTictactoeWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [tictactoePosition, setTictactoePosition] = useState({ x: 150, y: 60 })
  const [tictactoeScore, setTictactoeScore] = useState(0)
  const [tictactoeGameState, setTictactoeGameState] = useState<TicTacToeState>(initialTicTacToeState)
  
  // Brain Games state
  const [braingamesWindow, setBraingamesWindow] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [braingamesPosition, setBraingamesPosition] = useState({ x: 180, y: 80 })
  const [braingamesScore, setBraingamesScore] = useState(0)
  const [braingamesGameState, setBraingamesGameState] = useState<BrainGamesState>(initialBrainGamesState)
  
  const [mounted, setMounted] = useState(false)
  const [focusedWindow, setFocusedWindow] = useState<string>('caseStudies') // Track which window is on top

  // Background state
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_OPTIONS[0])
  const [backgroundsFolder, setBackgroundsFolder] = useState<WindowState>({ isOpen: false, isMinimized: false })
  const [backgroundsPosition, setBackgroundsPosition] = useState({ x: 180, y: 80 })

  // Help search state
  const [helpSearchQuery, setHelpSearchQuery] = useState('')
  
  // Safari browser URL state
  const [safariPosition, setSafariPosition] = useState({ x: 120, y: 50 })
  const [safariUrl, setSafariUrl] = useState('')
  const [safariInputUrl, setSafariInputUrl] = useState('')
  
  // Mobile Safari state
  const [mobileSafariUrl, setMobileSafariUrl] = useState('')
  
  // Leaving portfolio popup state
  const [showLeavingPopup, setShowLeavingPopup] = useState<string | null>(null)
  
  // Mobile reaction picker state
  const [showMobileReactions, setShowMobileReactions] = useState<string | null>(null)
  const MOBILE_REACTIONS = ['❤️', '👍', '👎', '😂', '❗', '❓', '😢', '😍']
  
  // Mobile GIF picker state
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [gifSearch, setGifSearch] = useState('')
  const [gifResults, setGifResults] = useState<Array<{id: string, url: string, preview: string}>>([])
  const [gifLoading, setGifLoading] = useState(false)
  
  // Pre-loaded trending GIFs for different categories
  const TRENDING_GIFS = {
    trending: [
      { id: '1', url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', preview: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/200w.gif' },
      { id: '2', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', preview: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif' },
      { id: '3', url: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', preview: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/200w.gif' },
      { id: '4', url: 'https://media.giphy.com/media/l41lGvinEgARjB2HC/giphy.gif', preview: 'https://media.giphy.com/media/l41lGvinEgARjB2HC/200w.gif' },
      { id: '5', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', preview: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif' },
      { id: '6', url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', preview: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/200w.gif' },
    ],
    birthday: [
      { id: 'b1', url: 'https://media.giphy.com/media/g5R9dok94mrIvplmZd/giphy.gif', preview: 'https://media.giphy.com/media/g5R9dok94mrIvplmZd/200w.gif' },
      { id: 'b2', url: 'https://media.giphy.com/media/WRL7YgP42OKns22wRD/giphy.gif', preview: 'https://media.giphy.com/media/WRL7YgP42OKns22wRD/200w.gif' },
      { id: 'b3', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif', preview: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200w.gif' },
      { id: 'b4', url: 'https://media.giphy.com/media/KdC9XVrVYOVu6zZiMH/giphy.gif', preview: 'https://media.giphy.com/media/KdC9XVrVYOVu6zZiMH/200w.gif' },
    ],
    love: [
      { id: 'l1', url: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif', preview: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/200w.gif' },
      { id: 'l2', url: 'https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif', preview: 'https://media.giphy.com/media/l0HlOvJ7yaacpuSas/200w.gif' },
      { id: 'l3', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', preview: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/200w.gif' },
      { id: 'l4', url: 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif', preview: 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/200w.gif' },
    ],
    funny: [
      { id: 'f1', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif', preview: 'https://media.giphy.com/media/10JhviFuU2gWD6/200w.gif' },
      { id: 'f2', url: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif', preview: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/200w.gif' },
      { id: 'f3', url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', preview: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/200w.gif' },
      { id: 'f4', url: 'https://media.giphy.com/media/xUA7bdHu0xn1hVLAIg/giphy.gif', preview: 'https://media.giphy.com/media/xUA7bdHu0xn1hVLAIg/200w.gif' },
    ],
    happy: [
      { id: 'h1', url: 'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif', preview: 'https://media.giphy.com/media/5GoVLqeAOo6PK/200w.gif' },
      { id: 'h2', url: 'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif', preview: 'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/200w.gif' },
      { id: 'h3', url: 'https://media.giphy.com/media/3oz8xRF0v9WMAUVLNK/giphy.gif', preview: 'https://media.giphy.com/media/3oz8xRF0v9WMAUVLNK/200w.gif' },
      { id: 'h4', url: 'https://media.giphy.com/media/BlVnrxJgTGsUw/giphy.gif', preview: 'https://media.giphy.com/media/BlVnrxJgTGsUw/200w.gif' },
    ],
    sad: [
      { id: 's1', url: 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif', preview: 'https://media.giphy.com/media/d2lcHJTG5Tscg/200w.gif' },
      { id: 's2', url: 'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif', preview: 'https://media.giphy.com/media/OPU6wzx8JrHna/200w.gif' },
      { id: 's3', url: 'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif', preview: 'https://media.giphy.com/media/L95W4wv8nnb9K/200w.gif' },
      { id: 's4', url: 'https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif', preview: 'https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/200w.gif' },
    ],
    dogs: [
      { id: 'd1', url: 'https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif', preview: 'https://media.giphy.com/media/mCRJDo24UvJMA/200w.gif' },
      { id: 'd2', url: 'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif', preview: 'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/200w.gif' },
      { id: 'd3', url: 'https://media.giphy.com/media/Y4pAQv58ETJgRwoLxj/giphy.gif', preview: 'https://media.giphy.com/media/Y4pAQv58ETJgRwoLxj/200w.gif' },
      { id: 'd4', url: 'https://media.giphy.com/media/qrwthQPPQrtEk/giphy.gif', preview: 'https://media.giphy.com/media/qrwthQPPQrtEk/200w.gif' },
    ],
    thank: [
      { id: 't1', url: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif', preview: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/200w.gif' },
      { id: 't2', url: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', preview: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/200w.gif' },
      { id: 't3', url: 'https://media.giphy.com/media/osjgQPWRx3cac/giphy.gif', preview: 'https://media.giphy.com/media/osjgQPWRx3cac/200w.gif' },
      { id: 't4', url: 'https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif', preview: 'https://media.giphy.com/media/l3q2wJsC23ikJg9xe/200w.gif' },
    ],
  }
  
  // Search GIFs based on query
  const searchGifs = (query: string) => {
    setGifLoading(true)
    const q = query.toLowerCase().trim()
    
    // Match to categories
    if (q.includes('birthday') || q.includes('bday')) {
      setGifResults(TRENDING_GIFS.birthday)
    } else if (q.includes('love') || q.includes('heart')) {
      setGifResults(TRENDING_GIFS.love)
    } else if (q.includes('funny') || q.includes('lol') || q.includes('laugh')) {
      setGifResults(TRENDING_GIFS.funny)
    } else if (q.includes('happy') || q.includes('yay') || q.includes('excited')) {
      setGifResults(TRENDING_GIFS.happy)
    } else if (q.includes('sad') || q.includes('cry')) {
      setGifResults(TRENDING_GIFS.sad)
    } else if (q.includes('dog') || q.includes('puppy') || q.includes('pet')) {
      setGifResults(TRENDING_GIFS.dogs)
    } else if (q.includes('thank') || q.includes('thanks')) {
      setGifResults(TRENDING_GIFS.thank)
    } else {
      setGifResults(TRENDING_GIFS.trending)
    }
    
    setTimeout(() => setGifLoading(false), 300)
  }
  
  const addMobileReaction = (messageId: string, reaction: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reaction: msg.reaction === reaction ? undefined : reaction }
        : msg
    ))
    setShowMobileReactions(null)
  }
  
  const sendGif = (gifData: {id: string, url: string, preview: string}, searchTerm?: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      text: `IMG:${gifData.url}`,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, newMsg])
    setShowGifPicker(false)
    setGifSearch('')
    setGifResults([])
    
    // Get Charity's contextual response to GIF based on category
    setMobileIsTyping(true)
    setTimeout(() => {
      let responses: string[]
      const term = (searchTerm || gifSearch).toLowerCase()
      
      if (term.includes('birthday') || term.includes('bday')) {
        responses = [
          "Aww thank you! My birthday is actually coming up in December!",
          "Birthday vibes! I love celebrations",
          "This is so cute! Reminds me of my last birthday with Hunter"
        ]
      } else if (term.includes('love') || term.includes('heart')) {
        responses = [
          "Aww that's so sweet!",
          "Love this! You're so kind",
          "This made me smile! Thank you"
        ]
      } else if (term.includes('funny') || term.includes('lol') || term.includes('laugh')) {
        responses = [
          "Hahaha! That's hilarious!",
          "LOL this is so funny!",
          "I needed that laugh today!"
        ]
      } else if (term.includes('happy') || term.includes('yay') || term.includes('excited')) {
        responses = [
          "Yay! Love the positive energy!",
          "This makes me happy too!",
          "Such good vibes!"
        ]
      } else if (term.includes('sad') || term.includes('cry')) {
        responses = [
          "Aww, is everything okay?",
          "Hope things get better!",
          "I'm here if you want to talk about anything"
        ]
      } else if (term.includes('dog') || term.includes('puppy') || term.includes('pet')) {
        responses = [
          "Omg so cute! Reminds me of Hunter!",
          "I love dogs! Hunter would love this",
          "Aww! This is adorable - Hunter is a Dalmatian btw!"
        ]
      } else if (term.includes('thank')) {
        responses = [
          "You're welcome! Happy to help!",
          "Of course! Anytime!",
          "No problem at all!"
        ]
      } else {
        responses = [
          "Nice GIF!",
          "Haha love it!",
          "That's a good one!",
          "I like that!",
          "Great choice!"
        ]
      }
      
      const response = responses[Math.floor(Math.random() * responses.length)]
      const charityMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, charityMsg])
      setMobileIsTyping(false)
    }, 1500)
  }
  
  
  // Camera and Flashlight state
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(AUDIO_URL)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle audio toggle
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.play().catch(() => { })
      } else {
        audioRef.current.pause()
      }
    }
  }, [audioEnabled])

  // Mobile chat state
  const [mobileInput, setMobileInput] = useState('')
  const [mobileIsTyping, setMobileIsTyping] = useState(false)

  // Chat messages state - persists when Messages window is closed
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hey! Welcome to my portfolio on my MacBook",
      time: getCurrentTime(),
    },
    {
      id: 'welcome-2',
      role: 'assistant',
      text: "Feel free to explore - check out my case studies in the dock below or click around!",
      time: getCurrentTime(),
    },
    {
      id: 'welcome-3',
      role: 'assistant',
      text: "I'm a UX Designer passionate about creating meaningful digital experiences - feel free to ask me anything!",
      time: getCurrentTime(),
    },
  ])



  // Personal photos for the photo stack
  const personalPhotos = [
    "/images/sunflowers-sunrise.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7592-px1oAdcjTmaa9c7aTzlifKeaOqtueY.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6030-HDajKbzLzr6NbShaVi96ClYMP8BhmX.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3f8de33d-4c26-4ebb-9f10-d1ed1073fe58.JPG-Z2f5Pmtz0aNiNTX7UVFea7jzrLPwrf.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0089.JPG-ny4ZUKnkaTaq64nuENlExBo5Mqmi5q.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2e2f3d08-d3fe-45db-a7a2-b93ecc0bea49.JPG-cSfHYSFu1O8pB2zkZPiM3QYrCRLWGO.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0402-B6ik9cU5RksRk7f02Hsd1qgBPFD9Yi.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8746%20%281%29-ykl4qPdci0vLiSAJwAbpTJlqY79eHb.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facetune_05-10-2025-08-52-01-QaKLBArAwKX819Wed7HtYbzdlq4UK1.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1207.JPG-Wv7RabMUc5nFqjUZD3HiibNmpVMM90.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5380-slsfm6sbzMLaACQBWI4xxdUiuTOvHd.jpg"
  ]
  
  // Personal videos
  const personalVideos = [
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/1248d3d2-9378-4a55-8436-27859afc42b0.MP4",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/48012242-743F-4BD3-9D46-776EFC06129D.MP4",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/C90C5DE4-6859-48AA-9428-88FA087CE9C5.MP4",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/IMG_0222.MOV",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/IMG_3724.MOV",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/ips-C126AEAA-DDF9-48FD-938D-C8989BDBAF0B.mov",
    "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/ips-C6779F66-5629-4CE0-969B-0EEB2B616A19.mov"
  ]
  
  // Combined media for desktop Photos app (mixed photos and videos)
  const desktopMedia: Array<{type: 'photo' | 'video', url: string}> = [
    { type: 'photo', url: "/images/sunflowers-sunrise.jpg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/1248d3d2-9378-4a55-8436-27859afc42b0.MP4" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7592-px1oAdcjTmaa9c7aTzlifKeaOqtueY.jpg" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6030-HDajKbzLzr6NbShaVi96ClYMP8BhmX.jpg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/48012242-743F-4BD3-9D46-776EFC06129D.MP4" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3f8de33d-4c26-4ebb-9f10-d1ed1073fe58.JPG-Z2f5Pmtz0aNiNTX7UVFea7jzrLPwrf.jpeg" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0089.JPG-ny4ZUKnkaTaq64nuENlExBo5Mqmi5q.jpeg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/C90C5DE4-6859-48AA-9428-88FA087CE9C5.MP4" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2e2f3d08-d3fe-45db-a7a2-b93ecc0bea49.JPG-cSfHYSFu1O8pB2zkZPiM3QYrCRLWGO.jpeg" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0402-B6ik9cU5RksRk7f02Hsd1qgBPFD9Yi.jpg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/IMG_0222.MOV" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8746%20%281%29-ykl4qPdci0vLiSAJwAbpTJlqY79eHb.jpg" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facetune_05-10-2025-08-52-01-QaKLBArAwKX819Wed7HtYbzdlq4UK1.jpg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/IMG_3724.MOV" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1207.JPG-Wv7RabMUc5nFqjUZD3HiibNmpVMM90.jpeg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/ips-C126AEAA-DDF9-48FD-938D-C8989BDBAF0B.mov" },
    { type: 'photo', url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5380-slsfm6sbzMLaACQBWI4xxdUiuTOvHd.jpg" },
    { type: 'video', url: "https://d1ulpwtfq85j7t5c.public.blob.vercel-storage.com/ips-C6779F66-5629-4CE0-969B-0EEB2B616A19.mov" },
  ]
  const [currentTime, setCurrentTime] = useState("")
  const [loginTime, setLoginTime] = useState("")

  // Draggable widget positions
  const [clockPosition, setClockPosition] = useState<WidgetPosition>({ x: 32, y: -120 })
  const [weatherPosition, setWeatherPosition] = useState<WidgetPosition>({ x: 220, y: -120 })

  // Draggable window positions
  const [aboutPosition, setAboutPosition] = useState<WidgetPosition>({ x: 120, y: 80 })
  const [photosPosition, setPhotosPosition] = useState<WidgetPosition>({ x: 80, y: 64 })
  const [caseStudiesPosition, setCaseStudiesPosition] = useState<WidgetPosition>({ x: 200, y: 100 })
  const [messagesPosition, setMessagesPosition] = useState<WidgetPosition>({ x: 60, y: 50 })
  const [notesPosition, setNotesPosition] = useState<WidgetPosition>({ x: 80, y: 60 })
  const [projectsPosition, setProjectsPosition] = useState<WidgetPosition>({ x: 200, y: 100 })

  const [isDragging, setIsDragging] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const day = days[now.getDay()]
      const month = months[now.getMonth()]
      const date = now.getDate()
      const hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const hour12 = hours % 12 || 12
      setCurrentTime(`${day} ${month} ${date}  ${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`)
      setLoginTime(`${hour12}:${minutes}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setScreenState("loading")
    setTimeout(() => {
      setScreenState("desktop")
      // Open Messages window on login
      setMessagesWindow({ isOpen: true, isMinimized: false })
    }, 2500)
  }

  const handleLogout = () => {
    setScreenState("login")
    setAboutWindow({ isOpen: false, isMinimized: false })
    setProjectsFolder({ isOpen: false, isMinimized: false })
    setSafariWindow({ isOpen: false, isMinimized: false, project: null })
    setMessagesWindow({ isOpen: false, isMinimized: false })
  }
  
  // Flashlight toggle using device torch
  const toggleFlashlight = async () => {
    try {
      if (flashlightOn) {
        // Turn off
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        setFlashlightOn(false)
      } else {
        // Turn on
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        const track = stream.getVideoTracks()[0]
        // @ts-expect-error - torch is not in TypeScript types
        await track.applyConstraints({ advanced: [{ torch: true }] })
        streamRef.current = stream
        setFlashlightOn(true)
      }
    } catch {
      // Fallback: just toggle visual state if torch not supported
      setFlashlightOn(!flashlightOn)
    }
  }
  
  // Start camera
  const startCamera = async (facing: 'user' | 'environment' = 'environment') => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.log('[v0] Camera error:', err)
    }
  }
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }
  
  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Flip horizontally for front camera
        if (cameraFacing === 'user') {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        }
        ctx.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedPhotos(prev => [dataUrl, ...prev])
      }
    }
  }
  
  // Switch camera
  const switchCamera = () => {
    const newFacing = cameraFacing === 'user' ? 'environment' : 'user'
    setCameraFacing(newFacing)
    startCamera(newFacing)
  }

  // Drag handlers for widgets and windows
  const handleMouseDown = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(itemId)

    let position: WidgetPosition
    switch (itemId) {
      case 'clock': position = clockPosition; break
      case 'weather': position = weatherPosition; break
      case 'about': position = aboutPosition; break
      case 'projects': position = projectsPosition; break
      case 'photos': position = photosPosition; break
      case 'caseStudies': position = caseStudiesPosition; break
      case 'backgrounds': position = backgroundsPosition; break
      case 'messages': position = messagesPosition; break
      case 'notes': position = notesPosition; break
      case 'tictactoe': position = tictactoePosition; break
      case 'braingames': position = braingamesPosition; break
      default: position = { x: 0, y: 0 }
    }

    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragOffset.current.x
    const newY = e.clientY - dragOffset.current.y

    switch (isDragging) {
      case 'clock': setClockPosition({ x: newX, y: newY }); break
      case 'weather': setWeatherPosition({ x: newX, y: newY }); break
      case 'about': setAboutPosition({ x: newX, y: newY }); break
      case 'projects': setProjectsPosition({ x: newX, y: newY }); break
      case 'photos': setPhotosPosition({ x: newX, y: newY }); break
      case 'caseStudies': setCaseStudiesPosition({ x: newX, y: newY }); break
      case 'backgrounds': setBackgroundsPosition({ x: newX, y: newY }); break
      case 'messages': setMessagesPosition({ x: newX, y: newY }); break
      case 'notes': setNotesPosition({ x: newX, y: newY }); break
      case 'tictactoe': setTictactoePosition({ x: newX, y: newY }); break
      case 'braingames': setBraingamesPosition({ x: newX, y: newY }); break
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  // Mobile chat submit handler
  const handleMobileChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileInput.trim() || mobileIsTyping) return

const messageText = mobileInput.trim()
  const autoHeart = shouldAutoHeart(messageText)
  const messageId = `user-${Date.now()}`
  
  const userMessage: ChatMessage = {
    id: messageId,
    role: 'user',
    text: messageText,
    time: getCurrentTime(),
    reaction: undefined, // Will be added after delay
  }
  
  setChatMessages(prev => [...prev, userMessage])
  setMobileInput('')
  setMobileIsTyping(true)
  
  // Add heart reaction after 3 second delay if deserved
  if (autoHeart) {
    setTimeout(() => {
      setChatMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, reaction: '���️' } : msg
      ))
    }, 3000)
  }
  
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))

    const response = getCharityResponse(userMessage.text)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response,
      time: getCurrentTime(),
    }

    setChatMessages(prev => [...prev, assistantMessage])
    setMobileIsTyping(false)
  }

  const openMessagesWindow = () => {
    setMessagesWindow({ isOpen: true, isMinimized: false })
    setFocusedWindow('messages')
  }

  const openAboutWindow = () => {
    setAboutWindow({ isOpen: true, isMinimized: false })
    setFocusedWindow('about')
  }

  const openProjectsFolder = () => {
    setProjectsFolder({ isOpen: true, isMinimized: false })
    setFocusedWindow('projects')
  }

  const openCaseStudy = (project: string) => {
    // Check if this case study is already open (and not minimized) - just focus it
    if (openCaseStudies[project]?.isOpen && !openCaseStudies[project]?.isMinimized) {
      setFocusedWindow(`safari-${project}`)
      return
    }
    
    // Check if this case study is minimized - restore it
    if (openCaseStudies[project]?.isMinimized) {
      setOpenCaseStudies(prev => ({
        ...prev,
        [project]: { ...prev[project], isMinimized: false }
      }))
      setFocusedWindow(`safari-${project}`)
      return
    }

    // Open new case study window with offset based on how many are open
    const openCount = Object.keys(openCaseStudies).filter(k => openCaseStudies[k].isOpen).length
    setOpenCaseStudies(prev => ({
      ...prev,
      [project]: {
        isOpen: true,
        isMinimized: false,
        position: { x: 8 + (openCount * 30), y: 28 + (openCount * 20) }
      }
    }))
    setFocusedWindow(`safari-${project}`)
  }

  const closeCaseStudy = (project: string) => {
    setOpenCaseStudies(prev => {
      const newState = { ...prev }
      delete newState[project]
      return newState
    })
  }

  const minimizeCaseStudy = (project: string) => {
    setOpenCaseStudies(prev => ({
      ...prev,
      [project]: { ...prev[project], isMinimized: true }
    }))
  }

  const restoreCaseStudy = (project: string) => {
    setOpenCaseStudies(prev => ({
      ...prev,
      [project]: { ...prev[project], isMinimized: false }
    }))
    setFocusedWindow(`safari-${project}`)
  }

  const focusWindow = (windowName: string) => {
    setFocusedWindow(windowName)
  }

  // Minimize with animation - shows window shrinking to dock
  const minimizeWindow = (
    windowName: string,
    setWindow: React.Dispatch<React.SetStateAction<WindowState>> | React.Dispatch<React.SetStateAction<SafariWindowState>>
  ) => {
    // Start minimizing animation
    (setWindow as React.Dispatch<React.SetStateAction<WindowState>>)(prev => ({ ...prev, isMinimizing: true }))

    // After animation completes, set to minimized
    setTimeout(() => {
      (setWindow as React.Dispatch<React.SetStateAction<WindowState>>)(prev => ({
        ...prev,
        isMinimizing: false,
        isMinimized: true
      }))
    }, 400)
  }

  // ==================== MOBILE IPHONE EXPERIENCE ====================
  if (isMobile) {
    // iPhone Lock Screen
    if (mobileScreen === "lock") {
      return (
        <div className="h-screen w-full relative overflow-hidden bg-black">
          {/* Background */}
          {selectedBackground.type === 'video' ? (
            <video key={`mobile-home-${selectedBackground.id}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
              <source src={selectedBackground.url} type="video/mp4" />
            </video>
          ) : (
            <img key={`mobile-home-${selectedBackground.id}`} src={selectedBackground.url} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 pt-2 z-10">
            <span className="text-white text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
              </div>
              <Wifi className="w-4 h-4 text-white" />
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-0.5"
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-white" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/60" />
                )}
              </button>
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>
          
          {/* Lock Screen Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center pt-16">
            {/* Time */}
            {mounted && (
              <div className="text-center mb-2">
                <div className="text-white text-[70px] font-light leading-none tracking-tight">{loginTime}</div>
                <div className="text-white/80 text-lg mt-1">{currentTime.split("  ")[0]}</div>
              </div>
            )}

            {/* Messages Notification */}
            <div className="mt-6 mx-6 w-[calc(100%-48px)] bg-white/20 backdrop-blur-2xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src={MEMOJI_URL} alt="Charity" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Messages</p>
                  <p className="text-white/70 text-xs">{mobileConversations.find(c => c.id === 'welcome')?.messages?.slice(-1)[0]?.text || 'Welcome to my portfolio on my iPhone!'}</p>
                </div>
              </div>
            </div>
            
            {/* Enter Button */}
            <button
              onClick={() => setMobileScreen("home")}
              onTouchEnd={(e) => { e.preventDefault(); setMobileScreen("home"); }}
              className="mt-6 px-14 py-3.5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white font-semibold text-lg active:bg-white/30 transition-colors cursor-pointer touch-manipulation"
            >
              Enter
            </button>
          </div>

          {/* Bottom Controls - Flashlight and Camera at very bottom */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 px-10 flex flex-col items-center z-20">
            {/* Flashlight and Camera */}
            <div className="w-full flex justify-between mb-4">
              <button 
                onClick={toggleFlashlight}
                className={`w-12 h-12 backdrop-blur-xl rounded-full flex items-center justify-center transition-colors ${flashlightOn ? 'bg-yellow-400' : 'bg-white/20'}`}
              >
                <Flashlight className={`w-6 h-6 ${flashlightOn ? 'text-black' : 'text-white'}`} />
              </button>
              <button 
                onClick={() => { startCamera('environment'); setMobileScreen('camera'); }}
                className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center active:bg-white/30 transition-colors"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Home Indicator */}
            <div className="w-36 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      )
    }

    // Mobile Home - Desktop-Style Portfolio Layout
    if (mobileScreen === "home") {
      return (
        <div className="h-[100dvh] w-full relative overflow-hidden bg-[#1e1e1e]">
          {/* Background */}
          {selectedBackground.type === 'video' ? (
            <video key={`mobile-lock-${selectedBackground.id}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
              <source src={selectedBackground.url} type="video/mp4" />
            </video>
          ) : (
            <img key={`mobile-lock-${selectedBackground.id}`} src={selectedBackground.url} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          )}

          {/* Status Bar - iOS style */}
          <div className="absolute top-0 left-0 right-0 h-[50px] flex items-center justify-between px-6 pt-3 z-20">
            <span className="text-white text-[15px] font-semibold">{loginTime}</span>
            <div className="flex items-center gap-1">
              {/* Signal dots */}
              <div className="flex gap-[3px] mr-1">
                <div className="w-[5px] h-[5px] rounded-full bg-white" />
                <div className="w-[5px] h-[5px] rounded-full bg-white" />
                <div className="w-[5px] h-[5px] rounded-full bg-white/30" />
                <div className="w-[5px] h-[5px] rounded-full bg-white/30" />
              </div>
              <Wifi className="w-[18px] h-[18px] text-white" />
              {/* Music Toggle */}
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-0.5 ml-1"
              >
                {audioEnabled ? (
                  <Volume2 className="w-[18px] h-[18px] text-white" />
                ) : (
                  <VolumeX className="w-[18px] h-[18px] text-white/60" />
                )}
              </button>
              {/* iOS Battery */}
              <div className="flex items-center ml-1">
                <div className="relative flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="relative z-10 h-full pt-14 pb-4 overflow-y-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Profile Card */}
            <div className="mx-4 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-4">
                <img src={MEMOJI_URL} alt="Charity" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900">Charity Dupont</h1>
                  <p className="text-gray-500 text-sm">UX/UI Designer</p>
                  <button
                    onClick={() => setMobileScreen('about')}
                    className="mt-2 px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full"
                  >
                    View About Me
                  </button>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="mx-4 mt-4 bg-gradient-to-br from-[#4a90d9] to-[#2c5aa0] rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-medium">Plainfield, NJ</p>
                  <p className="text-white text-4xl font-light mt-1">46°</p>
                  <p className="text-white/70 text-xs mt-1">Warmer tomorrow, high of 72°</p>
                </div>
                <div className="text-6xl">&#9925;</div>
              </div>
            </div>

            {/* Case Studies Section */}
            <div className="mx-4 mt-6">
              <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Case Studies
              </h2>
              <div className="space-y-3">
                {/* Teammate */}
                <button
                  onClick={() => { setMobileCaseStudy('teammate'); setMobileScreen('caseStudy'); }}
                  className="w-full bg-white/95 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <img src={TEAMMATE_ICON} alt="Teammate" className="w-16 h-16 rounded-xl object-cover shadow" />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">Teammate</h3>
                    <p className="text-gray-500 text-sm">Sports Dating App</p>
                    <p className="text-gray-400 text-xs mt-1">Tap to view case study</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Meetly */}
                <button
                  onClick={() => { setMobileCaseStudy('meetly'); setMobileScreen('caseStudy'); }}
                  className="w-full bg-white/95 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <img src={MEETLY_ICON} alt="Meetly" className="w-16 h-16 rounded-xl object-cover shadow" />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">Meetly</h3>
                    <p className="text-gray-500 text-sm">Social Coordination App</p>
                    <p className="text-gray-400 text-xs mt-1">Tap to view case study</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Silas */}
                <button
                  onClick={() => { setMobileCaseStudy('silas'); setMobileScreen('caseStudy'); }}
                  className="w-full bg-white/95 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <img src={SILAS_ICON} alt="Silas" className="w-16 h-16 rounded-xl object-cover shadow" />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900">Silas</h3>
                    <p className="text-gray-500 text-sm">AI Companion</p>
                    <p className="text-gray-400 text-xs mt-1">Tap to view case study</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Quick Access - Icons Only */}
            <div className="mx-4 mt-6 mb-6">
              <h2 className="text-white text-lg font-semibold mb-3">Quick Access</h2>
              <div className="grid grid-cols-4 gap-3">
                {/* Photos */}
                <button
                  onClick={() => { setViewingPhoto(null); setMobileScreen('photos'); }}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-lg">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ios-photos-lYj3iJkf2hHIHOqn861p1PylGIHn6R.jpg" alt="Photos" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] mt-1">Photos</span>
                </button>

                {/* Messages */}
                <button
                  onClick={() => { setShowConversationList(true); setMobileScreen('messages'); }}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-lg">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMessage_logo.svg-FX2uXRLcx7RuPBmMqC6YlrYIocaLrP.png" alt="Messages" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] mt-1">Messages</span>
                </button>

{/* Notes */}
                <button
                  onClick={() => { setSelectedNote(null); setMobileScreen('notes'); }}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-lg">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apple_Notes_icon.svg-wp0HYRwzBWI8Kg13EG3ANIGRAlPpCw.png" alt="Notes" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] mt-1">Notes</span>
                </button>

{/* Safari */}
                <button
                  onClick={() => setMobileScreen('safari')}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-lg">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/safari%20%281%29-D1fS27zxTsdY4INuguhXiCEjxpJAE7.svg" alt="Safari" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] mt-1">Safari</span>
                </button>
                
                {/* Camera */}
                <button
                  onClick={() => { startCamera('environment'); setMobileScreen('camera'); }}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-lg">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-camera-3zNwoLocIEN3BwDjJbHlzgATFtqmNb.svg" alt="Camera" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] mt-1">Camera</span>
                </button>

                {/* About */}
                <button
                  onClick={() => setMobileScreen('about')}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <img src={MEMOJI_URL} alt="About" className="w-[60px] h-[60px] rounded-[14px] shadow-lg object-cover" />
                  <span className="text-white text-[11px] mt-1">About</span>
                </button>
                
                {/* Tic-Tac-Toe */}
                <button
                  onClick={() => setMobileScreen('tictactoe')}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[60px] h-[60px] rounded-[14px] shadow-lg shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    <style>{`
                      @keyframes mTttMove1 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(24px, 0); } 66% { transform: translate(24px, 24px); } }
                      @keyframes mTttMove2 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(-24px, 24px); } 66% { transform: translate(0, 24px); } }
                      @keyframes mTttMove3 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(0, -24px); } 66% { transform: translate(-24px, -24px); } }
                      @keyframes mTttMove4 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(24px, -24px); } 66% { transform: translate(24px, 0); } }
                      @keyframes mTttGlow { 0%, 100% { filter: drop-shadow(0 0 2px #f472b6); } 50% { filter: drop-shadow(0 0 6px #ec4899); } }
                      .m-ttt-piece1 { animation: mTttMove1 4s infinite ease-in-out, mTttGlow 2s infinite; }
                      .m-ttt-piece2 { animation: mTttMove2 4s infinite ease-in-out 0.5s, mTttGlow 2s infinite 0.5s; }
                      .m-ttt-piece3 { animation: mTttMove3 4s infinite ease-in-out 1s, mTttGlow 2s infinite 1s; }
                      .m-ttt-piece4 { animation: mTttMove4 4s infinite ease-in-out 1.5s, mTttGlow 2s infinite 1.5s; }
                    `}</style>
                    <rect width="100" height="100" rx="20" fill="#831843"/>
                    <g>
                      <line x1="38" y1="20" x2="38" y2="80" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="62" y1="20" x2="62" y2="80" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="20" y1="38" x2="80" y2="38" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="20" y1="62" x2="80" y2="62" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                    </g>
                    <g className="m-ttt-piece1" stroke="#f472b6" strokeWidth="3" strokeLinecap="round">
                      <line x1="24" y1="24" x2="32" y2="32"/>
                      <line x1="32" y1="24" x2="24" y2="32"/>
                    </g>
                    <circle className="m-ttt-piece2" cx="50" cy="28" r="5" fill="none" stroke="#fb7185" strokeWidth="3"/>
                    <g className="m-ttt-piece3" stroke="#f472b6" strokeWidth="3" strokeLinecap="round">
                      <line x1="68" y1="68" x2="76" y2="76"/>
                      <line x1="76" y1="68" x2="68" y2="76"/>
                    </g>
                    <circle className="m-ttt-piece4" cx="28" cy="50" r="5" fill="none" stroke="#fb7185" strokeWidth="3"/>
                  </svg>
                  <span className="text-white text-[11px] mt-1">Tic-Tac-Toe</span>
                </button>
                
                {/* Brain Games */}
                <button
                  onClick={() => setMobileScreen('braingames')}
                  className="flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
                >
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[60px] h-[60px] rounded-[14px] shadow-lg shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                    <style>{`
                      @keyframes mobileGoldPulse { 0%, 100% { stroke: #FFD700; filter: drop-shadow(0 0 2px #FFD700) drop-shadow(0 0 8px #B8860B); } 50% { stroke: #FFFACD; filter: drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 15px #FFD700); } }
                      @keyframes mobileGoldDots { 0%, 100% { fill: #FFD700; opacity: 1; } 50% { fill: #FFFACD; opacity: 0.7; } }
                      @keyframes mobileDiceFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(10deg); } }
                      .mobile-dice-3d { animation: mobileDiceFloat 4s ease-in-out infinite; transform-origin: center; }
                      .mobile-neon-gold { animation: mobileGoldPulse 2s infinite ease-in-out; }
                      .mobile-gold-dots { animation: mobileGoldDots 2s infinite ease-in-out; }
                    `}</style>
                    <rect width="100" height="100" rx="20" fill="#1a1a2e"/>
                    <g className="mobile-dice-3d">
                      <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="#000" className="mobile-neon-gold" strokeWidth="2"/>
                      <path d="M20 35 L50 50 V80 L20 65 Z" fill="#000" className="mobile-neon-gold" strokeWidth="2"/>
                      <path d="M80 35 L50 50 V80 L80 65 Z" fill="#000" className="mobile-neon-gold" strokeWidth="2"/>
                      <g className="mobile-gold-dots">
                        <circle cx="50" cy="35" r="4"/>
                        <circle cx="32" cy="48" r="3"/>
                        <circle cx="42" cy="65" r="3"/>
                        <circle cx="62" cy="48" r="3"/>
                        <circle cx="68" cy="58" r="3"/>
                        <circle cx="74" cy="68" r="3"/>
                      </g>
                    </g>
                  </svg>
                  <span className="text-white text-[11px] mt-1">Brain</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )
    }

    // iPhone iMessage Screen - Authentic iOS Messages
    if (mobileScreen === "messages") {
      const contact = mobileConversations.find(c => c.id === selectedContact) || mobileConversations[0]

      // Conversation List View
      if (showConversationList) {
        return (
          <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            {/* Status Bar */}
            <div className="h-[50px] flex items-center justify-between px-6 pt-3 bg-[#000]">
              <span className="text-white text-[15px] font-semibold">{loginTime}</span>
              <div className="flex items-center gap-1">
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="bg-black px-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setMobileScreen('home')} className="text-[#0a84ff] text-[17px]">
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <h1 className="text-white text-[17px] font-semibold">Messages</h1>
                <button className="text-[#0a84ff]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>
              {/* Search Bar */}
              <div className="bg-[#1c1c1e] rounded-xl px-4 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-white/40" />
                <input type="text" placeholder="Search" className="flex-1 bg-transparent text-white text-[15px] placeholder-white/40 outline-none" />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {mobileConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { 
                    setSelectedContact(c.id); 
                    setShowConversationList(false);
                    // Mark as read
                    setMobileConversations(prev => prev.map(conv => 
                      conv.id === c.id ? { ...conv, unread: false } : conv
                    ));
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 active:bg-[#1c1c1e]"
                >
                  {/* Unread indicator */}
                  {c.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] flex-shrink-0 absolute left-2" />
                  )}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">{c.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left border-b border-white/10 pb-3">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-white text-[17px] font-medium truncate">{c.name}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-white/40 text-[15px]">{c.time}</span>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </div>
                    </div>
                    <p className="text-white/50 text-[15px] truncate mt-0.5 pr-2">{c.messages[c.messages.length - 1]?.text || c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Home Indicator */}
            <div className="bg-black py-2 flex-shrink-0">
              <div className="mx-auto w-36 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        )
      }

      // Conversation View - Use interactive chat for Charity, static for others
      if (contact.id === 'welcome') {
        return (
          <div className="h-screen w-full bg-black flex flex-col">
            {/* Status Bar */}
            <div className="h-12 flex items-center justify-between px-6 pt-2 bg-[#000]">
              <span className="text-white text-sm font-medium">{loginTime}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="bg-black/90 backdrop-blur-xl px-4 py-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <button onClick={() => setShowConversationList(true)} className="text-[#0a84ff] flex items-center gap-1">
                  <ChevronLeft className="w-6 h-6" />
                  <span className="text-[17px]">Back</span>
                </button>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={MEMOJI_URL} alt="Charity" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] font-medium mt-0.5">Charity</span>
                </div>
                <button className="text-[#0a84ff]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Interactive Messages with Charity */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className="relative"
                    style={{ maxWidth: '75%' }}
                    onDoubleClick={() => msg.role === 'assistant' && setShowMobileReactions(showMobileReactions === msg.id ? null : msg.id)}
                  >
                    {/* Reaction display - iOS style */}
                    {msg.reaction && (
                      <div className={`absolute -top-3 z-50 ${msg.role === 'user' ? '-left-3' : '-right-3'}`}>
                        <div className="relative">
                          <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-[14px]">{msg.reaction}</span>
                          </div>
                          <div className={`absolute bottom-0 ${msg.role === 'user' ? '-left-1.5' : '-right-1.5'} w-2 h-2 bg-white border border-gray-200 rounded-full shadow-sm`} />
                        </div>
                      </div>
                    )}
                    
                    {/* Reaction picker */}
                    {showMobileReactions === msg.id && (
                      <div className="absolute bottom-full mb-2 left-0 bg-white rounded-full shadow-lg border border-black/10 px-2 py-1.5 flex gap-1 z-50">
                        {MOBILE_REACTIONS.map((reaction) => (
                          <button
                            key={reaction}
                            onClick={() => addMobileReaction(msg.id, reaction)}
                            className="hover:scale-125 transition-transform text-lg px-0.5"
                          >
                            {reaction}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className={`px-4 py-2.5 ${msg.role === 'user'
                        ? 'bg-[#0b84fe] text-white rounded-[20px] rounded-br-[4px]'
                        : 'bg-[#3b3b3d] text-white rounded-[20px] rounded-bl-[4px]'
                      }`}>
                      {msg.text.startsWith('GIF:') ? (
                        <img 
                          src={
                            msg.text === 'GIF:shocked' 
                              ? "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif"
                              : msg.text === 'GIF:disappointed'
                              ? "https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif"
                              : msg.text === 'GIF:sideye'
                              ? "https://media.giphy.com/media/AAsj7jdrHjtp6/giphy.gif"
                              : msg.text === 'GIF:confused'
                              ? "https://media.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.gif"
                              : "https://media.giphy.com/media/QU4ewgcmdcsObx9CG7/giphy.gif"
                          }
                          alt="Reaction"
                          className="w-24 h-auto rounded-lg"
                        />
                      ) : msg.text.startsWith('IMG:') ? (
                        <img 
                          src={msg.text.replace('IMG:', '')}
                          alt="User GIF"
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="text-[17px] leading-snug">
                          {msg.text.includes('BUTTON:') ? (
                            msg.text.split('\n').map((line, idx) => {
                              if (line.startsWith('BUTTON:')) {
                                const parts = line.split(':')
                                const buttonText = parts[2]
                                return (
                                  <button
                                    key={idx}
                                    className="block mt-2 px-3 py-1.5 bg-[#0b84fe] text-white rounded-lg text-sm"
                                  >
                                    {buttonText}
                                  </button>
                                )
                              }
                              return <p key={idx}>{line}</p>
                            })
                          ) : msg.text.startsWith('LINK:') ? (
                            msg.text.split(':').slice(2).join(':').replace(/(click here|check it out here|here if you'd like|view the case study here|You can view the case study here)/gi, '$1')
                          ) : msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {mobileIsTyping && (
                <div className="flex mb-2 justify-start">
                  <div className="max-w-[75%] px-4 py-3 bg-[#3b3b3d] rounded-[20px] rounded-bl-[4px]">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-[bounce_1s_ease-in-out_infinite]" />
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-white/50 animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GIF Picker Slide-up Panel */}
            {showGifPicker && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-2xl z-50 animate-in slide-in-from-bottom duration-300" style={{ height: '55%' }}>
                {/* Handle bar */}
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 bg-white/30 rounded-full" />
                </div>
                
                {/* Search bar */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-2 bg-black/40 rounded-xl px-3 py-2">
                    <Search className="w-4 h-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search GIFs..."
                      value={gifSearch}
                      onChange={(e) => {
                        setGifSearch(e.target.value)
                        if (e.target.value.length > 1) {
                          searchGifs(e.target.value)
                        } else if (e.target.value.length === 0) {
                          setGifResults(TRENDING_GIFS.trending)
                        }
                      }}
                      className="flex-1 bg-transparent text-white text-[15px] placeholder-white/40 outline-none"
                      autoFocus
                    />
                    <button onClick={() => setShowGifPicker(false)} className="text-[#0b84fe] text-[15px] font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
                
                {/* Category pills */}
                <div className="px-3 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {['Trending', 'Birthday', 'Love', 'Funny', 'Happy', 'Sad', 'Dogs', 'Thank You'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setGifSearch(cat.toLowerCase())
                        searchGifs(cat.toLowerCase())
                      }}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap ${
                        gifSearch.toLowerCase() === cat.toLowerCase() 
                          ? 'bg-[#0b84fe] text-white' 
                          : 'bg-black/40 text-white/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {/* GIF grid */}
                <div className="flex-1 overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'none', height: 'calc(100% - 110px)' }}>
                  {gifLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {(gifResults.length > 0 ? gifResults : TRENDING_GIFS.trending).map((gif) => (
                        <button
                          key={gif.id}
                          onClick={() => sendGif(gif, gifSearch)}
                          className="aspect-square rounded-lg overflow-hidden bg-black/20"
                        >
                          <img src={gif.preview || gif.url} alt="GIF" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Input Bar */}
            <form onSubmit={handleMobileChatSubmit} className="bg-black px-3 py-2 pb-8 flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setShowGifPicker(true)
                  setGifResults(TRENDING_GIFS.trending)
                }}
                className="w-8 h-8 bg-[#3b3b3d] rounded-full flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 bg-[#1c1c1e] rounded-full px-4 py-2 border border-white/20 flex items-center">
                <input
                  type="text"
                  placeholder="iMessage"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  className="flex-1 bg-transparent text-white text-[17px] placeholder-white/40 outline-none"
                />
              </div>
              <button type="submit" disabled={!mobileInput.trim() || mobileIsTyping} className="w-8 h-8 bg-[#0b84fe] rounded-full flex items-center justify-center disabled:opacity-50">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </form>
          </div>
        )
      }

      // Other contacts - static messages
      return (
        <div className="h-screen w-full bg-black flex flex-col">
          {/* Status Bar */}
          <div className="h-12 flex items-center justify-between px-6 pt-2 bg-[#000]">
            <span className="text-white text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-black/90 backdrop-blur-xl px-4 py-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <button onClick={() => setShowConversationList(true)} className="text-[#0a84ff] flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-[17px]">Back</span>
              </button>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{contact.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <span className="text-white text-[11px] font-medium mt-0.5">{contact.name.split(' ')[0]}</span>
              </div>
              <button className="text-[#0a84ff]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
            {contact.messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-2 ${msg.from === 'charity' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 ${msg.from === 'charity'
                    ? 'bg-[#0b84fe] text-white rounded-[20px] rounded-br-[4px]'
                    : 'bg-[#3b3b3d] text-white rounded-[20px] rounded-bl-[4px]'
                  }`}>
                  <p className="text-[17px] leading-snug">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-black px-3 py-2 pb-8 flex items-center gap-2">
            <button className="w-8 h-8 bg-[#3b3b3d] rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 bg-[#1c1c1e] rounded-full px-4 py-2 border border-white/20 flex items-center">
              <input
                type="text"
                placeholder="iMessage"
                className="flex-1 bg-transparent text-white text-[17px] placeholder-white/40 outline-none"
              />
            </div>
            <button className="w-8 h-8 bg-[#0b84fe] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )
    }

    // iPhone Case Study View
    if (mobileScreen === "caseStudy" && mobileCaseStudy) {
      const study = caseStudies[mobileCaseStudy as keyof typeof caseStudies]

      return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="h-12 flex items-center justify-between px-6 pt-2 bg-white">
            <span className="text-black text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4 text-black" />
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-black rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-black rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-black rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center">
            <button onClick={() => setMobileScreen('home')} className="text-[#0a84ff] text-sm flex items-center gap-1">
              <ChevronLeft className="w-5 h-5" />
              Home
            </button>
            <h1 className="flex-1 text-center text-black font-semibold">{study.title}</h1>
            <div className="w-16" />
          </div>

          {/* Case Study Content */}
          <div className="flex-1 overflow-y-auto">
            {/* View on Desktop Banner */}
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
              <p className="text-white/80 text-sm font-medium">View on desktop for full case study</p>
            </div>

            {/* Hero with App Icon */}
            <div className={`py-8 bg-gradient-to-br ${study.color} flex flex-col items-center justify-center`}>
              <div className="w-24 h-24 rounded-[22px] overflow-hidden shadow-2xl mb-4 border-2 border-white/20">
                <img src={study.icon} alt={study.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-white">{study.title}</h2>
              <p className="text-white/80 text-sm mt-1">{study.subtitle}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-3">Overview</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{study.overview}</p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                  <p className="text-sm font-semibold text-black mt-1">{study.role}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Timeline</p>
                  <p className="text-sm font-semibold text-black mt-1">{study.timeline}</p>
                </div>
              </div>

              {/* Tools Used */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-black mb-3">Tools & Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {study.tools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-black mb-3">The Challenge</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{study.challenge}</p>

              <h3 className="text-lg font-bold text-black mb-3">The Solution</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{study.solution}</p>

              {/* Screenshot */}
              {(study as any).screenshot && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black mb-3">Design Preview</h3>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    <img src={(study as any).screenshot} alt={`${study.title} Preview`} className="w-full h-auto" />
                  </div>
                </div>
              )}

              {/* Key Outcomes */}
              <h3 className="text-lg font-bold text-black mb-3">Key Outcomes</h3>
              <div className="space-y-3 mb-6">
                {study.results.map((result, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${study.color} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-800 pt-1">{result}</p>
                  </div>
                ))}
              </div>

              {/* Process Highlights */}
              <h3 className="text-lg font-bold text-black mb-3">Process Highlights</h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${study.color} flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">User-Centered Approach</p>
                    <p className="text-xs text-gray-500">Research-driven design decisions</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  This project followed a comprehensive design process including user interviews, competitive analysis, iterative prototyping, and usability testing to ensure the final product meets real user needs.
                </p>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="bg-white py-2">
            <div className="mx-auto w-36 h-1 bg-black/20 rounded-full" />
          </div>
        </div>
      )
    }

    // iPhone Notes App
    if (mobileScreen === "notes") {
      const notesData = [
        {
          id: 1,
          title: "About My Work",
          preview: "I'm a UX/UI designer passionate about creating meaningful digital experiences...",
          date: "Today",
          hasImages: false,
          content: `I'm a UX/UI designer passionate about creating meaningful digital experiences that solve real problems.

My approach combines user research, visual design, and prototyping to deliver solutions that users love.

Key Skills:
• User Research & Testing
• Wireframing & Prototyping
• Visual & Interaction Design
• Design Systems
• Figma & Design Tools

Currently focused on mobile app design and AI-powered experiences.`
        },
        {
          id: 2,
          title: "Case Studies",
          preview: "Teammate - Sports Dating App, Meetly - Group Coordination, Silas - AI Companion",
          date: "Yesterday",
          hasImages: true,
          images: [
            { title: "Teammate", icon: TEAMMATE_ICON, key: "teammate" },
            { title: "Meetly", icon: MEETLY_ICON, key: "meetly" },
            { title: "Silas", icon: SILAS_ICON, key: "silas" }
          ],
          content: `My Featured Projects:

Tap on any project below to view the full case study.`
        },
        {
          id: 3,
          title: "Contact Info",
          preview: "Feel free to reach out for collaborations...",
          date: "Mar 18",
          hasImages: false,
          content: `Let's Connect!

Email: hello@charitydupont.com
LinkedIn: www.linkedin.com/in/charitydupont
Portfolio: charitydupont.com
Location: New York, New York

Open to freelance projects, collaborations, and full-time opportunities in UX/UI design. Let's create something meaningful together!`
        }
      ]

      const activeNote = notesData.find(n => n.id === selectedNote)

      if (selectedNote && activeNote) {
        return (
          <div className="h-screen w-full bg-[#1c1c1e] flex flex-col">
            {/* Status Bar */}
            <div className="h-12 flex items-center justify-between px-6 pt-2">
              <span className="text-white text-sm font-medium">{loginTime}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="px-4 py-2">
              <button onClick={() => setSelectedNote(null)} className="text-[#ffd60a] flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-[17px]">Notes</span>
              </button>
            </div>

            {/* Note Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <h1 className="text-white text-2xl font-bold mb-2">{activeNote.title}</h1>
              <p className="text-white/40 text-sm mb-4">{activeNote.date}</p>
              <div className="text-white/90 text-[17px] leading-relaxed whitespace-pre-line">
                {activeNote.content}
              </div>
              {/* Case Study Images */}
              {(activeNote as any).hasImages && (activeNote as any).images && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {(activeNote as any).images.map((img: { title: string; icon: string; key: string }) => (
                    <button
                      key={img.key}
                      onClick={() => { setMobileCaseStudy(img.key); setMobileScreen('caseStudy'); }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-20 h-20 rounded-[18px] overflow-hidden shadow-lg border border-white/10">
                        <img src={img.icon} alt={img.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white/70 text-xs">{img.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Toolbar */}
            <div className="bg-[#1c1c1e] border-t border-white/10 px-4 py-3 pb-8 flex items-center justify-between">
              <button className="text-[#ffd60a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </button>
              <button className="text-[#ffd60a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
          </div>
        )
      }

      return (
        <div className="h-screen w-full bg-[#000] flex flex-col">
          {/* Status Bar */}
          <div className="h-12 flex items-center justify-between px-6 pt-2">
            <span className="text-white text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
            </div>
          </div>

          {/* Header */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMobileScreen('home')} className="text-[#ffd60a] flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-[17px]">Folders</span>
              </button>
              <button className="text-[#ffd60a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </button>
            </div>
            <h1 className="text-white text-[34px] font-bold mb-4">Notes</h1>
            {/* Search Bar */}
            <div className="bg-[#1c1c1e] rounded-xl px-4 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-white/40" />
              <input type="text" placeholder="Search" className="flex-1 bg-transparent text-white text-[15px] placeholder-white/40 outline-none" />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4 mt-4">
            {notesData.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note.id)}
                className="w-full text-left bg-[#1c1c1e] rounded-xl p-4 mb-3 active:bg-[#2c2c2e]"
              >
                <h3 className="text-white text-[17px] font-semibold">{note.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/50 text-[15px]">{note.date}</span>
                  <span className="text-white/30 text-[15px] truncate">{note.preview}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-black border-t border-white/10 px-4 py-3 pb-8 flex items-center justify-between">
            <span className="text-white/50 text-[13px]">{notesData.length} Notes</span>
            <button className="text-[#ffd60a]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>
        </div>
      )
    }

    // iPhone About Me Screen
    if (mobileScreen === "about") {
      return (
        <div className="h-screen w-full bg-[#f2f2f7] flex flex-col">
          {/* Status Bar */}
          <div className="h-12 flex items-center justify-between px-6 pt-2 bg-[#f2f2f7]">
            <span className="text-black text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[3px] h-[5px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[7px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[9px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[11px] bg-black rounded-[1px]" />
              </div>
              <Wifi className="w-4 h-4 text-black" />
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-black rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-black rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-black rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-[#f2f2f7] px-4 py-2">
            <button onClick={() => setMobileScreen('home')} className="text-[#007aff] flex items-center gap-1 mb-2">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-[17px]">Home</span>
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Header */}
            <div className="bg-white px-4 py-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg">
                <img src={CHARITY_PHOTO_URL} alt="Charity" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-[22px] font-bold text-black">Charity Dupont</h1>
              <p className="text-[15px] text-gray-500 mt-1">Product Designer</p>
            </div>

            {/* Info Cards */}
            <div className="px-4 mt-6">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[13px] text-gray-500">ABOUT</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[15px] text-black leading-relaxed">
                    Passionate UX/UI designer creating meaningful digital experiences. I combine user research, visual design, and prototyping to deliver solutions users love.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden mt-4">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[13px] text-gray-500">SKILLS</p>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {["Figma", "User Research", "Prototyping", "Visual Design", "Design Systems", "Mobile Design"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-[#f2f2f7] rounded-full text-[13px] text-black">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden mt-4">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[13px] text-gray-500">PROJECTS</p>
                </div>
                {['teammate', 'meetly', 'silas'].map((key) => {
                  const study = caseStudies[key as keyof typeof caseStudies]
                  return (
                    <button
                      key={key}
                      onClick={() => { setMobileCaseStudy(key); setMobileScreen('caseStudy'); }}
                      className="w-full px-4 py-3 border-b border-gray-100 flex items-center gap-3 active:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden">
                        <img src={study.icon} alt={study.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[15px] text-black font-medium">{study.title}</p>
                        <p className="text-[13px] text-gray-500">{study.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  )
                })}
              </div>

              <div className="bg-white rounded-xl overflow-hidden mt-4 mb-8">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[13px] text-gray-500">CONTACT</p>
                </div>
                <a href="mailto:hello@charitydupont.com" className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 active:bg-gray-50">
                  <div className="w-8 h-8 bg-[#007aff] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#007aff]">Email</p>
                  <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                </a>
                <button onClick={() => setShowLeavingPopup('https://www.linkedin.com/in/charitydupont')} className="px-4 py-3 flex items-center gap-3 active:bg-gray-50 w-full text-left">
                  <div className="w-8 h-8 bg-[#0077b5] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#007aff]">LinkedIn</p>
                  <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                </button>
              </div>

              {/* Resume Section */}
              <div className="bg-white rounded-xl overflow-hidden mt-4 mb-8">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[13px] text-gray-500">RESUME</p>
                </div>
                <a 
                  href={RESUME_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 active:bg-gray-50 w-full text-left"
                >
                  <div className="w-8 h-8 bg-[#007aff] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#007aff]">View Resume</p>
                  <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                </a>
                <a 
                  href={RESUME_PDF_URL}
                  download="Charity_Dupont_Resume.pdf"
                  className="px-4 py-3 flex items-center gap-3 active:bg-gray-50 w-full text-left"
                >
                  <div className="w-8 h-8 bg-[#34c759] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#007aff]">Download Resume</p>
                  <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                </a>
              </div>
            </div>
          </div>

          

          {/* Home Indicator */}
          <div className="bg-[#f2f2f7] py-2">
            <div className="mx-auto w-36 h-1 bg-black/20 rounded-full" />
          </div>

          {/* Leaving Portfolio Popup */}
          {showLeavingPopup && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaving Portfolio</h3>
                <p className="text-gray-600 mb-6">You are now leaving Charity Dupont&apos;s MacBook portfolio.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeavingPopup(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <a
                    href={showLeavingPopup}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowLeavingPopup(null)}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
                  >
                    Continue
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    // iPhone Photos App
    if (mobileScreen === "photos") {
      // Build combined media array for the entire Photos section
      const allMedia: Array<{type: 'photo' | 'video' | 'captured', src: string, originalIndex: number}> = []
      
      // Add captured photos first
      capturedPhotos.forEach((photo, idx) => {
        allMedia.push({ type: 'captured', src: photo, originalIndex: idx })
      })
      
      // Mix personal photos and videos throughout the grid
      const videoPositions = [0, 2, 5, 8, 11, 14, 17] // 7 positions for 7 videos
      let photoIdx = 0
      let videoIdx = 0
      const totalItems = personalPhotos.length + personalVideos.length
      
      for (let i = 0; i < totalItems; i++) {
        if (videoPositions.includes(i) && videoIdx < personalVideos.length) {
          allMedia.push({ type: 'video', src: personalVideos[videoIdx], originalIndex: videoIdx })
          videoIdx++
        } else if (photoIdx < personalPhotos.length) {
          allMedia.push({ type: 'photo', src: personalPhotos[photoIdx], originalIndex: photoIdx })
          photoIdx++
        }
      }
      
      // Add any remaining videos that weren't placed
      while (videoIdx < personalVideos.length) {
        allMedia.push({ type: 'video', src: personalVideos[videoIdx], originalIndex: videoIdx })
        videoIdx++
      }

      // Media Viewer - unified for photos and videos with swipeable thumbnails
      if (viewingMediaIndex !== null) {
        const currentMedia = allMedia[viewingMediaIndex]
        const isVideo = currentMedia?.type === 'video'
        
        return (
          <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
            {/* Status Bar */}
            <div className="flex-shrink-0 h-12 flex items-center justify-between px-6 pt-2">
              <span className="text-white text-sm font-medium">{loginTime}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between">
              <button onClick={() => setViewingMediaIndex(null)} className="text-[#0a84ff]">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <div className="text-center">
                <p className="text-white text-[15px]">{isVideo ? 'Video' : 'Photo'}</p>
              </div>
              <button className="text-[#0a84ff]">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Main Media View */}
            <div className="flex-1 flex items-center justify-center bg-black overflow-hidden min-h-0">
              {isVideo ? (
                <video
                  key={currentMedia.src}
                  src={currentMedia.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  style={{ colorScheme: 'dark' }}
                />
              ) : (
                <img
                  src={currentMedia.src}
                  alt="Media"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* iOS-style Thumbnail Strip - Swipeable */}
            <div className="flex-shrink-0 bg-black/90 py-3 px-2">
              <div 
                className="flex gap-1.5 overflow-x-auto scrollbar-none px-2" 
                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
              >
                {allMedia.map((media, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    onClick={() => setViewingMediaIndex(idx)}
                    className={`w-12 h-12 flex-shrink-0 rounded-sm overflow-hidden relative transition-all ${
                      idx === viewingMediaIndex 
                        ? 'ring-2 ring-white scale-105' 
                        : 'opacity-60'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <>
                        <video src={media.src} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                        <div className="absolute bottom-0.5 left-0.5">
                          <svg className="w-2.5 h-2.5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <img src={media.src} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* iOS Action Toolbar */}
            <div className="flex-shrink-0 bg-black py-3 px-6 flex items-center justify-between">
              <button className="p-2">
                <Share className="w-6 h-6 text-[#0a84ff]" />
              </button>
              <button className="p-2">
                <Heart className="w-6 h-6 text-[#0a84ff]" />
              </button>
              <button className="p-2">
                <svg className="w-6 h-6 text-[#0a84ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-2">
                <Trash2 className="w-6 h-6 text-[#0a84ff]" />
              </button>
            </div>

            {/* Home Indicator */}
            <div className="flex-shrink-0 bg-black pb-2 pt-1">
              <div className="mx-auto w-36 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        )
      }

      return (
        <div className="h-[100dvh] w-full bg-black flex flex-col relative overflow-hidden">
          {/* Photo Grid - Full screen, extends behind header */}
          <div className="absolute inset-0 overflow-y-auto scrollbar-none pt-[140px] pb-[70px]" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="grid grid-cols-3 gap-[2px]">
              {allMedia.map((item, idx) => {
                if (item.type === 'video') {
                  return (
                    <button
                      key={`media-${idx}`}
                      onClick={() => setViewingMediaIndex(idx)}
                      className="aspect-square overflow-hidden relative bg-black"
                    >
                      <video 
                        src={item.src} 
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      {/* iOS-style video indicator */}
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="text-white text-[11px] font-medium drop-shadow-md">0:30</span>
                      </div>
                    </button>
                  )
                } else {
                  return (
                    <button
                      key={`media-${idx}`}
                      onClick={() => setViewingMediaIndex(idx)}
                      className="aspect-square overflow-hidden relative"
                    >
                      <img src={item.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  )
                }
              })}
            </div>
          </div>

          {/* Floating Header */}
          <div className="absolute top-0 left-0 right-0 z-10">
            {/* Status Bar */}
            <div className="h-12 flex items-center justify-between px-6 pt-2">
              <span className="text-white text-sm font-medium">{loginTime}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[5px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[7px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[9px] bg-white rounded-[1px]" />
                  <div className="w-[3px] h-[11px] bg-white rounded-[1px]" />
                </div>
                <Wifi className="w-4 h-4 text-white" />
                <div className="flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* Library Header */}
            <div className="px-4 pt-1 pb-3 flex items-start justify-between">
              <div>
                <h1 className="text-white text-[34px] font-bold leading-tight">Library</h1>
                <p className="text-white/60 text-[15px]">Apr 23, 2026</p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                {/* Search button */}
                <button className="w-[34px] h-[34px] rounded-full bg-[#0a84ff] flex items-center justify-center">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
                {/* Select button */}
                <button className="px-3 py-1.5 rounded-full bg-white/20 text-white text-[15px] font-medium">
                  Select
                </button>
                {/* Profile with notification */}
                <button onClick={() => setMobileScreen('home')} className="relative">
                  <div className="w-[34px] h-[34px] rounded-full overflow-hidden">
                    <img src={MEMOJI_URL} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">!</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Filter Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3 py-3 px-4">
              {/* Sort button */}
              <button className="w-[44px] h-[44px] rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6m0 0l-3-3m3 3L3 10M21 17h-6m0 0l3 3m-3-3l3-3" />
                </svg>
              </button>
              {/* Filter pills */}
              <div className="flex items-center bg-white/20 rounded-full p-1">
                <button className="px-4 py-2 text-white/70 text-[15px]">Years</button>
                <button className="px-4 py-2 text-white/70 text-[15px]">Months</button>
                <button className="px-4 py-2 bg-white/30 rounded-full text-white text-[15px] font-medium">All</button>
              </div>
              {/* Close button */}
              <button onClick={() => setMobileScreen('home')} className="w-[44px] h-[44px] rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Home Indicator */}
            <div className="pb-2 pt-1">
              <div className="mx-auto w-36 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      )
    }
    
    // iPhone Safari Browser
    if (mobileScreen === "safari") {
      return (
        <div className="h-[100dvh] w-full bg-[#f2f2f7] flex flex-col">
          {/* Status Bar */}
          <div className="h-12 flex items-center justify-between px-6 pt-2 bg-[#f2f2f7]">
            <span className="text-black text-sm font-medium">{loginTime}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-[2px] h-3">
                <div className="w-[3px] h-[5px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[7px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[9px] bg-black rounded-[1px]" />
                <div className="w-[3px] h-[11px] bg-black rounded-[1px]" />
              </div>
              <Wifi className="w-4 h-4 text-black" />
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-black rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-black rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-black rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>
          
          {/* URL Bar */}
          <div className="px-4 py-2 bg-[#f2f2f7]">
            <div className="bg-[#e5e5ea] rounded-xl px-4 py-2.5 flex items-center justify-center">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-500 text-sm">
                {mobileSafariUrl === 'wikipedia' ? 'en.wikipedia.org' : 'Search or enter website name'}
              </span>
            </div>
          </div>
          
          {/* Browser Content */}
          <div className="flex-1 overflow-auto bg-[#f2f2f7]">
            {mobileSafariUrl === 'wikipedia' ? (
              /* Mobile Wikipedia Page about Charity Dupont */
              <div className="w-full min-h-full bg-white">
                {/* Wikipedia Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wikipedia-wordmark-en-25-QgUVUwhHCCccrX81eTmsdUDTQRfIQ6.svg" alt="Wikipedia" className="h-4" />
                </div>
                
                {/* Wikipedia Content */}
                <div className="px-4 py-4">
                  <h1 className="text-2xl font-serif text-black border-b border-gray-300 pb-2 mb-4">Charity Dupont</h1>
                  
                  {/* Infobox - Mobile Style */}
                  <div className="border border-gray-300 bg-gray-50 text-sm mb-4">
                    <div className="bg-gray-200 px-3 py-2 text-center font-semibold text-black">Charity Dupont</div>
                    <div className="p-3">
                      <img 
                        src={CHARITY_PHOTO_URL}
                        alt="Charity Dupont"
                        className="w-full h-48 object-cover mb-2"
                      />
                      <p className="text-[10px] text-gray-500 text-center mb-3">Dupont in 2024</p>
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-1 font-semibold text-gray-700">Occupation</td>
                            <td className="py-1 text-gray-800">UX Designer</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-1 font-semibold text-gray-700">Employer</td>
                            <td className="py-1 text-gray-800">Google</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-1 font-semibold text-gray-700">Education</td>
                            <td className="py-1 text-gray-800">Columbia University</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-semibold text-gray-700">Known for</td>
                            <td className="py-1 text-gray-800">AI UX Design</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-800 leading-relaxed mb-4">
                    <b>Charity Dupont</b> is an American <span className="text-blue-600">UX/UI designer</span> and <span className="text-blue-600">AI experience designer</span> currently working at <span className="text-blue-600">Google</span>.
                  </p>
                  
                  <h2 className="text-lg font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-4">Early life</h2>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4">
                    Dupont began her career during the COVID-19 pandemic and later pursued formal training at Columbia University while working as a teacher.
                  </p>
                  
                  <h2 className="text-lg font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-4">Career</h2>
                  <p className="text-sm text-gray-800 leading-relaxed mb-4">
                    Through a connection at Columbia, Dupont joined Google as a UX designer focusing on AI-driven experiences.
                  </p>
                </div>
              </div>
            ) : (
              /* Safari Start Page - iOS Light Style */
              <div className="w-full h-full bg-[#f2f2f7] overflow-y-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Favorites Section */}
                <div className="pt-6 px-4">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-black text-lg font-bold">Favorites</h2>
                    <span className="text-[#007aff] text-sm">Show More</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Wikipedia */}
                    <button
                      onClick={() => setMobileSafariUrl('wikipedia')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wikipedia_Logo_1.0-wubSVX4dY2rqtnrJ5XcvoYYLBXGILS.png" alt="Wikipedia" className="w-11 h-11 object-contain" />
                      </div>
                      <span className="text-gray-800 text-[11px]">Wikipedia</span>
                    </button>
                    
                    {/* LinkedIn */}
                    <button
                      onClick={() => setShowLeavingPopup('https://linkedin.com/in/charitydupont')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#0077b5] flex items-center justify-center overflow-hidden shadow-sm">
                        <span className="text-white text-2xl font-bold">in</span>
                      </div>
                      <span className="text-gray-800 text-[11px]">LinkedIn</span>
                    </button>
                    
                    {/* Google */}
                    <button
                      onClick={() => setShowLeavingPopup('https://google.com')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <span className="text-2xl font-medium">
                          <span className="text-[#4285f4]">G</span>
                        </span>
                      </div>
                      <span className="text-gray-800 text-[11px]">Google</span>
                    </button>
                    
                    {/* Apple */}
                    <button
                      onClick={() => setShowLeavingPopup('https://apple.com')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                      </div>
                      <span className="text-gray-800 text-[11px]">Apple</span>
                    </button>
                  </div>
                </div>
                
                {/* Frequently Visited */}
                <div className="mt-6 px-4">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-black text-lg font-bold">Frequently Visited</h2>
                    <span className="text-[#007aff] text-sm">Show More</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Wikipedia */}
                    <button
                      onClick={() => setMobileSafariUrl('wikipedia')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wikipedia_Logo_1.0-wubSVX4dY2rqtnrJ5XcvoYYLBXGILS.png" alt="Wikipedia" className="w-11 h-11 object-contain" />
                      </div>
                      <span className="text-gray-800 text-[11px] leading-tight text-center">Charity Dupont</span>
                    </button>
                    
                    {/* Google */}
                    <button
                      onClick={() => setShowLeavingPopup('https://google.com')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <span className="text-gray-800 text-[11px]">Google</span>
                    </button>
                    
                    {/* Images */}
                    <button
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <Camera className="w-6 h-6 text-gray-600" />
                      </div>
                      <span className="text-gray-800 text-[11px]">Images</span>
                    </button>
                    
                    {/* Support */}
                    <button
                      onClick={() => setShowLeavingPopup('https://support.google.com')}
                      className="flex flex-col items-center gap-1.5 active:opacity-70 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <span className="text-gray-800 text-[11px]">Support</span>
                    </button>
                  </div>
                </div>
                
                {/* Siri Suggestions */}
                <div className="mt-6 px-4 pb-8">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-black text-lg font-bold">Siri Suggestions</h2>
                    <span className="text-[#007aff] text-sm">Edit</span>
                  </div>
                  <button
                    onClick={() => setMobileSafariUrl('wikipedia')}
                    className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-start gap-3 active:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={CHARITY_PHOTO_URL} alt="Charity" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-black text-sm font-semibold">Charity Dupont - Wikipedia</p>
                      <p className="text-gray-500 text-xs mt-0.5">wikipedia.org</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                          <MessageCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-gray-500 text-[10px]">From Messages</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Navigation Bar */}
          <div className="bg-[#f2f2f7] border-t border-gray-300 px-4 py-2">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setMobileSafariUrl('')}
                className={`p-2 ${mobileSafariUrl ? 'text-[#007aff]' : 'text-gray-400'}`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400">
                <ChevronRight className="w-6 h-6" />
              </button>
              <button className="p-2 text-[#007aff]">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#007aff]">
                <BookOpen className="w-5 h-5" />
              </button>
              <button className="p-2 text-[#007aff]">
                <Layers className="w-5 h-5" />
              </button>
            </div>
            
{/* Home Button */}
            <button 
              onClick={() => setMobileScreen('home')}
              className="w-full mt-2 py-2 text-center"
            >
              <div className="mx-auto w-36 h-1 bg-black/20 rounded-full" />
            </button>
          </div>

          {/* Leaving Portfolio Popup */}
          {showLeavingPopup && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaving Portfolio</h3>
                <p className="text-gray-600 mb-6">You are now leaving Charity Dupont&apos;s MacBook portfolio.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeavingPopup(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <a
                    href={showLeavingPopup}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowLeavingPopup(null)}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
                  >
                    Continue
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    // iPhone Camera App
    if (mobileScreen === "camera") {
      return (
        <div className="h-[100dvh] w-full bg-black flex flex-col relative overflow-hidden">
          {/* Camera Feed */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={`absolute inset-0 w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
          />
          
          {/* Status Bar */}
          <div className="relative z-10 h-[50px] flex items-center justify-between px-6 pt-3">
            <span className="text-white text-[15px] font-semibold drop-shadow-lg">{loginTime}</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-[3px] mr-1">
                <div className="w-[5px] h-[5px] rounded-full bg-white drop-shadow" />
                <div className="w-[5px] h-[5px] rounded-full bg-white drop-shadow" />
                <div className="w-[5px] h-[5px] rounded-full bg-white/30 drop-shadow" />
                <div className="w-[5px] h-[5px] rounded-full bg-white/30 drop-shadow" />
              </div>
              <Wifi className="w-[18px] h-[18px] text-white drop-shadow" />
              <div className="flex items-center gap-1 ml-1">
                <div className="relative flex items-center">
                  <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden drop-shadow">
                    <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '52%' }} />
                  </div>
                  <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px] drop-shadow" />
                </div>
                <span className="text-white text-[12px] font-medium drop-shadow">52</span>
              </div>
            </div>
          </div>
          
          {/* Top Controls */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${flashlightOn ? 'bg-yellow-400' : 'bg-black/40 backdrop-blur'}`}
            >
              <Flashlight className={`w-5 h-5 ${flashlightOn ? 'text-black' : 'text-white'}`} />
            </button>
            <div className="text-white/80 text-sm font-medium">Photo</div>
            <button 
              onClick={() => { stopCamera(); setMobileScreen('lock'); }}
              className="text-white text-sm font-medium"
            >
              Done
            </button>
          </div>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Bottom Controls */}
          <div className="relative z-10 pb-8 px-8">
            {/* Mode Selector */}
            <div className="flex items-center justify-center gap-6 mb-6 text-white/60 text-sm">
              <span>Video</span>
              <span className="text-yellow-500 font-semibold">Photo</span>
              <span>Portrait</span>
            </div>
            
            {/* Camera Controls */}
            <div className="flex items-center justify-between">
              {/* Last Photo Thumbnail */}
              <button 
                onClick={() => { stopCamera(); setMobileScreen('photos'); }}
                className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30"
              >
                {capturedPhotos.length > 0 ? (
                  <img src={capturedPhotos[0]} alt="Last photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </button>
              
              {/* Shutter Button */}
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-white" />
              </button>
              
              {/* Flip Camera */}
              <button 
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
              >
                <RotateCw className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Home Indicator */}
            <div className="mt-6 mx-auto w-36 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      )
    }

    // Mobile Tic-Tac-Toe Game
    if (mobileScreen === "tictactoe") {
      return (
        <div className="h-screen w-full bg-gradient-to-b from-pink-950 to-black flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-50">
            <div className="text-white text-sm font-medium" suppressHydrationWarning>{currentTime.split("  ")[0]}</div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-white" />
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>

          {/* Header with Back Button */}
          <div className="pt-14 px-4 flex items-center justify-between">
            <button
              onClick={() => setMobileScreen('home')}
              className="p-2 -ml-2 text-pink-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-pink-400 text-xl font-bold">TIC-TAC-TOE</h1>
            <span className="text-pink-400 font-bold text-sm">Wins: {tictactoeScore}</span>
          </div>

          {/* Game Area - Full Screen */}
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <TicTacToeGame onScoreChange={setTictactoeScore} gameState={tictactoeGameState} onGameStateChange={setTictactoeGameState} />
          </div>

          {/* Home Indicator */}
          <div className="pb-2 flex justify-center">
            <div className="w-36 h-1 bg-pink-400/40 rounded-full" />
          </div>
        </div>
      )
    }

    // Mobile Brain Games
    if (mobileScreen === "braingames") {
      return (
        <div className="h-screen w-full bg-gradient-to-b from-pink-950 to-black flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-50">
            <div className="text-white text-sm font-medium" suppressHydrationWarning>{currentTime.split("  ")[0]}</div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-white" />
              <div className="flex items-center">
                <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative overflow-hidden">
                  <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[1.5px] h-[5px] bg-white rounded-r-sm ml-[1px]" />
              </div>
            </div>
          </div>

          {/* Header with Back Button */}
          <div className="pt-14 px-4 flex items-center justify-between">
            <button
              onClick={() => setMobileScreen('home')}
              className="p-2 -ml-2 text-pink-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-pink-400 text-xl font-bold drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">BRAIN GAMES</h1>
            <span className="text-pink-400 font-bold text-sm">Score: {braingamesScore}</span>
          </div>

          {/* Game Area - Full Screen */}
          <div className="flex-1 overflow-auto scrollbar-none">
            <BrainGames onScoreChange={setBraingamesScore} gameState={braingamesGameState} onGameStateChange={setBraingamesGameState} />
          </div>

          {/* Home Indicator */}
          <div className="pb-2 flex justify-center">
            <div className="w-36 h-1 bg-pink-400/40 rounded-full" />
          </div>
        </div>
      )
    }

    }
  // ==================== END MOBILE EXPERIENCE ====================

  // Login Screen (Desktop Only)
  if (screenState === "login") {
    return (
      <div className="h-screen w-full relative overflow-hidden">
        {selectedBackground.type === 'video' ? (
          <video key={`desktop-lock-${selectedBackground.id}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl">
            <source src={selectedBackground.url} type="video/mp4" />
          </video>
        ) : (
          <img key={`desktop-lock-${selectedBackground.id}`} src={selectedBackground.url} alt="Background" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          {/* Status bar - top right like home screen */}
          <div className="absolute top-3 right-4 flex items-center gap-3 text-white/80">
            <Wifi className="w-4 h-4" />
            <div className="flex items-center">
              <div className="w-[25px] h-[12px] border-[1.5px] border-white/80 rounded-[3px] relative overflow-hidden">
                <div className="absolute inset-[1px] bg-white rounded-[1px]" style={{ width: '80%' }} />
              </div>
              <div className="w-[1.5px] h-[5px] bg-white/80 rounded-r-sm ml-[1px]" />
            </div>
          </div>
          {mounted && (
            <div className="absolute top-12 text-center" suppressHydrationWarning>
              <div className="text-white text-7xl font-light tracking-tight" suppressHydrationWarning>{loginTime}</div>
              <div className="text-white/70 text-lg mt-2" suppressHydrationWarning>{currentTime.split("  ")[0]}</div>
            </div>
          )}
          <div className="flex flex-col items-center mt-16">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-xl border-4 border-white/20 shadow-2xl mb-4 animate-memoji-wave">
              <img src={MEMOJI_URL} alt="Charity's Memoji" className="w-full h-full object-cover animate-memoji-wink" />
            </div>
            <h1 className="text-white text-2xl font-medium mt-2 mb-4">Charity{"'"}s Portfolio</h1>
            <form onSubmit={handleLogin} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(e); } }}
                  placeholder="Click the arrow →"
                  className="w-64 h-10 bg-white/20 backdrop-blur-xl rounded-full px-5 pr-10 text-white placeholder-white/50 text-sm border border-white/30 focus:border-white/50 focus:outline-none focus:ring-0 transition-colors"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-white/40 text-xs mt-3">No password needed to access</p>
          </div>
        </div>
      </div>
    )
  }

  // Netflix Loading Screen - DupontFlix
  if (screenState === "netflixLoading") {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="relative">
          {/* DupontFlix logo animation */}
          <h1 className="text-6xl font-bold tracking-tight animate-pulse font-[family-name:var(--font-bebas-neue)]">
            <span className="text-red-600">DUPONT</span>
            <span className="text-white ml-2">FLIX</span>
          </h1>
          {/* Red glow effect */}
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-150" />
        </div>
      </div>
    )
  }

  // Netflix Experience Screen
  if (screenState === "netflix") {
    return (
      <div className="h-screen w-full bg-[#141414] overflow-y-auto scrollbar-none">
        {/* Netflix Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-8">
            {/* DupontFlix Logo */}
            <h1 className="text-2xl font-bold tracking-tight cursor-pointer font-[family-name:var(--font-bebas-neue)]">
              <span className="text-red-600">DUPONT</span>
              <span className="text-white ml-1">FLIX</span>
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-white font-medium text-sm">Home</span>
              <span className="text-gray-400 text-sm hover:text-gray-300 cursor-pointer transition-colors">Case Studies</span>
              <span className="text-gray-400 text-sm hover:text-gray-300 cursor-pointer transition-colors">About Me</span>
              <span className="text-gray-400 text-sm hover:text-gray-300 cursor-pointer transition-colors">Gallery</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <img src={MEMOJI_URL} alt="Profile" className="w-8 h-8 rounded object-cover" />
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#141414] border border-gray-700 text-white min-w-[200px]">
                <DropdownMenuItem 
                  onClick={() => setScreenState("login")}
                  className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Switch to MacBook View
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-gray-400">
                  <User className="w-4 h-4 mr-2" />
                  Manage Profiles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Hero Section - Featured Project */}
        <div className="relative h-[85vh] min-h-[600px]">
          {/* Hero Background */}
          <div className="absolute inset-0">
            <img 
              src={caseStudies.silas.screenshot} 
              alt="Silas" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-500 font-bold text-lg tracking-wider">C</span>
              <span className="text-gray-300 text-sm uppercase tracking-widest">Portfolio</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 max-w-2xl">{caseStudies.silas.title}</h1>
            <p className="text-xl text-gray-200 mb-2">{caseStudies.silas.subtitle}</p>
            <p className="text-gray-400 max-w-xl mb-6 line-clamp-3">{caseStudies.silas.overview}</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setNetflixModal({ type: 'project', data: 'silas' })}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                View Project
              </button>
              <button 
                onClick={() => setNetflixModal({ type: 'project', data: 'silas' })}
                className="flex items-center gap-2 bg-gray-600/70 text-white px-6 py-3 rounded font-semibold hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>

        {/* Content Rows */}
        <div className="relative z-20 -mt-32 pb-20 px-12 space-y-8">
          {/* My Case Studies Row */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">My Case Studies</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {Object.entries(caseStudies).map(([key, study]) => (
                <button
                  key={key}
                  onClick={() => setNetflixModal({ type: 'project', data: key })}
                  className="flex-shrink-0 group relative w-64 aspect-video rounded overflow-hidden hover:scale-105 hover:z-10 transition-transform duration-300"
                >
                  <img src={study.screenshot} alt={study.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-semibold text-sm">{study.title}</p>
                    <p className="text-gray-400 text-xs">{study.subtitle}</p>
                  </div>
                  {/* Netflix-style match percentage */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {key === 'silas' ? '98%' : key === 'teammate' ? '95%' : '92%'} Match
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* About Me Row */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setNetflixModal({ type: 'about' })}
                className="flex-shrink-0 group relative w-80 aspect-[4/3] rounded overflow-hidden hover:scale-105 hover:z-10 transition-transform duration-300"
              >
                <img src={CHARITY_PHOTO_URL} alt="Charity" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-lg">Charity Dupont</p>
                  <p className="text-gray-300 text-sm">UX/UI Designer at Google</p>
                  <p className="text-gray-400 text-xs mt-1">Columbia University &bull; New York</p>
                </div>
              </button>
              {/* Resume Card */}
              <div className="flex-shrink-0 w-64 aspect-[4/3] rounded overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer">
                <div>
                  <FileText className="w-10 h-10 text-red-500 mb-3" />
                  <p className="text-white font-semibold">Resume</p>
                  <p className="text-gray-400 text-sm">View my experience</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF Download
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Row */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">My Gallery</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {personalPhotos.slice(0, 8).map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setNetflixModal({ type: 'gallery', data: idx })}
                  className="flex-shrink-0 w-48 aspect-square rounded overflow-hidden hover:scale-105 hover:z-10 transition-transform duration-300 cursor-pointer"
                >
                  <img src={photo} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Row */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Connect With Me</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLeavingPopup('https://linkedin.com/in/charitydupont')}
                className="flex items-center gap-3 bg-[#0077b5] text-white px-6 py-3 rounded hover:bg-[#006399] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              <a
                href="mailto:charity@example.com"
                className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Message Me
              </a>
            </div>
          </div>
        </div>

        {/* Netflix Footer */}
        <footer className="px-12 py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">Charity Dupont Portfolio &bull; 2024</p>
          <p className="text-gray-600 text-xs mt-2">This is a portfolio experience inspired by Netflix UI. Click the profile icon to switch to MacBook view.</p>
        </footer>

{/* Netflix-style Modal - Full Case Study */}
        {netflixModal.type && (
          <div 
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90"
            onClick={() => setNetflixModal({ type: null })}
          >
            {/* Modal Content */}
            <div 
              className="relative w-full max-w-6xl my-8 mx-4 bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Fixed position */}
              <button
                onClick={() => setNetflixModal({ type: null })}
                className="fixed top-6 right-6 z-[110] w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Project Modal - Netflix Styled Full Case Study */}
              {netflixModal.type === 'project' && netflixModal.data && (
                <div className="bg-[#141414] text-white">
                  {/* Hero Section - Gradient Background, NO screenshot */}
                  <div className={`relative py-16 px-12 ${
                    netflixModal.data === 'silas' ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' :
                    netflixModal.data === 'teammate' ? 'bg-gradient-to-br from-[#2d1f1f] via-[#3d2a2a] to-[#4a3333]' :
                    'bg-gradient-to-br from-[#1f1f2d] via-[#2a2a3d] to-[#33334a]'
                  }`}>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
                      {/* App Preview - Small */}
                      <div className="w-32 flex-shrink-0">
                        <img 
                          src={caseStudies[netflixModal.data as keyof typeof caseStudies]?.screenshot} 
                          alt={caseStudies[netflixModal.data as keyof typeof caseStudies]?.title}
                          className="w-full h-auto rounded-xl shadow-2xl"
                        />
                      </div>
                      
                      {/* Hero Text */}
                      <div className="text-center md:text-left flex-1">
                        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                          <img 
                            src={caseStudies[netflixModal.data as keyof typeof caseStudies]?.icon} 
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <span className="text-red-500 text-xs font-semibold uppercase tracking-wider">Case Study</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">{caseStudies[netflixModal.data as keyof typeof caseStudies]?.title}</h1>
                        <p className="text-xl text-white/80 italic mb-3">
                          &ldquo;{caseStudies[netflixModal.data as keyof typeof caseStudies]?.hero}&rdquo;
                        </p>
                        <p className="text-white/60 mb-4 max-w-xl">{caseStudies[netflixModal.data as keyof typeof caseStudies]?.subtitle}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 justify-center md:justify-start">
                          <span className="text-green-500 font-bold">
                            {netflixModal.data === 'silas' ? '98%' : netflixModal.data === 'teammate' ? '95%' : '92%'} Match
                          </span>
                          <span>{caseStudies[netflixModal.data as keyof typeof caseStudies]?.timeline}</span>
                          <span className="border border-white/30 px-2 py-0.5 text-xs rounded">HD</span>
                          <span>{caseStudies[netflixModal.data as keyof typeof caseStudies]?.role}</span>
                        </div>
                        
                        {/* View Full Case Study Button */}
                        <button
                          onClick={() => {
                            openCaseStudy(netflixModal.data as string)
                            setNetflixModal({ type: null, data: null })
                          }}
                          className="mt-6 bg-white hover:bg-white/90 text-black font-bold px-8 py-3 rounded-md flex items-center gap-2 transition-colors"
                        >
                          <Play className="w-5 h-5 fill-black" />
                          View Full Case Study
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Info Bar */}
                  <div className="bg-[#1a1a1a] border-y border-white/10 py-6 px-12">
                    <div className="max-w-5xl mx-auto grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Role</p>
                        <p className="text-white text-sm">{caseStudies[netflixModal.data as keyof typeof caseStudies]?.role}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Year</p>
                        <p className="text-white text-sm">2024</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Timeline</p>
                        <p className="text-white text-sm">{caseStudies[netflixModal.data as keyof typeof caseStudies]?.timeline}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Type</p>
                        <p className="text-white text-sm">UX Case Study</p>
                      </div>
                    </div>
                  </div>

                  {/* Overview Section */}
                  <div className="px-12 py-16">
                    <div className="max-w-4xl">
                      <h2 className="text-2xl font-bold mb-6 text-white">Overview</h2>
                      <p className="text-lg text-white/80 leading-relaxed">
                        {caseStudies[netflixModal.data as keyof typeof caseStudies]?.overview}
                      </p>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="px-12 py-16 bg-[#1a1a1a]">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                      <div className="bg-[#252525] rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white">The Challenge</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {caseStudies[netflixModal.data as keyof typeof caseStudies]?.challenge}
                        </p>
                      </div>
                      <div className="bg-[#252525] rounded-xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white">The Solution</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {caseStudies[netflixModal.data as keyof typeof caseStudies]?.solution}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Results */}
                  <div className="px-12 py-16">
                    <h2 className="text-2xl font-bold mb-8 text-white">Key Results</h2>
                    <div className="flex flex-wrap gap-4">
                      {caseStudies[netflixModal.data as keyof typeof caseStudies]?.results.map((result, idx) => (
                        <div key={idx} className="bg-red-600/10 border border-red-600/30 rounded-full px-6 py-3 text-white">
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="px-12 py-16 bg-[#1a1a1a]">
                    <h2 className="text-2xl font-bold mb-8 text-white">Tools & Technologies</h2>
                    <div className="flex flex-wrap gap-3">
                      {caseStudies[netflixModal.data as keyof typeof caseStudies]?.tools.map((tool, idx) => (
                        <span key={idx} className="bg-[#333] text-white px-4 py-2 rounded-lg text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Screenshots - Silas */}
                  {netflixModal.data === 'silas' && (
                    <>
                      {/* The Silas Hub */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-2 text-white">The Silas Hub</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          The Control Center where users see everything - money, orders, and schedule - in one simple list. It doesn&apos;t feel like tech; it feels like a calm morning briefing.
                        </p>
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%201-DCyAK5AHlLld0eGIjOCKLL6GQSQLj4.png" alt="Dashboard" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Dashboard</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%204-Pix0MBsuGsLALSeWEW9f9s8ckyw6zK.png" alt="Memory Graph" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Memory Graph</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2049-eWXPE7MhIBYjtU2dTioypBSJ7YLAFu.png" alt="Artifact" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Silas Artifact</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%205-CoLHjTGJIGVxKq0lDGLNL8rsuaj3Kc.png" alt="Profile" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Profile</p>
                          </div>
                        </div>
                      </div>

                      {/* Wardrobe & Weather */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Wardrobe & Weather</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Silas knows what&apos;s in the closet because it read past shopping receipts. It suggests weather-appropriate outfits with backup options.
                        </p>
                        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2044-hjfKPYLluWbP2lMrL8npfvI9wDzWj4.png" alt="Weather" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Weather Insight</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2045-0TAyyhQvFToSEhuW2lis0hG8Wgtf6a.png" alt="Receipt" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Digital Receipt</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2046-COrFKfLbKbBu2awRROrZE1CmhOml8A.png" alt="Outfit" className="w-full max-w-[180px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Outfit Suggestion</p>
                          </div>
                        </div>
                      </div>

                      {/* Time Management */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-2 text-white">Time Management</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Silas understands the physical requirement of traveling. It checks live traffic and offers to book a rideshare at the perfect time.
                        </p>
                        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%206-3BWoc3sGlIiBjCsv7cS7MukzS2JKb5.png" alt="Calendar" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Calendar View</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2057%20%281%29-Cu9zZu25QBG1eFO1YhOVu3lK9vnkSe.png" alt="Rideshare" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Rideshare</p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Intelligence */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Financial Intelligence</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Instead of confusing codes, Silas displays clear digital receipts. Re-order items directly from your statement - a shoppable catalog.
                        </p>
                        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%209-quLGPkO6KNBFyQsxFCNpQSYZPmKIfA.png" alt="Bank" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Dashboard</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2010-rwCKLW3zZDHoKKcPMbFsH6UeG52IUz.png" alt="Transactions" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Transactions</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2011-IC9n1zWbfj5jyU7kUBFHUrKKeVI0Cn.png" alt="Receipt" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Receipt</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2013-nPCwx99f2gEUc7lsbVvU7H0SD1kUK4.png" alt="Cart" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Cart</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2014%20%281%29-OXKYf0kMTuOWJBYdbnXzpy12kiyUiU.png" alt="Checkout" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Checkout</p>
                          </div>
                        </div>
                      </div>

                      {/* Product Intelligence */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-2 text-white">Product Intelligence</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Search your personal internet. A search engine that cuts through the noise and gives clear, confident choices.
                        </p>
                        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2065-ocyRHiATuNmFkhHzo61QPbO8UARepe.png" alt="Search" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Search</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2067-mzMNEdzuINot8FvvxbF5EC7aohTEzQ.png" alt="Results" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Results</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2027-PcN4dIn4xM4ixJizZUBBEwehjepqmK.png" alt="Suggestion" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Suggestion</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2069-l5wXllCRrLE4KeU3EtTeDdwmGDcMwI.png" alt="Info" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Product Info</p>
                          </div>
                        </div>
                      </div>

                      {/* Travel Booking */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Explainable Travel Booking</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Silas knows preferences like aisle seats, frequent flyer numbers, and typical budget. Instead of overwhelming options, it presents the best matches.
                        </p>
                        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2033-P3fqjFVc3EnheB5FOrBsPQztDU8l6G.png" alt="Trips" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Dashboard</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2036-o7eNyjMDJOSPhCHXDwl2B5o4wuscqy.png" alt="Preferences" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">User Profile</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2035-eWU7OhpjguXv14rdS2Ory9fIkMjVdX.png" alt="Seat Analysis" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Seat Analysis</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2034-8M9jhf6mWZmXLQF2tpgiEf4ACmo9y6.png" alt="Flight Insight" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Flight Insight</p>
                          </div>
                        </div>
                      </div>

                      {/* Juno (Contextual Commerce) */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-2 text-white">Juno (Contextual Commerce)</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Silas surfaces a &ldquo;memory&rdquo; from three days ago - a text from Daniel saying, &ldquo;Hunter is out of dog food.&rdquo; Silas isn&apos;t interrupting; it&apos;s enhancing the current shopping session.
                        </p>
                        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2030-Ufk6p1qH3uiJ1KqZJgRhvsrF1zih2i.png" alt="Curated" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Suggestion</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2047%20%281%29-KQ3MkvZW8wwcuw3jJYlSAYBYG4bPRy.png" alt="Context" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Context</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2032-yueRj2B5riZiLHfqrPI13oDescaphw.png" alt="Evidence" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Evidence</p>
                          </div>
                        </div>
                      </div>

                      {/* Silas Books */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Silas Books (Theme-Based Discovery)</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          Silas shows a book not because it&apos;s a bestseller, but because of a specific sentence highlighted weeks ago.
                        </p>
                        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2017-vD7J5N5WQLvcYy6tMmCCAoDvPhgtA5.png" alt="Library" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Dashboard</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2018-rtZzFsJ28O39L8eX3CLDF6Eu1UxUum.png" alt="Why This Book" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Suggestion</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2019-v9hgskr7Du3wKiL9bcYrcYYPoBcd96.png" alt="Excerpt" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Reasoning</p>
                          </div>
                        </div>
                      </div>

                      {/* Lost & Found */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-2 text-white">Lost & Found</h2>
                        <p className="text-white/60 mb-6 max-w-3xl text-sm">
                          A visual retracing tool that utilizes digital breadcrumbs to solve physical-world problems. If you misplace a physical item, Silas creates a chronological &ldquo;map of presence&rdquo;.
                        </p>
                        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2037-KeljTUoA1uAKwrfQGClFbh2qr2dmlF.png" alt="Search" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Search</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2038-doimziRe3RcEQohrjCdlfiDtUsU4hK.png" alt="Item Selected" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Item Selected</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2039-whUo54tXaqQerB5onNBUTWIds6OVap.png" alt="Scanning" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Scanning</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2040-63dYmc1scg8VFvIDMELM1Nd643oDAo.png" alt="Detected" className="w-full max-w-[160px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-wider">Detected</p>
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-6 text-white">Results</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                          <div className="bg-[#252525] rounded-lg p-5">
                            <h3 className="text-purple-400 font-semibold text-sm mb-2">Conceptual Validation</h3>
                            <p className="text-white/50 text-xs">Successfully demonstrates how a connected, proactive system can reduce mental load.</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-5">
                            <h3 className="text-purple-400 font-semibold text-sm mb-2">Context Continuity</h3>
                            <p className="text-white/50 text-xs">Proves we can speed up a user&apos;s day without taking away their ability to make choices.</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-5">
                            <h3 className="text-purple-400 font-semibold text-sm mb-2">Theoretical Impact</h3>
                            <p className="text-white/50 text-xs">Technology should be an invisible, helpful layer that quietly supports everyday life.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Project Screenshots - Teammate */}
                  {netflixModal.data === 'teammate' && (
                    <>
                      {/* The Competition */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-6 text-white">The Competition</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                          <div className="bg-[#1f1f1f] rounded-xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/classic-bumble-logo-editable-and-for-tech-branding-and-creative-design-free-png-GQUpsWRD0QoLNqhIzdRe2J51TYAH7o.webp" alt="Bumble" className="w-8 h-8 rounded-lg object-cover" />
                              <h3 className="font-semibold text-yellow-500">Bumble</h3>
                            </div>
                            <p className="text-green-400 text-xs mb-1">Pros: Inclusive, user-friendly</p>
                            <p className="text-red-400 text-xs">Cons: High competition, fatigue</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tinder-app-logo-tinder-app-logo-transparent-tinder-app-icon-transparent-free-free-png-PDRTDpNBdjoBo1j4DFXEHy6P36zP0Y.webp" alt="Tinder" className="w-8 h-8 rounded-lg object-cover" />
                              <h3 className="font-semibold text-red-500">Tinder</h3>
                            </div>
                            <p className="text-green-400 text-xs mb-1">Pros: Global reach, simple UI</p>
                            <p className="text-red-400 text-xs">Cons: Casual dating reputation</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-xl p-5 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hinge-white-logo-icon-clean-with-transparent-background-for-ui-use-free-png-x8G86pfW3DS0MPdgJKfUAix4t3nz4e.webp" alt="Hinge" className="w-8 h-8 rounded-lg object-contain bg-white p-1" />
                              <h3 className="font-semibold text-white">Hinge</h3>
                            </div>
                            <p className="text-green-400 text-xs mb-1">Pros: Quality over quantity</p>
                            <p className="text-red-400 text-xs">Cons: Slower matching</p>
                          </div>
                        </div>
                      </div>

                      {/* User Persona */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-6 text-white">User Persona</h2>
                        <p className="text-white/70 italic text-center mb-8">&ldquo;Dating would be so much better if I could find someone who shares my love for sports.&rdquo;</p>
                        <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl mx-auto">
                          <div className="flex-shrink-0 text-center">
                            <div className="w-40 h-48 rounded-lg overflow-hidden mx-auto mb-3">
                              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5596c2979c96a2539e3168b8a3ac2bdfc26c3f84-mA8gGyFSaJVUWN1jUAVKb37z4yDtHr.png" alt="Hunter" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Hunter Fielding</h3>
                            <p className="text-white/50 text-xs">36 / Duke Marketing Director</p>
                          </div>
                          <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <div className="bg-[#252525] rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-green-400 mb-2">Goals & Needs</h4>
                              <ul className="text-white/60 text-xs space-y-1">
                                <li>Connect with sports enthusiasts</li>
                                <li>Attend games with a partner</li>
                                <li>Find fellow Duke fans</li>
                              </ul>
                            </div>
                            <div className="bg-[#252525] rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-red-400 mb-2">Pain Points</h4>
                              <ul className="text-white/60 text-xs space-y-1">
                                <li>Hard to find sports fans on apps</li>
                                <li>Limited time due to work</li>
                                <li>Dates don&apos;t align with interests</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Research */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-6 text-white">User Research</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                          <div className="bg-[#2a1f1f] rounded-lg p-5 border border-[#D85A5A]/30">
                            <h3 className="text-[#D85A5A] font-semibold text-sm mb-2">The Character Proxy</h3>
                            <p className="text-white/60 text-xs">Users seek partners with a sports background because they associate it with positive qualities like &ldquo;teamwork and determination.&rdquo;</p>
                          </div>
                          <div className="bg-[#2a2a1f] rounded-lg p-5 border border-orange-500/30">
                            <h3 className="text-orange-400 font-semibold text-sm mb-2">The &ldquo;Newbie&rdquo; Opportunity</h3>
                            <p className="text-white/60 text-xs">Users are &ldquo;open to trying new sports,&rdquo; especially if guided by an enthusiastic partner.</p>
                          </div>
                          <div className="bg-[#1f2a1f] rounded-lg p-5 border border-green-500/30">
                            <h3 className="text-green-400 font-semibold text-sm mb-2">Safety & Depth</h3>
                            <p className="text-white/60 text-xs">Users find current dating apps &ldquo;lacking in depth and safety.&rdquo; We focused on secure public venues like sports events.</p>
                          </div>
                        </div>
                      </div>

                      {/* Final Solution - All 9 Screens */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Final Solution</h2>
                        <p className="text-white/60 mb-6 text-sm">
                          High-fidelity screens showcasing the complete Teammate experience.
                        </p>
                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-CrKpENIJ1QkNGw5Ph7xHp3T8f3pYSc.png" alt="Splash" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Splash</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2012-icLvnxmHlb92OGRKo9D0O1WHZdvArb.png" alt="Home" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Home</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2021-RrPHoCUYlabu00xhzKPVEwBgjLsBSR.png" alt="Matches" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Matches</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2022-qH8EpKsSi9iyAmMV7ok2Rv6nsbllzI.png" alt="Matched" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Matched</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2015-rFXMnhU5fddwskSbSnrkNYmoUM0o3O.png" alt="Messages" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Messages</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2027-F0qbCMbalUtdrcyRX4qUp5FDVEmk3a.png" alt="Chat" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Chat</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2023-qoDUhBfWLpQ7CPJGik2sl9WOvsmhr0.png" alt="Schedule" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Schedule</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2024-tHJPUnwvCOwQMV11nvzXN6J61JF2eH.png" alt="Purchase" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Purchase</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2026-XPpU77QCL4TMfc1SYvQdSGJNuSfdNP.png" alt="Confirmation" className="w-full max-w-[150px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">Confirmation</p>
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-6 text-white">Key Features</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                          <div className="bg-[#252525] rounded-lg p-5">
                            <div className="w-10 h-10 rounded-full bg-pink-600/20 flex items-center justify-center mb-3">
                              <Heart className="w-5 h-5 text-pink-500" />
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Character-Based Matching</h3>
                            <p className="text-white/50 text-xs">Match based on personality and fandom intensity.</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-5">
                            <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center mb-3">
                              <MapPin className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Safe Public Venues</h3>
                            <p className="text-white/50 text-xs">First dates at sports events - safe, public environments.</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-5">
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold mb-1 text-sm">Auto-Scheduled Dates</h3>
                            <p className="text-white/50 text-xs">Dates around live game events.</p>
                          </div>
                        </div>
                      </div>

                      {/* Future Ideas */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-6 text-white">Future Ideas</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                          <div className="bg-[#D85A5A]/20 border border-[#D85A5A]/40 rounded-lg p-4 text-center">
                            <h3 className="text-[#D85A5A] font-semibold text-sm mb-2">Virtual Viewing</h3>
                            <p className="text-white/50 text-xs">Live stream option to watch games together virtually.</p>
                          </div>
                          <div className="bg-[#D85A5A]/20 border border-[#D85A5A]/40 rounded-lg p-4 text-center">
                            <h3 className="text-[#D85A5A] font-semibold text-sm mb-2">Community</h3>
                            <p className="text-white/50 text-xs">Expanding beyond dating to find platonic friends.</p>
                          </div>
                          <div className="bg-[#D85A5A]/20 border border-[#D85A5A]/40 rounded-lg p-4 text-center">
                            <h3 className="text-[#D85A5A] font-semibold text-sm mb-2">Dynamic UI</h3>
                            <p className="text-white/50 text-xs">Colors change to represent the fanbase being swiped.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Project Screenshots - Meetly */}
                  {netflixModal.data === 'meetly' && (
                    <>
                      {/* Problem Statement */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-4 text-white">Problem Statement</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                          <div className="bg-[#1f1f1f] rounded-lg p-5 border border-white/10">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">The Task</h3>
                            <p className="text-white/60 text-xs">Design a mobile app or responsive website to meet a specific community need.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-5 border border-white/10">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">The Outcome</h3>
                            <p className="text-white/60 text-xs">Develop Meetly, an app to simplify scheduling social hangouts among friends.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-5 border border-white/10">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">The Goal</h3>
                            <p className="text-white/60 text-xs">Combine calendar with social ease of a messaging app.</p>
                          </div>
                        </div>
                      </div>

                      {/* User Persona */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-6 text-white">User Persona & Scenario</h2>
                        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
                          <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">The Busy Professional</h3>
                            <p className="text-white/60 text-xs">Gina Hargreaves, 30-year-old Marketing Director.</p>
                          </div>
                          <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">Pain Points</h3>
                            <p className="text-white/60 text-xs">Coordination fatigue and FOMO due to work commitments.</p>
                          </div>
                          <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-2">Core Need</h3>
                            <p className="text-white/60 text-xs">A hassle-free solution for planning in limited free time.</p>
                          </div>
                        </div>
                        <div className="max-w-2xl mx-auto">
                          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%206-ZhAnbMMomKNYq6IDGqTVXQSpImMfcK.jpg" alt="User Persona" className="w-full rounded-lg" />
                        </div>
                      </div>

                      {/* Research Synthesis */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-6 text-white">Synthesis & Ideation</h2>
                        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
                          <div>
                            <h3 className="text-sm font-semibold text-white/80 mb-3 text-center">User Research</h3>
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ApLgUHySGxYaPLs-5ZFkUdVzlnsmvsq6Vqp0PWKvAcVfQK.png" alt="Research" className="w-full rounded-lg" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white/80 mb-3 text-center">Feature Prioritization</h3>
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4ZAJu3RfxsHn87J-C40JZ9GtirbtlXMkE0VCQ1jcCnpZ3X.png" alt="Prioritization" className="w-full rounded-lg" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-indigo-400 text-xs font-semibold mb-1">Key Insight</h4>
                            <p className="text-white/50 text-xs">Users appreciate connecting via existing social media.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-indigo-400 text-xs font-semibold mb-1">Key Insight</h4>
                            <p className="text-white/50 text-xs">Need easier way to see friend availability.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-indigo-400 text-xs font-semibold mb-1">Key Insight</h4>
                            <p className="text-white/50 text-xs">Privacy filters for sharing calendar without work details.</p>
                          </div>
                        </div>
                      </div>

                      {/* User Journey */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-6 text-white">The User Journey</h2>
                        <p className="text-white/60 text-sm text-center mb-6">From &ldquo;Texting Frustration&rdquo; to &ldquo;Meetly Success&rdquo;</p>
                        <div className="max-w-3xl mx-auto">
                          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8DQzUCALXHxbSfU-iN3Pe3zl6xMPnwCcP9vtIQb2ebcDyr.png" alt="User Journey" className="w-full rounded-lg" />
                        </div>
                      </div>

                      {/* Usability Testing */}
                      <div className="px-12 py-12">
                        <h2 className="text-xl font-bold mb-6 text-white">Usability Testing & Iteration</h2>
                        <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30 max-w-xl mx-auto mb-6">
                          <h3 className="text-indigo-400 font-semibold text-sm mb-2">Test Objective</h3>
                          <p className="text-white/60 text-xs">Assess effectiveness in scheduling a hangout, adding friends, and voting.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-green-400 text-xs font-semibold mb-1">Change 1</h4>
                            <p className="text-white/50 text-xs">Added Direct Invite Creation - click date and create invite.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-green-400 text-xs font-semibold mb-1">Change 2</h4>
                            <p className="text-white/50 text-xs">Adjusted Logic Flow - deadlines before occasion.</p>
                          </div>
                          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/10">
                            <h4 className="text-green-400 text-xs font-semibold mb-1">Change 3</h4>
                            <p className="text-white/50 text-xs">Voting Confirmations for user clarity.</p>
                          </div>
                        </div>
                      </div>

                      {/* Final Solution */}
                      <div className="px-12 py-12 bg-[#1a1a1a]">
                        <h2 className="text-xl font-bold mb-2 text-white">Final Solution</h2>
                        <p className="text-white/60 mb-6 text-sm">The complete Meetly experience from personal calendar to group coordination.</p>
                        
                        {/* Key Features */}
                        <div className="grid md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
                          <div className="bg-[#252525] rounded-lg p-4 text-center">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-1">The Dashboard</h3>
                            <p className="text-white/50 text-xs">Centralized view of hangouts</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-4 text-center">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-1">Voting Screen</h3>
                            <p className="text-white/50 text-xs">Simplified group decisions</p>
                          </div>
                          <div className="bg-[#252525] rounded-lg p-4 text-center">
                            <h3 className="text-indigo-400 font-semibold text-sm mb-1">Contextual Chat</h3>
                            <p className="text-white/50 text-xs">Messaging with calendar</p>
                          </div>
                        </div>
                        
                        {/* App Screens Row 1 */}
                        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto mb-4">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2023-YaC5eUy2iN2JImZekZb30iItst7UyL.png" alt="Home" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Home</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2024-kvBQ0w5m9bcMxJDLYcbuSSVJrEcrPc.png" alt="Chat" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Chat</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2025-Y8hW7TmOJfVaW1Iizh9CJkHWFsIeSd.png" alt="Vote" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Vote</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2026-ytP9uUYl1tfuGMTjpRlMvbw57l8wBx.png" alt="Vote 2" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Vote 2</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2027-Zx75LyunsQWz207iWPdSipbuqvblvQ.png" alt="Vote 3" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Vote 3</p>
                          </div>
                        </div>

                        {/* App Screens Row 2 */}
                        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2028-cLMG7tLrO3aQdiYlfASDZRvCUyqBwb.png" alt="Chat 2" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Chat 2</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2029-APo5XHVqWgkh2mMOv6e2p6mj91YUmK.png" alt="Chat 3" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Chat 3</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2030-7MAPn6ktJNerulMwPugsHcYNOqgrdA.png" alt="Time" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Set Time</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2031-0VLOPEN9C6TZam8ou1yfaXriYe3iON.png" alt="Success" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Success</p>
                          </div>
                          <div className="text-center">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2032-X5DdZgQI5aSWfhkZd9trlhxvPG8ZEU.png" alt="End" className="w-full max-w-[140px] mx-auto rounded-lg" />
                            <p className="text-white/40 text-[8px] mt-1 uppercase tracking-wider">Home End</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="px-12 py-8 border-t border-white/10">
                    <p className="text-white/40 text-sm">Case Study by Charity Dupont</p>
                  </div>
                </div>
              )}

              {/* About Modal - Full Profile */}
              {netflixModal.type === 'about' && (
                <div className="bg-gradient-to-b from-purple-50 to-white">
                  {/* Hero Section */}
                  <div className="relative py-20 px-8">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Profile Photo */}
                        <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0">
                          <img 
                            src={CHARITY_PHOTO_URL}
                            alt="Charity Dupont"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Bio */}
                        <div className="text-center md:text-left">
                          <h1 className="text-5xl font-bold text-black mb-4">Charity Dupont</h1>
                          <p className="text-2xl text-purple-600 font-medium mb-4">UX/UI Designer at Google</p>
                          <p className="text-black/70 leading-relaxed text-lg mb-6">
                            Hey there! I&apos;m Charity, a passionate UX/UI designer currently working at Google. 
                            I specialize in creating intuitive, user-centered digital experiences that bridge the gap 
                            between complex functionality and beautiful design.
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button
                              onClick={() => setShowLeavingPopup('https://linkedin.com/in/charitydupont')}
                              className="flex items-center gap-2 bg-[#0077b5] text-white px-6 py-3 rounded-full hover:bg-[#006399] transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              Connect on LinkedIn
                            </button>
                            <a
                              href="mailto:charity@example.com"
                              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-black/80 transition-colors"
                            >
                              <Mail className="w-5 h-5" />
                              Send Email
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="max-w-4xl mx-auto px-8 py-16">
                    <div className="grid md:grid-cols-4 gap-8 mb-16">
                      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <MapPin className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                        <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Location</h3>
                        <p className="text-black font-medium">New York, NY</p>
                      </div>
                      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <svg className="w-8 h-8 mx-auto mb-3 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Company</h3>
                        <p className="text-black font-medium">Google</p>
                      </div>
                      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <GraduationCap className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                        <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Education</h3>
                        <p className="text-black font-medium">Columbia University</p>
                      </div>
                      <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <Briefcase className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                        <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Experience</h3>
                        <p className="text-black font-medium">5+ Years</p>
                      </div>
                    </div>

                    {/* About Text */}
                    <div className="prose prose-lg max-w-none mb-16">
                      <h2 className="text-2xl font-bold text-black mb-6">About Me</h2>
                      <p className="text-black/70 leading-relaxed mb-4">
                        With a background from Columbia University and years of experience in the tech industry, 
                        I&apos;ve had the privilege of working on products that reach millions of users worldwide. 
                        My approach combines data-driven insights with creative problem-solving to deliver 
                        designs that not only look great but also drive real results.
                      </p>
                      <p className="text-black/70 leading-relaxed">
                        When I&apos;m not designing, you can find me exploring new coffee shops, taking photos, 
                        or experimenting with new creative tools and technologies. I believe that great design 
                        comes from understanding people deeply and translating those insights into experiences 
                        that feel intuitive and delightful.
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-6">Skills & Expertise</h2>
                      <div className="flex flex-wrap gap-3">
                        {['UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Figma', 'User Testing', 'Motion Design', 'Accessibility', 'Information Architecture', 'Wireframing', 'Visual Design', 'Interaction Design'].map((skill, idx) => (
                          <span key={idx} className="text-black text-sm bg-purple-100 border border-purple-200 px-4 py-2 rounded-full font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Modal - Full Screen */}
              {netflixModal.type === 'gallery' && typeof netflixModal.data === 'number' && (
                <div className="bg-black min-h-[80vh] flex flex-col">
                  {/* Main Image */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl">
                      <img 
                        src={personalPhotos[netflixModal.data]}
                        alt={`Gallery ${netflixModal.data + 1}`}
                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                      />
                      {/* Navigation Arrows */}
                      <button
                        onClick={() => setNetflixModal({ type: 'gallery', data: Math.max(0, (netflixModal.data as number) - 1) })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                        disabled={netflixModal.data === 0}
                      >
                        <ChevronLeft className="w-8 h-8 text-white" />
                      </button>
                      <button
                        onClick={() => setNetflixModal({ type: 'gallery', data: Math.min(personalPhotos.length - 1, (netflixModal.data as number) + 1) })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                        disabled={netflixModal.data === personalPhotos.length - 1}
                      >
                        <ChevronRight className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                  {/* Image Counter */}
                  <div className="text-center text-white/60 text-sm py-2">
                    {(netflixModal.data as number) + 1} / {personalPhotos.length}
                  </div>
                  {/* Thumbnail strip */}
                  <div className="flex gap-3 p-4 overflow-x-auto scrollbar-none justify-center bg-black/50">
                    {personalPhotos.slice(0, 8).map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNetflixModal({ type: 'gallery', data: idx })}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                          idx === netflixModal.data ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Loading Screen (Desktop Only)
  if (screenState === "loading") {
    return (
      <div className="h-screen w-full relative overflow-hidden">
        {selectedBackground.type === 'video' ? (
          <video key={`desktop-loading-${selectedBackground.id}`} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl">
            <source src={selectedBackground.url} type="video/mp4" />
          </video>
        ) : (
          <img key={`desktop-loading-${selectedBackground.id}`} src={selectedBackground.url} alt="Background" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-xl border-4 border-white/20 shadow-2xl mb-4">
            <img src={MEMOJI_URL} alt="Charity's Memoji" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-white text-2xl font-medium mt-2 mb-8">Charity{"'"}s Portfolio</h1>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-loading-bar" />
          </div>
          <p className="text-white/50 text-sm mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  // Desktop Screen (Desktop Only)
  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {selectedBackground.type === 'video' ? (
        <video key={selectedBackground.id} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={selectedBackground.url} type="video/mp4" />
        </video>
      ) : (
        <img key={selectedBackground.id} src={selectedBackground.url} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Menu Bar - macOS Style */}
      <div className="absolute top-0 left-0 right-0 h-[25px] bg-black/20 backdrop-blur-xl flex items-center justify-between px-4 text-[13px] text-white z-50">
        <div className="flex items-center gap-5">
          {/* Apple Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:bg-black/10 px-1 py-0.5 rounded transition-colors outline-none">
              <svg className="w-4 h-4 opacity-90" viewBox="0 0 17 21" fill="currentColor">
                <path d="M14.2 10.5c0-2.3 1.9-3.4 2-3.5-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2.1 1 0 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.6 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.7-2.1-2.9zM12.1 3.5c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.3-1.1z" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/90 backdrop-blur-xl border-white/20 text-black min-w-[220px] shadow-2xl text-[13px]">
              <DropdownMenuItem onClick={openAboutWindow} className="cursor-pointer focus:bg-blue-500 focus:text-white">
                About This Mac
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-blue-500 focus:text-white">
                System Settings...
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10" />
              <DropdownMenuItem className="cursor-pointer focus:bg-blue-500 focus:text-white">
                Sleep
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-blue-500 focus:text-white">
                Restart...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-blue-500 focus:text-white">
                <Power className="w-4 h-4 mr-2 opacity-70" />
                Log Out Charity...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="font-semibold">Charity{"'"}s Portfolio</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:bg-black/10 px-2 py-0.5 rounded transition-colors outline-none font-normal">
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/90 backdrop-blur-xl border-white/20 text-black min-w-[200px] shadow-2xl text-[13px]">
              <DropdownMenuItem onClick={openAboutWindow} className="cursor-pointer focus:bg-blue-500 focus:text-white">
                <User className="w-4 h-4 mr-2 opacity-70" />
                About
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10" />
              <DropdownMenuItem onClick={() => setCaseStudiesFolder({ isOpen: true, isMinimized: false })} className="cursor-pointer focus:bg-blue-500 focus:text-white">
                <Folder className="w-4 h-4 mr-2 opacity-70" />
                Case Studies
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:bg-black/10 px-2 py-0.5 rounded transition-colors outline-none font-normal">
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/90 backdrop-blur-xl border-white/20 text-black min-w-[200px] shadow-2xl text-[13px]">
              <DropdownMenuItem
                onClick={() => { setBackgroundsFolder({ isOpen: true, isMinimized: false }); focusWindow('backgrounds'); }}
                className="cursor-pointer focus:bg-blue-500 focus:text-white"
              >
                <ImageIcon className="w-4 h-4 mr-2 opacity-70" />
                Background
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu onOpenChange={(open) => { if (!open) setHelpSearchQuery(''); }}>
            <DropdownMenuTrigger className="flex items-center hover:bg-black/10 px-2 py-0.5 rounded transition-colors outline-none font-normal">
              Help
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/90 backdrop-blur-xl border-white/20 text-black min-w-[300px] shadow-2xl text-[13px] p-2">
              <div className="flex items-center gap-2 bg-white/50 rounded-md px-2 py-1.5 mb-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] outline-none placeholder-gray-400"
                />
              </div>
              {helpSearchQuery.trim() && (
                <div className="max-h-[200px] overflow-y-auto">
                  {(() => {
                    const query = helpSearchQuery.toLowerCase()
                    const results: { label: string; action: () => void; icon: React.ReactNode }[] = []

                    if ('messages'.includes(query) || 'chat'.includes(query) || 'charity'.includes(query)) {
                      results.push({
                        label: 'Messages - Chat with Charity',
                        action: () => { setMessagesWindow({ isOpen: true, isMinimized: false }); setHelpSearchQuery('') },
                        icon: <MessageCircle className="w-4 h-4" />
                      })
                    }
                    if ('teammate'.includes(query) || 'sports'.includes(query) || 'dating'.includes(query)) {
                      results.push({
                        label: 'Teammate - Sports Dating App',
                        action: () => { openCaseStudy('teammate'); setHelpSearchQuery('') },
                        icon: <Folder className="w-4 h-4" />
                      })
                    }
                    if ('meetly'.includes(query) || 'scheduling'.includes(query) || 'meeting'.includes(query)) {
                      results.push({
                        label: 'Meetly - Scheduling Platform',
                        action: () => { openCaseStudy('meetly'); setHelpSearchQuery('') },
                        icon: <Folder className="w-4 h-4" />
                      })
                    }
                    if ('silas'.includes(query) || 'ai'.includes(query) || 'companion'.includes(query)) {
                      results.push({
                        label: 'Silas - AI Companion',
                        action: () => { openCaseStudy('silas'); setHelpSearchQuery('') },
                        icon: <Folder className="w-4 h-4" />
                      })
                    }
                    if ('case study'.includes(query) || 'case studies'.includes(query) || 'projects'.includes(query) || 'portfolio'.includes(query)) {
                      results.push({
                        label: 'Open Case Studies Folder',
                        action: () => { setCaseStudiesFolder({ isOpen: true, isMinimized: false }); setHelpSearchQuery('') },
                        icon: <Folder className="w-4 h-4" />
                      })
                    }
                    if ('about'.includes(query) || 'charity'.includes(query) || 'info'.includes(query)) {
                      results.push({
                        label: 'About Charity',
                        action: () => { openAboutWindow(); setHelpSearchQuery('') },
                        icon: <User className="w-4 h-4" />
                      })
                    }
                    if ('photos'.includes(query) || 'images'.includes(query) || 'pictures'.includes(query) || 'gallery'.includes(query)) {
                      results.push({
                        label: 'Open Photos',
                        action: () => { setPhotosWindow({ isOpen: true, isMinimized: false }); setHelpSearchQuery('') },
                        icon: <ImageIcon className="w-4 h-4" />
                      })
                    }
                    if ('notes'.includes(query) || 'note'.includes(query)) {
                      results.push({
                        label: 'Open Notes',
                        action: () => { setNotesWindow({ isOpen: true, isMinimized: false }); setHelpSearchQuery('') },
                        icon: <FileText className="w-4 h-4" />
                      })
                    }
                    if ('background'.includes(query) || 'wallpaper'.includes(query)) {
                      results.push({
                        label: 'Change Background',
                        action: () => { setHelpSearchQuery(''); setShowBackgroundPicker(true) },
                        icon: <ImageIcon className="w-4 h-4" />
                      })
                    }

                    if (results.length === 0) {
                      return <p className="text-gray-500 text-center py-3 text-[12px]">No results found</p>
                    }

                    return results.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={result.action}
                        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded transition-colors text-left"
                      >
                        <span className="opacity-70">{result.icon}</span>
                        {result.label}
                      </button>
                    ))
                  })()}
                </div>
              )}
              {!helpSearchQuery.trim() && (
                <p className="text-gray-400 text-center py-3 text-[12px]">Type to search for apps, case studies, and more</p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Bluetooth */}
          <svg className="w-4 h-4 opacity-90" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
          </svg>
          {/* Battery - same style as mobile */}
          <div className="flex items-center ml-1">
            <div className="relative flex items-center">
              <div className="w-[25px] h-[12px] border-[1.5px] border-current rounded-[3px] relative overflow-hidden">
                <div className="absolute inset-[1px] bg-current rounded-[1px]" style={{ width: '80%' }} />
              </div>
              <div className="w-[1.5px] h-[5px] bg-current rounded-r-sm ml-[1px]" />
            </div>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="hover:bg-black/10 p-1 rounded transition-colors"
            title={audioEnabled ? "Mute" : "Play Music"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 opacity-90" /> : <VolumeX className="w-4 h-4 opacity-90" />}
          </button>
          <Wifi className="w-4 h-4 opacity-90" />
          <Search className="w-4 h-4 opacity-90" />
          {mounted && <span className="text-[13px] font-medium" suppressHydrationWarning>{currentTime}</span>}
        </div>
      </div>



      {/* Desktop - Clean Simple Layout */}
      <div className="absolute inset-0 top-[25px] bottom-[80px] overflow-hidden p-6 flex gap-5">

        {/* Sunflowers Photo - Left Side */}
        <div
          className="w-72 h-full bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
          onDoubleClick={() => { setPhotosWindow({ isOpen: true, isMinimized: false }); focusWindow('photos'); }}
        >
          <img
            src={personalPhotos[0]}
            alt="Sunflowers at Sunrise"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center Content - Twitter Post and Weather Widget */}
        <div className="flex-1 flex flex-col gap-4 items-start">
          {/* Twitter/X Post */}
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md">
            <div className="flex items-start gap-3">
              <img
                src={personalPhotos[1]}
                alt="Charity"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-black">Charity</span>
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                </div>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  {"A user's journey should feel as natural and uplifting as a field of sunflowers on a summer day! A playground where animation meets curiosity."}
                </p>
                <div className="flex items-center gap-4 mt-3 text-gray-400 text-xs">
                  <span>2:30 PM</span>
                  <span>Twitter for iPhone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-[#4a90d9] to-[#2c5aa0] rounded-2xl p-5 shadow-lg w-72">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Plainfield</p>
                <p className="text-white text-5xl font-light mt-1">46°</p>
                <p className="text-white/70 text-xs mt-2">Partly Cloudy</p>
                <p className="text-white/60 text-xs">H:72° L:33°</p>
              </div>
              <div className="text-5xl mt-2">&#9925;</div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex justify-between text-xs text-white/80">
                <div className="text-center">
                  <p>Wed</p>
                  <p className="text-lg my-1">&#9925;</p>
                  <p>56°</p>
                </div>
                <div className="text-center">
                  <p>Thu</p>
                  <p className="text-lg my-1">&#9728;</p>
                  <p>72°</p>
                </div>
                <div className="text-center">
                  <p>Fri</p>
                  <p className="text-lg my-1">&#9925;</p>
                  <p>65°</p>
                </div>
                <div className="text-center">
                  <p>Sat</p>
                  <p className="text-lg my-1">&#9728;</p>
                  <p>42°</p>
                </div>
                <div className="text-center">
                  <p>Sun</p>
                  <p className="text-lg my-1">&#9925;</p>
                  <p>53°</p>
                </div>
              </div>
            </div>
          </div>
          
          </div>

        {/* macOS Photos App Window */}
        {photosWindow.isOpen && !photosWindow.isMinimized && (
          <div
            className={`absolute w-[750px] h-[520px] bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-white/10 ${focusedWindow === 'photos' ? 'z-40' : 'z-20'} ${photosWindow.isMinimizing ? 'animate-minimize' : ''}`}
            onClick={() => focusWindow('photos')}
            style={{ left: photosPosition.x, top: photosPosition.y, transformOrigin: 'bottom center' }}
          >
            {/* Photos App Title Bar - Draggable */}
            <div
              onMouseDown={(e) => { focusWindow('photos'); handleMouseDown('photos', e); }}
              className="h-[52px] bg-[#2d2d2d] flex items-center px-4 border-b border-white/10 cursor-grab active:cursor-grabbing">
              <div className="flex gap-2">
                <button
                  onClick={() => setPhotosWindow({ isOpen: false, isMinimized: false })}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                />
                <button
                  onClick={() => minimizeWindow('photos', setPhotosWindow)}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                />
                <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors" />
              </div>
              <span className="flex-1 text-center text-sm font-medium text-white/80">Photos</span>
            </div>

            <div className="flex h-[calc(100%-52px)]">
              {/* Sidebar */}
              <div className="w-[180px] bg-[#252525] border-r border-white/10 p-3">
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Library</p>
                <button className="w-full text-left px-3 py-1.5 rounded-md bg-white/10 text-white text-sm mb-1">
                  All Photos
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-md text-white/60 hover:bg-white/5 text-sm mb-1">
                  Favorites
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-md text-white/60 hover:bg-white/5 text-sm mb-3">
                  Recents
                </button>
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Albums</p>
                <button className="w-full text-left px-3 py-1.5 rounded-md text-white/60 hover:bg-white/5 text-sm">
                  Portfolio
                </button>
              </div>

              {/* Photo Grid / Detail View */}
              <div className="flex-1 overflow-hidden">
                {selectedPhotoIndex === null ? (
                  <>
                    {/* Grid Header */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <h2 className="text-white text-lg font-semibold">All Photos</h2>
                      <p className="text-white/50 text-xs">{desktopMedia.length} items</p>
                    </div>
                    {/* Photo Grid */}
                    <div className="p-4 overflow-y-auto h-[calc(100%-60px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <div className="grid grid-cols-4 gap-2">
                        {desktopMedia.map((media, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPhotoIndex(idx)}
                            className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all relative"
                          >
                            {media.type === 'video' ? (
                              <>
                                <video src={media.url} className="w-full h-full object-cover" muted />
                                <div className="absolute bottom-1 left-1">
                                  <svg className="w-3.5 h-3.5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </>
                            ) : (
                              <img src={media.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Detail View Header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center">
                      <button
                        onClick={() => setSelectedPhotoIndex(null)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        All Photos
                      </button>
                      <span className="flex-1 text-center text-white/60 text-sm">{selectedPhotoIndex + 1} of {desktopMedia.length}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPhotoIndex((prev) => prev !== null ? (prev - 1 + desktopMedia.length) % desktopMedia.length : 0)}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          <ChevronLeft className="w-5 h-5 text-white/60" />
                        </button>
                        <button
                          onClick={() => setSelectedPhotoIndex((prev) => prev !== null ? (prev + 1) % desktopMedia.length : 0)}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        </button>
                      </div>
                    </div>
                    {/* Photo/Video Detail */}
                    <div className="flex-1 flex items-center justify-center p-4 h-[calc(100%-52px)]">
                      {desktopMedia[selectedPhotoIndex].type === 'video' ? (
                        <video
                          src={desktopMedia[selectedPhotoIndex].url}
                          controls
                          autoPlay
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : (
                        <img
                          src={desktopMedia[selectedPhotoIndex].url}
                          alt=""
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tic-Tac-Toe Game Window */}
        {tictactoeWindow.isOpen && !tictactoeWindow.isMinimized && (
          <div
            className={`absolute ${focusedWindow === 'tictactoe' ? 'z-40' : 'z-20'}`}
            onClick={() => focusWindow('tictactoe')}
            style={{ left: tictactoePosition.x, top: tictactoePosition.y }}
          >
            <div className="bg-gradient-to-b from-pink-950 to-black rounded-xl shadow-2xl overflow-hidden border border-pink-500/30">
              {/* Title Bar */}
              <div
                onMouseDown={(e) => { focusWindow('tictactoe'); handleMouseDown('tictactoe', e); }}
                className="h-[52px] bg-gradient-to-b from-pink-900/50 to-pink-950 flex items-center px-4 gap-4 border-b border-pink-500/20 cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setTictactoeWindow({ isOpen: false, isMinimized: false })}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                  />
                  <button
                    onClick={() => setTictactoeWindow({ ...tictactoeWindow, isMinimized: true })}
                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors" />
                </div>
                <span className="flex-1 text-center text-sm font-bold text-pink-400">TIC-TAC-TOE</span>
                <span className="text-pink-400 font-bold text-sm">Wins: {tictactoeScore}</span>
              </div>

              {/* Game Area */}
              <TicTacToeGame onScoreChange={setTictactoeScore} gameState={tictactoeGameState} onGameStateChange={setTictactoeGameState} />
            </div>
          </div>
        )}

        {/* Brain Games Window */}
        {braingamesWindow.isOpen && !braingamesWindow.isMinimized && (
          <div
            className={`absolute ${focusedWindow === 'braingames' ? 'z-40' : 'z-20'}`}
            onClick={() => focusWindow('braingames')}
            style={{ left: braingamesPosition.x, top: braingamesPosition.y }}
          >
            <div className="bg-gradient-to-b from-pink-950 to-black rounded-xl shadow-2xl overflow-hidden border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
              {/* Title Bar */}
              <div
                onMouseDown={(e) => { focusWindow('braingames'); handleMouseDown('braingames', e); }}
                className="h-[52px] bg-gradient-to-b from-pink-900/50 to-pink-950 flex items-center px-4 gap-4 border-b border-pink-500/20 cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setBraingamesWindow({ isOpen: false, isMinimized: false })}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                  />
                  <button
                    onClick={() => setBraingamesWindow({ ...braingamesWindow, isMinimized: true })}
                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors" />
                </div>
                <span className="flex-1 text-center text-sm font-bold text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">BRAIN GAMES</span>
                <span className="text-pink-400 font-bold text-sm">Score: {braingamesScore}</span>
              </div>

              {/* Game Area */}
              <div className="max-h-[500px] overflow-auto scrollbar-none">
                <BrainGames onScoreChange={setBraingamesScore} gameState={braingamesGameState} onGameStateChange={setBraingamesGameState} />
              </div>
            </div>
          </div>
        )}

        {/* Backgrounds Finder Window */}
        {backgroundsFolder.isOpen && !backgroundsFolder.isMinimized && (
          <div
            className={`absolute w-[500px] ${focusedWindow === 'backgrounds' ? 'z-40' : 'z-20'}`}
            onClick={() => focusWindow('backgrounds')}
            style={{ left: backgroundsPosition.x, top: backgroundsPosition.y }}
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-black/10">
              {/* Finder Title Bar - Draggable */}
              <div
                onMouseDown={(e) => { focusWindow('backgrounds'); handleMouseDown('backgrounds', e); }}
                className="h-[52px] bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-4 gap-4 border-b border-black/10 cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => setBackgroundsFolder({ isOpen: false, isMinimized: false })}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                  />
                  <button
                    onClick={() => setBackgroundsFolder({ ...backgroundsFolder, isMinimized: true })}
                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors" />
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="flex-1 text-center text-sm font-medium text-black/80">Backgrounds</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Finder Content */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-4 gap-4">
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        setSelectedBackground(bg)
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${selectedBackground.id === bg.id
                          ? 'bg-blue-500/15 ring-2 ring-blue-500'
                          : 'hover:bg-black/5'
                        }`}
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden border border-black/10 shadow-sm">
                        <img
                          src={bg.preview}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`text-[11px] text-center leading-tight font-medium ${selectedBackground.id === bg.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Studies Finder Window */}
        {caseStudiesFolder.isOpen && !caseStudiesFolder.isMinimized && (
          <div
            className={`absolute w-[600px] ${focusedWindow === 'caseStudies' ? 'z-40' : 'z-20'} ${caseStudiesFolder.isMinimizing ? 'animate-minimize' : ''}`}
            onClick={() => focusWindow('caseStudies')}
            style={{ left: caseStudiesPosition.x, top: caseStudiesPosition.y, transformOrigin: 'bottom center' }}
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-black/10">
              {/* Finder Title Bar - Draggable */}
              <div
                onMouseDown={(e) => { focusWindow('caseStudies'); handleMouseDown('caseStudies', e); }}
                className="h-[52px] bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-4 gap-4 border-b border-black/10 cursor-grab active:cursor-grabbing">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCaseStudiesFolder({ isOpen: false, isMinimized: false })}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                  />
                  <button
                    onClick={() => minimizeWindow('caseStudies', setCaseStudiesFolder)}
                    className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                  />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors" />
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="flex-1 text-center text-sm font-medium text-black/80">Case Studies</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Finder Content */}
              <div className="flex h-[350px]">
                {/* Sidebar */}
                <div className="w-[170px] bg-[#f5f5f7] border-r border-black/5 p-3 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Favorites</div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-blue-500/15 text-blue-600">
                      <Folder className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Case Studies</span>
                    </div>
                    <button
                      onClick={() => { setPhotosWindow({ isOpen: true, isMinimized: false }); focusWindow('photos'); }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-600 hover:bg-black/5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[13px]">Photos</span>
                    </button>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-600 hover:bg-black/5 cursor-pointer">
                      <Folder className="w-4 h-4" />
                      <span className="text-[13px]">Desktop</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-600 hover:bg-black/5 cursor-pointer">
                      <Folder className="w-4 h-4" />
                      <span className="text-[13px]">Documents</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-5">iCloud</div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-600 hover:bg-black/5 cursor-pointer">
                      <Folder className="w-4 h-4" />
                      <span className="text-[13px]">iCloud Drive</span>
                    </div>
                  </div>
                </div>

                {/* Main content - Case Study folders */}
                <div className="flex-1 p-6 bg-white overflow-y-auto">
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(caseStudies).map(([key, project]) => (
                      <button
                        key={key}
                        onClick={() => setSafariWindow({ isOpen: true, isMinimized: false, project: key })}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-blue-500/10 transition-colors group"
                      >
                        <div className="w-20 h-16 group-hover:scale-110 transition-transform">
                          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Folder-icon-256%402x-an7f37Atw32XeqJSJQWDMmyYWLYBtX.png" alt={project.title} className="w-full h-auto" />
                        </div>
                        <span className="text-[12px] text-gray-700 text-center leading-tight font-medium">{project.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Windows Container */}
      <div className="absolute inset-0 top-[25px]">
        {/* About Window */}
        {aboutWindow.isOpen && !aboutWindow.isMinimized && (
          <div
            className={`absolute w-[420px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 fade-in duration-200 ${focusedWindow === 'about' ? 'z-40' : 'z-20'} ${aboutWindow.isMinimizing ? 'animate-minimize' : ''}`}
            style={{ left: aboutPosition.x, top: aboutPosition.y, transformOrigin: 'bottom center' }}
            onClick={() => focusWindow('about')}
          >
            <div
              className="h-7 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-3 gap-2 border-b border-black/5 cursor-move"
              onMouseDown={(e) => handleMouseDown('about', e)}
            >
              <div className="flex gap-2">
                <button onClick={() => setAboutWindow({ isOpen: false, isMinimized: false })} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors shadow-sm" />
                <button onClick={() => minimizeWindow('about', setAboutWindow)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors shadow-sm" />
                <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors shadow-sm" />
              </div>
              <span className="flex-1 text-center text-[12px] text-black/70 font-medium -ml-[54px]">About Me</span>
            </div>
            <div className="p-6 text-black">
              <div className="flex items-start gap-5">
                <div className="w-32 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                  <img src={CHARITY_PHOTO_URL} alt="Charity Dupont" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 pt-1 space-y-3">
                  <div className="border-b border-black/10 pb-2">
                    <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">Name</p>
                    <p className="text-sm text-black/70 mt-0.5">Charity Dupont</p>
                  </div>
                  <div className="border-b border-black/10 pb-2">
                    <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">Position</p>
                    <p className="text-sm text-black/70 mt-0.5">UX Designer</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-black/50 uppercase tracking-wider">Mail</p>
                    <a href="mailto:hello@charitydupont.com" className="text-sm text-blue-500 mt-0.5 hover:underline">hello@charitydupont.com</a>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-neutral-100 rounded-xl p-4 text-xs text-black/80 leading-relaxed">
                <p className="mb-2">{"I'm"} Charity Dupont, a UX Designer based in New York/NJ.</p>
                <p>I spent my early career as a 4th-grade teacher before bringing my passion for human cognition to tech via Columbia {"University's"} UX/UI program. Today, {"I'm"} a UX Designer at Google, where I use rapid prototyping and user psychology to help people navigate the complexities of generative AI.</p>
              </div>
              {/* Resume Section */}
              <div className="mt-4 bg-neutral-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Resume</p>
                <div className="flex gap-2">
                  <a
                    href={RESUME_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Resume
                  </a>
                  <a
                    href={RESUME_PDF_URL}
                    download="Charity_Dupont_Resume.pdf"
                    className="flex-1 px-3 py-2 bg-black/10 text-black/70 text-xs font-medium rounded-lg hover:bg-black/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Window */}
        {messagesWindow.isOpen && !messagesWindow.isMinimized && (
          <div
            className={`absolute w-[700px] h-[480px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 fade-in duration-200 flex ${focusedWindow === 'messages' ? 'z-40' : 'z-20'} ${messagesWindow.isMinimizing ? 'animate-minimize' : ''}`}
            style={{ left: messagesPosition.x, top: messagesPosition.y, transformOrigin: 'bottom center' }}
            onClick={() => focusWindow('messages')}
          >
            {/* Sidebar - Contacts */}
            <div className="w-[240px] bg-[#f5f5f7] border-r border-black/10 flex flex-col">
              <div
                onMouseDown={(e) => { focusWindow('messages'); handleMouseDown('messages', e); }}
                className="h-12 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-3 gap-2 border-b border-black/5 cursor-grab active:cursor-grabbing"
              >
                <div className="flex gap-2">
                  <button onClick={() => setMessagesWindow({ isOpen: false, isMinimized: false })} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors shadow-sm" />
                  <button onClick={() => minimizeWindow('messages', setMessagesWindow)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors shadow-sm" />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors shadow-sm" />
                </div>
              </div>
              <div className="p-2">
                <div className="bg-white/60 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-black/40" />
                  <span className="text-[12px] text-black/40">Search</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {desktopConversations.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact.id);
                      // Mark as read
                      setDesktopConversations(prev => prev.map(conv => 
                        conv.id === contact.id ? { ...conv, unread: false } : conv
                      ));
                    }}
                    className={`w-full p-3 flex items-start gap-3 hover:bg-black/5 transition-colors text-left ${selectedContact === contact.id ? 'bg-blue-500 text-white hover:bg-blue-500' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                      ) : (
                        <img src={MEMOJI_URL} alt="Charity" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[13px] font-medium truncate ${selectedContact === contact.id ? 'text-white' : 'text-black'}`}>{contact.name}</span>
                        <span className={`text-[10px] ${selectedContact === contact.id ? 'text-white/70' : 'text-black/40'}`}>{contact.time}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${selectedContact === contact.id ? 'text-white/80' : 'text-black/50'}`}>{contact.id === 'welcome' ? (chatMessages[chatMessages.length - 1]?.text || contact.lastMessage) : contact.lastMessage}</p>
                    </div>
                    {contact.unread && selectedContact !== contact.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedContact === 'welcome' ? (
              <CharityChat openCaseStudy={openCaseStudy} messages={chatMessages} setMessages={setChatMessages} />
            ) : (
              <div className="flex-1 flex flex-col bg-white">
                <div className="h-12 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-black/5 flex items-center justify-center px-4">
                  <span className="text-[13px] font-medium text-black/80">
                    {desktopConversations.find(c => c.id === selectedContact)?.name}
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {desktopConversations.find(c => c.id === selectedContact)?.messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className={`max-w-[70%] ${msg.from === 'charity' ? 'self-end' : 'self-start'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${msg.from === 'charity' ? 'bg-blue-500 text-white' : 'bg-[#e9e9eb] text-black'}`}>
                          <p className="text-[13px] leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => openCaseStudy(selectedContact)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-medium px-4 py-2 rounded-full transition-colors"
                    >
                      View Full Case Study
                    </button>
                  </div>
                </div>
                <div className="p-3 border-t border-black/5">
                  <div className="bg-[#f5f5f7] rounded-full px-4 py-2 flex items-center gap-2">
                    <input type="text" placeholder="iMessage" className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Window */}
        {notesWindow.isOpen && !notesWindow.isMinimized && (
          <div
            className={`absolute w-[700px] h-[500px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 fade-in duration-200 flex ${focusedWindow === 'notes' ? 'z-40' : 'z-20'} ${notesWindow.isMinimizing ? 'animate-minimize' : ''}`}
            style={{ left: notesPosition.x, top: notesPosition.y, transformOrigin: 'bottom center' }}
            onClick={() => focusWindow('notes')}
          >
            {/* Sidebar */}
            <div className="w-[200px] bg-[#f5f5f7] border-r border-black/10 flex flex-col">
              <div
                onMouseDown={(e) => { focusWindow('notes'); handleMouseDown('notes', e); }}
                className="h-12 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-3 gap-2 border-b border-black/5 cursor-grab active:cursor-grabbing">
                <div className="flex gap-2">
                  <button onClick={() => setNotesWindow({ isOpen: false, isMinimized: false })} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors shadow-sm" />
                  <button onClick={() => minimizeWindow('notes', setNotesWindow)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors shadow-sm" />
                  <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors shadow-sm" />
                </div>
                <span className="flex-1 text-center text-[12px] text-black/70 font-medium">Notes</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <button
                  onClick={() => setDesktopSelectedNote('experience')}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${desktopSelectedNote === 'experience' ? 'bg-amber-200' : 'hover:bg-black/5'}`}
                >
                  <p className="font-semibold text-sm text-black">Experience</p>
                  <p className="text-xs text-black/50">02/01/2025 <span className="text-amber-600">UX Designer</span></p>
                </button>
                <button
                  onClick={() => setDesktopSelectedNote('about')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${desktopSelectedNote === 'about' ? 'bg-amber-200' : 'hover:bg-black/5'}`}
                >
                  <p className="font-semibold text-sm text-black">About</p>
                  <p className="text-xs text-black/50">05/25/1995 {"I'm"} Charity...</p>
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-black/5 text-right">
                <p className="text-xs text-black/40">
                  {desktopSelectedNote === 'experience' ? 'February 1, 2025 at 11:48AM' : 'May 25, 1995 at 11:35 AM'}
                </p>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {desktopSelectedNote === 'experience' ? (
                  <div className="text-black">
                    <h1 className="text-3xl font-bold mb-6">Experience</h1>
                    <p className="text-lg font-medium mb-4">UX/UI Designer Google LLC, New York Feb 2025 - Present</p>
                    <ul className="list-disc list-outside ml-5 space-y-3 text-black/80">
                      <li>Translating user behavior and psychology into intuitive models, ensuring machine outputs align perfectly with human mental models.</li>
                      <li>Executing high-velocity workflows to bridge the gap between abstract design concepts and functional, testable system logic.</li>
                      <li>Designing seamless, end-to-end user journeys for autonomous assistants that stay firmly grounded in user intent.</li>
                      <li>Partnering deeply with Research and Engineering to transform unstructured data and real-time inputs into actionable product frameworks.</li>
                      <li>Building resilient UX scaffolding that maintains coherence and utility across high-stakes workflows and rapidly evolving AI models.</li>
                    </ul>
                    <div className="mt-8">
                      <h2 className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-2">Education</h2>
                      <p className="text-black/80">BA Psychology New Jersey City University, Jersey City, NJ</p>
                      <p className="text-black/80">Class of 2018</p>
                      <p className="text-black/80 mt-2">Certificate in Coursera Google UX Design (Online) 2025</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-black">
                    <h1 className="text-3xl font-bold mb-6">About</h1>
                    <p className="mb-4">I am Charity Dupont.</p>
                    <p className="mb-4 text-black/80 leading-relaxed">
                      As a UX/UI Designer in this dynamic field, I am on an exciting journey of discovery and innovation. My professional foundation is strengthened by a unique perspective, drawn from a background in education, which provides a deep understanding of how people learn and interact with information, a critical element for designing world-class products. My foundational skills were developed at the Columbia University Bootcamp, where I became proficient in using design tools and methodologies to create intuitive and engaging user experiences.
                    </p>
                    <p className="mb-4 text-black/80 leading-relaxed">
                      I excel at empathizing with users, understanding their needs and pain points, and my approach is rigorously user-centered, ensuring that my designs are not only aesthetically pleasing but also highly functional. I value feedback and iteration, constantly seeking ways to improve my work. Furthermore, my experience as a teacher has honed my ability to communicate complex ideas clearly and effectively, a crucial skill for collaborating with stakeholders and cross-functional teams.
                    </p>
                    <p className="mb-4 text-black/80 leading-relaxed">
                      I am a dedicated and passionate UX/UI designer, leveraging my unique background and commitment to continuous learning to drive meaningful and impactful user experiences.
                    </p>
                    <p className="text-black/80">
                      {"Let's"} connect: <a href="mailto:hello@charitydupont.com" className="text-blue-500 hover:underline">hello@charitydupont.com</a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Folder Window */}
        {projectsFolder.isOpen && !projectsFolder.isMinimized && (
          <div
            className={`absolute w-[420px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 fade-in duration-200 ${projectsFolder.isMinimizing ? 'animate-minimize' : ''}`}
            style={{ left: projectsPosition.x, top: projectsPosition.y, transformOrigin: 'bottom center' }}
          >
            <div
              className="h-7 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-3 gap-2 border-b border-black/5 cursor-move"
              onMouseDown={(e) => handleMouseDown('projects', e)}
            >
              <div className="flex gap-2">
                <button onClick={() => setProjectsFolder({ isOpen: false, isMinimized: false })} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors shadow-sm" />
                <button onClick={() => minimizeWindow('projects', setProjectsFolder)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors shadow-sm" />
                <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors shadow-sm" />
              </div>
              <span className="flex-1 text-center text-[12px] text-black/70 font-medium -ml-[54px]">Projects</span>
            </div>
            <div className="p-6">
              <div className="flex justify-center gap-8">
                {/* Teammate */}
                <button onClick={() => openCaseStudy('teammate')} className="flex flex-col items-center gap-2 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-200">
                    <img src={TEAMMATE_ICON} alt="Teammate" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-black/70 font-medium">Teammate</span>
                </button>

                {/* Meetly */}
                <button onClick={() => openCaseStudy('meetly')} className="flex flex-col items-center gap-2 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-200">
                    <img src={MEETLY_ICON} alt="Meetly" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-black/70 font-medium">Meetly</span>
                </button>

                {/* Silas */}
                <button onClick={() => openCaseStudy('silas')} className="flex flex-col items-center gap-2 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-200">
                    <img src={SILAS_ICON} alt="Silas" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-black/70 font-medium">Silas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Safari Browser Window */}
        {safariWindow.isOpen && !safariWindow.isMinimized && (
          <div
            className={`absolute w-[900px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-black/10 ${focusedWindow === 'safari' ? 'z-40' : 'z-20'}`}
            style={{ left: safariPosition.x, top: safariPosition.y }}
            onClick={() => setFocusedWindow('safari')}
          >
            {/* Safari Title Bar */}
            <div 
              className="h-[52px] bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] flex items-center px-4 border-b border-black/10 cursor-move"
              onMouseDown={(e) => {
                const startX = e.clientX - safariPosition.x
                const startY = e.clientY - safariPosition.y
                const handleMouseMove = (e: MouseEvent) => {
                  setSafariPosition({ x: e.clientX - startX, y: e.clientY - startY })
                }
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            >
              {/* Window Controls */}
              <div className="flex gap-2 mr-4">
                <button
                  onClick={() => setSafariWindow({ isOpen: false, isMinimized: false, project: null })}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors"
                />
                <button
                  onClick={() => setSafariWindow(prev => ({ ...prev, isMinimized: true }))}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                />
                <button className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1db954] transition-colors" />
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex gap-2 mr-3">
                <button 
                  onClick={() => { setSafariUrl(''); setSafariInputUrl(''); }}
                  className={`w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center transition-colors ${safariUrl ? 'text-black/70' : 'text-black/30'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-black/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* URL Bar */}
              <div className="flex-1 max-w-[500px]">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    let url = safariInputUrl
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                      url = 'https://' + url
                    }
                    setSafariUrl(url)
                    setSafariInputUrl(url)
                  }}
                  className="w-full"
                >
                  <input
                    type="text"
                    value={safariInputUrl}
                    onChange={(e) => setSafariInputUrl(e.target.value)}
                    className="w-full h-7 px-3 bg-white rounded-md border border-black/10 text-sm text-center text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Search or enter website name"
                  />
                </form>
              </div>
              
              {/* Right side icons */}
              <div className="flex gap-2 ml-3">
                <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-black/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-black/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
{/* Browser Content */}
            <div className="w-full h-[calc(100%-52px)] bg-white overflow-auto">
              {safariUrl === 'wikipedia' ? (
                /* Fake Wikipedia Page about Charity Dupont */
                <div className="w-full min-h-full bg-white">
                  
                  {/* Wikipedia Header */}
                  <div className="bg-white border-b border-gray-200 px-4 py-2">
                    <div className="flex items-center gap-4">
                      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wikipedia-wordmark-en-25-QgUVUwhHCCccrX81eTmsdUDTQRfIQ6.svg" alt="Wikipedia" className="h-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="text-black font-medium">Article</span>
                          <span>Talk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Wikipedia Content */}
                  <div className="max-w-[900px] mx-auto px-6 py-6">
                    <h1 className="text-3xl font-serif text-black border-b border-gray-300 pb-2 mb-4">Charity Dupont</h1>
                    
                    <div className="flex gap-6">
                      {/* Main Content */}
                      <div className="flex-1 text-sm text-gray-800 leading-relaxed">
                        <p className="mb-4">
                          <b>Charity Dupont</b> is an American <a href="#" className="text-blue-600 hover:underline">UX/UI designer</a> and <a href="#" className="text-blue-600 hover:underline">AI experience designer</a> currently working at <a href="#" className="text-blue-600 hover:underline">Google</a>. She is known for her work in designing AI-powered user experiences and her focus on creating intuitive, human-centered digital products.
                        </p>
                        
                        <h2 className="text-xl font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-6">Early life and education</h2>
                        <p className="mb-4">
                          Dupont began her career in web design during the <a href="#" className="text-blue-600 hover:underline">COVID-19 pandemic</a>, initially working on websites for clients through a family connection. This early experience sparked her interest in digital design and user experience.
                        </p>
                        <p className="mb-4">
                          She later pursued formal training in UX/UI design at <a href="#" className="text-blue-600 hover:underline">Columbia University</a>, completing a comprehensive bootcamp program while simultaneously working full-time as a fourth-grade teacher. This period demonstrated her ability to balance multiple demanding responsibilities while developing new professional skills.
                        </p>
                        
                        <h2 className="text-xl font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-6">Career</h2>
                        <p className="mb-4">
                          Through a connection with one of her professors at Columbia, Dupont was introduced to an opportunity at <a href="#" className="text-blue-600 hover:underline">Google</a>, where she currently works as a UX designer. Her work focuses on AI-driven user experiences, requiring her to design for systems with variable and unpredictable outputs.
                        </p>
                        <p className="mb-4">
                          Dupont&apos;s approach to AI UX design emphasizes clarity, transparency, and user control. She has noted that designing for AI differs significantly from traditional UX because &quot;you are not designing a fixed path—you are designing systems that can change based on input.&quot;
                        </p>
                        
                        <h2 className="text-xl font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-6">Design philosophy</h2>
                        <p className="mb-4">
                          Dupont is known for her iterative approach to design, often moving quickly from understanding a problem directly into prototyping. She emphasizes the importance of early feedback and has spoken about overcoming perfectionism in her creative process.
                        </p>
                        <p className="mb-4">
                          Her design philosophy centers on making &quot;things make sense, not just look good,&quot; focusing on systems that help users think clearly rather than purely aesthetic considerations.
                        </p>
                        
                        <h2 className="text-xl font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-6">Skills and expertise</h2>
                        <ul className="list-disc ml-6 mb-4">
                          <li>AI/ML user experience design</li>
                          <li>Prototyping and live coding</li>
                          <li>Human-centered design</li>
                          <li>Design systems</li>
                          <li>User research and testing</li>
                        </ul>
                        
                        <h2 className="text-xl font-serif text-black border-b border-gray-300 pb-1 mb-3 mt-6">References</h2>
                        <div className="text-xs text-gray-600">
                          <p>1. &quot;UX Design in the Age of AI&quot; - Columbia University Design Program</p>
                          <p>2. Google Design Team Profile, 2024</p>
                        </div>
                      </div>
                      
                      {/* Infobox */}
                      <div className="w-[220px] shrink-0">
                        <div className="border border-gray-300 bg-gray-50 text-sm">
                          <div className="bg-gray-200 px-3 py-2 text-center font-semibold text-black">Charity Dupont</div>
                          <div className="p-3">
<img 
                              src={CHARITY_PHOTO_URL}
                              alt="Charity Dupont"
                              className="w-full h-48 object-cover mb-1"
                            />
                            <p className="text-[10px] text-gray-500 text-center mb-3">Dupont in 2024</p>
                            <table className="w-full text-xs">
                              <tbody>
                                <tr className="border-b border-gray-200">
                                  <td className="py-1 font-semibold text-gray-700">Occupation</td>
                                  <td className="py-1 text-gray-800">UX Designer</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="py-1 font-semibold text-gray-700">Employer</td>
                                  <td className="py-1 text-gray-800">Google</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="py-1 font-semibold text-gray-700">Education</td>
                                  <td className="py-1 text-gray-800">Columbia University</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                  <td className="py-1 font-semibold text-gray-700">Known for</td>
                                  <td className="py-1 text-gray-800">AI UX Design</td>
                                </tr>
                                <tr>
                                  <td className="py-1 font-semibold text-gray-700">Website</td>
                                  <td className="py-1"><a href="#" className="text-blue-600 hover:underline">charitydupont.com</a></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : safariUrl ? (
                <iframe
                  src={safariUrl}
                  className="w-full h-full border-0"
                  title="Safari Browser"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                /* Safari Start Page - Light Theme */
                <div className="w-full h-full bg-[#f5f5f7] flex flex-col items-center justify-start pt-12 px-8">
                  {/* Favorites */}
                  <div className="w-full max-w-[700px]">
                    <h2 className="text-gray-500 text-xs font-medium mb-4 uppercase tracking-wide">Favorites</h2>
                    <div className="grid grid-cols-6 gap-6">
                      {[
                        { name: 'Wikipedia', icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wikipedia_Logo_1.0-wubSVX4dY2rqtnrJ5XcvoYYLBXGILS.png', url: 'wikipedia' },
                        { name: 'Google', icon: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png', url: 'https://google.com' },
                        { name: 'Apple', icon: 'https://www.apple.com/favicon.ico', url: 'https://apple.com' },
                        { name: 'LinkedIn', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', url: 'https://linkedin.com/in/charitydupont' },
                      ].map((site) => (
                        <button
                          key={site.name}
                          onClick={() => {
                            if (site.url.startsWith('http')) {
                              window.open(site.url, '_blank')
                            } else {
                              setSafariUrl(site.url)
                              setSafariInputUrl(site.url)
                            }
                          }}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden p-2 group-hover:shadow-md transition-shadow">
                            <img src={site.icon} alt={site.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-gray-700 text-xs">{site.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Privacy Report */}
                  <div className="w-full max-w-[700px] mt-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-medium">Privacy Report</p>
                          <p className="text-gray-500 text-xs">Safari helped prevent 3 trackers from profiling you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Safari Case Study Windows - Multiple can be open */}
        {Object.entries(openCaseStudies).map(([projectId, state]) => (
          state.isOpen && !state.isMinimized && (
            <SafariCaseStudy
              key={projectId}
              project={projectId}
              onClose={() => closeCaseStudy(projectId)}
              onMinimize={() => minimizeCaseStudy(projectId)}
              isFocused={focusedWindow === `safari-${projectId}`}
              onFocus={() => setFocusedWindow(`safari-${projectId}`)}
            />
          )
        ))}
      </div>

      {/* Dock - z-10 so windows appear on top */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-2xl rounded-[22px] px-2 py-2 flex items-end gap-2 border border-white/30 shadow-2xl z-10">
        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src={MEMOJI_URL} alt="About Me" className="w-full h-full object-cover" />
            </div>
          }
          label="About Me"
          onClick={openAboutWindow}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apple_Notes_icon.svg-wp0HYRwzBWI8Kg13EG3ANIGRAlPpCw.png" alt="Notes" className="w-full h-full object-cover" />
            </div>
          }
          label="Notes"
          onClick={() => setNotesWindow({ isOpen: true, isMinimized: false })}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMessage_logo.svg-FX2uXRLcx7RuPBmMqC6YlrYIocaLrP.png" alt="Messages" className="w-full h-full object-cover" />
            </div>
          }
          label="Messages"
          onClick={openMessagesWindow}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ios-photos-lYj3iJkf2hHIHOqn861p1PylGIHn6R.jpg" alt="Photos" className="w-full h-full object-cover" />
            </div>
          }
          label="Photos"
          onClick={() => { setPhotosWindow({ isOpen: true, isMinimized: false }); focusWindow('photos'); }}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/j1r7jahhhucj79l3dnbd0dn0k2-3fb52544f2e99df722dce90caa4b32b1-T7rKdRYThUXJQGjNmhkR6JwltwBGHG.png" alt="Safari" className="w-full h-full object-cover" />
            </div>
          }
          label="Safari"
          onClick={() => { setSafariWindow({ isOpen: true, isMinimized: false, project: null }); setFocusedWindow('safari'); }}
        />

        <DockIcon
          icon={
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 rounded-xl shadow-lg shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              <style>{`
                @keyframes tttMove1 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(24px, 0); } 66% { transform: translate(24px, 24px); } }
                @keyframes tttMove2 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(-24px, 24px); } 66% { transform: translate(0, 24px); } }
                @keyframes tttMove3 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(0, -24px); } 66% { transform: translate(-24px, -24px); } }
                @keyframes tttMove4 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(24px, -24px); } 66% { transform: translate(24px, 0); } }
                @keyframes tttGlow { 0%, 100% { filter: drop-shadow(0 0 2px #f472b6); } 50% { filter: drop-shadow(0 0 6px #ec4899); } }
                .ttt-piece1 { animation: tttMove1 4s infinite ease-in-out, tttGlow 2s infinite; }
                .ttt-piece2 { animation: tttMove2 4s infinite ease-in-out 0.5s, tttGlow 2s infinite 0.5s; }
                .ttt-piece3 { animation: tttMove3 4s infinite ease-in-out 1s, tttGlow 2s infinite 1s; }
                .ttt-piece4 { animation: tttMove4 4s infinite ease-in-out 1.5s, tttGlow 2s infinite 1.5s; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#831843"/>
              <g>
                <line x1="38" y1="20" x2="38" y2="80" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                <line x1="62" y1="20" x2="62" y2="80" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                <line x1="20" y1="38" x2="80" y2="38" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
                <line x1="20" y1="62" x2="80" y2="62" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
              </g>
              <g className="ttt-piece1" stroke="#f472b6" strokeWidth="3" strokeLinecap="round">
                <line x1="24" y1="24" x2="32" y2="32"/>
                <line x1="32" y1="24" x2="24" y2="32"/>
              </g>
              <circle className="ttt-piece2" cx="50" cy="28" r="5" fill="none" stroke="#fb7185" strokeWidth="3"/>
              <g className="ttt-piece3" stroke="#f472b6" strokeWidth="3" strokeLinecap="round">
                <line x1="68" y1="68" x2="76" y2="76"/>
                <line x1="76" y1="68" x2="68" y2="76"/>
              </g>
              <circle className="ttt-piece4" cx="28" cy="50" r="5" fill="none" stroke="#fb7185" strokeWidth="3"/>
            </svg>
          }
          label="Tic-Tac-Toe"
          onClick={() => { setTictactoeWindow({ isOpen: true, isMinimized: false }); focusWindow('tictactoe'); }}
        />

        <DockIcon
          icon={
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 rounded-xl shadow-lg shadow-[0_0_15px_rgba(255,215,0,0.4)]">
              <style>{`
                @keyframes dockGoldPulse { 0%, 100% { stroke: #FFD700; filter: drop-shadow(0 0 2px #FFD700) drop-shadow(0 0 8px #B8860B); } 50% { stroke: #FFFACD; filter: drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 15px #FFD700); } }
                @keyframes dockGoldDots { 0%, 100% { fill: #FFD700; opacity: 1; } 50% { fill: #FFFACD; opacity: 0.7; } }
                @keyframes dockDiceFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(10deg); } }
                .dock-dice-3d { animation: dockDiceFloat 4s ease-in-out infinite; transform-origin: center; }
                .dock-neon-gold { animation: dockGoldPulse 2s infinite ease-in-out; }
                .dock-gold-dots { animation: dockGoldDots 2s infinite ease-in-out; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#1a1a2e"/>
              <g className="dock-dice-3d">
                <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="#000" className="dock-neon-gold" strokeWidth="2"/>
                <path d="M20 35 L50 50 V80 L20 65 Z" fill="#000" className="dock-neon-gold" strokeWidth="2"/>
                <path d="M80 35 L50 50 V80 L80 65 Z" fill="#000" className="dock-neon-gold" strokeWidth="2"/>
                <g className="dock-gold-dots">
                  <circle cx="50" cy="35" r="4"/>
                  <circle cx="32" cy="48" r="3"/>
                  <circle cx="42" cy="65" r="3"/>
                  <circle cx="62" cy="48" r="3"/>
                  <circle cx="68" cy="58" r="3"/>
                  <circle cx="74" cy="68" r="3"/>
                </g>
              </g>
            </svg>
          }
          label="Brain Games"
          onClick={() => { setBraingamesWindow({ isOpen: true, isMinimized: false }); focusWindow('braingames'); }}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src={TEAMMATE_ICON} alt="Teammate" className="w-full h-full object-cover" />
            </div>
          }
          label="Teammate"
          onClick={() => openCaseStudy('teammate')}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src={MEETLY_ICON} alt="Meetly" className="w-full h-full object-cover" />
            </div>
          }
          label="Meetly"
          onClick={() => openCaseStudy('meetly')}
        />

        <DockIcon
          icon={
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img src={SILAS_ICON} alt="Silas" className="w-full h-full object-cover" />
            </div>
          }
          label="Silas"
          onClick={() => openCaseStudy('silas')}
        />

        {/* Minimized Windows Section */}
        {(photosWindow.isMinimized || caseStudiesFolder.isMinimized || aboutWindow.isMinimized || messagesWindow.isMinimized || notesWindow.isMinimized || projectsFolder.isMinimized || Object.values(openCaseStudies).some(s => s.isMinimized)) && (
          <>
            <div className="w-px h-10 bg-white/30 mx-1" />

            {photosWindow.isMinimized && (
              <button
                onClick={() => { setPhotosWindow({ isOpen: true, isMinimized: false }); focusWindow('photos'); }}
                className="group relative"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                  {/* Mini preview of Photos window - icon size */}
                  <div className="w-full h-full bg-[#1e1e1e]">
                    <div className="h-1.5 bg-[#2d2d2d] flex items-center px-0.5 gap-px">
                      <div className="w-1 h-1 rounded-full bg-[#ff5f57]" />
                      <div className="w-1 h-1 rounded-full bg-[#febc2e]" />
                      <div className="w-1 h-1 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex h-[calc(100%-6px)]">
                      <div className="w-2 bg-[#2d2d2d]" />
                      <div className="flex-1 p-0.5 grid grid-cols-2 gap-0.5">
                        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-29%20at%2010.15.35%E2%80%AFPM-6jEBgSqfF0xbKAt1GNKmkffpFLcivl.png" className="w-full h-3 object-cover rounded-sm" />
                        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-29%20at%2010.15.23%E2%80%AFPM-FRMXPc31NRPqKnrxLQNDINxqJl2Bsi.png" className="w-full h-3 object-cover rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  Photos
                </div>
              </button>
            )}

            {caseStudiesFolder.isMinimized && (
              <button
                onClick={() => { setCaseStudiesFolder({ isOpen: true, isMinimized: false }); focusWindow('caseStudies'); }}
                className="group relative"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                  {/* Mini preview of case studies folder - icon size */}
                  <div className="w-full h-full bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] p-0.5">
                    <div className="flex gap-px mb-0.5">
                      <div className="w-1 h-1 rounded-full bg-[#ff5f57]" />
                      <div className="w-1 h-1 rounded-full bg-[#febc2e]" />
                      <div className="w-1 h-1 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="bg-white h-[calc(100%-8px)] rounded-sm flex gap-0.5 p-0.5">
                      <div className="w-2 bg-gray-100 rounded-sm" />
                      <div className="flex-1 grid grid-cols-2 gap-0.5 content-start">
                        <div className="w-full h-2 bg-blue-100 rounded-sm" />
                        <div className="w-full h-2 bg-green-100 rounded-sm" />
                        <div className="w-full h-2 bg-purple-100 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  Case Studies
                </div>
              </button>
            )}

            {aboutWindow.isMinimized && (
              <button
                onClick={() => { setAboutWindow({ isOpen: true, isMinimized: false }); focusWindow('about'); }}
                className="group relative"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                  {/* Mini preview of About window - icon size */}
                  <div className="w-full h-full bg-white/95">
                    <div className="h-1.5 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-0.5 gap-px">
                      <div className="w-1 h-1 rounded-full bg-[#ff5f57]" />
                      <div className="w-1 h-1 rounded-full bg-[#febc2e]" />
                      <div className="w-1 h-1 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-1 flex flex-col items-center justify-center h-[calc(100%-6px)]">
                      <img src={MEMOJI_URL} alt="About" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  About Me
                </div>
              </button>
            )}

            {messagesWindow.isMinimized && (
              <button
                onClick={() => { setMessagesWindow({ isOpen: true, isMinimized: false }); focusWindow('messages'); }}
                className="group relative"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                  {/* Mini preview of Messages window - icon size */}
                  <div className="w-full h-full bg-white/95 flex">
                    <div className="w-3 bg-[#f5f5f7] border-r border-black/5">
                      <div className="h-1.5 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8]" />
                      <div className="p-0.5 space-y-0.5">
                        <div className="w-full h-1 bg-blue-500/20 rounded-sm" />
                        <div className="w-full h-1 bg-gray-200 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex-1 p-1 flex flex-col justify-center">
                      <div className="w-5 h-1.5 bg-[#007aff] rounded-full ml-auto mb-1" />
                      <div className="w-4 h-1.5 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  Messages
                </div>
              </button>
            )}

            {notesWindow.isMinimized && (
              <button
                onClick={() => { setNotesWindow({ isOpen: true, isMinimized: false }); focusWindow('notes'); }}
                className="group relative"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                  {/* Mini preview of Notes window - icon size */}
                  <div className="w-full h-full bg-white/95 flex">
                    <div className="w-3 bg-[#f5f5f7] border-r border-black/5">
                      <div className="h-1.5 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8]" />
                    </div>
                    <div className="flex-1 bg-[#fffef5] p-1">
                      <div className="w-full h-1 bg-black/20 rounded mb-1" />
                      <div className="w-4 h-0.5 bg-black/10 rounded mb-0.5" />
                      <div className="w-5 h-0.5 bg-black/10 rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  Notes
                </div>
              </button>
            )}

            {/* Minimized Case Study Windows */}
            {Object.entries(openCaseStudies).map(([projectId, state]) => (
              state.isMinimized && (
                <button
                  key={projectId}
                  onClick={() => restoreCaseStudy(projectId)}
                  className="group relative"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-110">
                    {/* Mini screenshot preview - same size as dock icons */}
                    <div className="w-full h-full bg-white flex flex-col">
                      <div className="h-1.5 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-0.5 gap-px shrink-0">
                        <div className="w-1 h-1 rounded-full bg-[#ff5f57]" />
                        <div className="w-1 h-1 rounded-full bg-[#febc2e]" />
                        <div className="w-1 h-1 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <img
                          src={caseStudies[projectId as keyof typeof caseStudies]?.screenshot}
                          alt={caseStudies[projectId as keyof typeof caseStudies]?.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                    {caseStudies[projectId as keyof typeof caseStudies]?.title}
                  </div>
                </button>
              )
            ))}
          </>
        )}
      </div>
    </div>
  )
}

interface DockIconProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function DockIcon({ icon, label, onClick }: DockIconProps) {
  return (
    <button onClick={onClick} className="group relative flex flex-col items-center">
      <div className="transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:scale-125">
        {icon}
      </div>
      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xl text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
        {label}
      </div>
    </button>
  )
}

interface SafariCaseStudyProps {
  project: string
  onClose: () => void
  onMinimize: () => void
  isFocused: boolean
  onFocus: () => void
}

function SafariCaseStudy({ project, onClose, onMinimize, isFocused, onFocus }: SafariCaseStudyProps) {
  const study = caseStudies[project as keyof typeof caseStudies]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [windowPosition, setWindowPosition] = useState({ x: 8, y: 28 })
  const [isDragging, setIsDragging] = useState(false)
  const [isFullSize, setIsFullSize] = useState(true)
  const windowRef = useRef<HTMLDivElement>(null)

  // Initialize with full size
  useEffect(() => {
    if (windowRef.current && windowSize.width === 0) {
      const parent = windowRef.current.parentElement
      if (parent) {
        setWindowSize({
          width: parent.clientWidth - 16,
          height: parent.clientHeight - 36
        })
      }
    }
  }, [windowSize.width])

  const toggleResize = () => {
    if (isFullSize) {
      // Shrink to smaller size and center it
      setWindowSize({ width: 700, height: 500 })
      setWindowPosition({ x: 100, y: 80 })
      setIsFullSize(false)
    } else {
      // Expand to full size
      if (windowRef.current) {
        const parent = windowRef.current.parentElement
        if (parent) {
          setWindowSize({
            width: parent.clientWidth - 16,
            height: parent.clientHeight - 36
          })
          setWindowPosition({ x: 8, y: 28 })
        }
      }
      setIsFullSize(true)
    }
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX
    const startY = e.clientY
    const startPosX = windowPosition.x
    const startPosY = windowPosition.y

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, startPosX + (e.clientX - startX))
      const newY = Math.max(28, startPosY + (e.clientY - startY))
      setWindowPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!study) return null

  // Check which full case study to render
  const isSilas = project === 'silas'
  const isMeetly = project === 'meetly'
  const isTeammate = project === 'teammate'

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white rounded-xl shadow-2xl overflow-hidden border border-black/10 animate-in zoom-in-95 fade-in duration-200 flex flex-col ${isFocused ? 'z-40' : 'z-20'} ${isDragging ? 'select-none cursor-grabbing' : ''} transition-all duration-200`}
      style={{
        left: windowPosition.x,
        top: windowPosition.y,
        width: windowSize.width || 'calc(100% - 16px)',
        height: windowSize.height || 'calc(100% - 36px)',
        minWidth: '500px',
        minHeight: '400px'
      }}
      onClick={onFocus}
    >
      {/* Safari Title Bar - Draggable */}
      <div
        onMouseDown={handleDragStart}
        className="h-[52px] bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] flex items-center px-3 gap-3 border-b border-black/10 shrink-0 cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-colors shadow-sm" />
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors shadow-sm" />
          <button onClick={toggleResize} className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1fb32e] transition-colors shadow-sm" />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 text-black/40">
          <ChevronLeft className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-1.5 min-w-[400px] border border-black/10">
            <Lock className="w-3 h-3 text-black/40" />
            <span className="text-[12px] text-black/60">charitydupont.com/portfolio/{project}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 text-black/40">
          <Share className="w-4 h-4" />
          <Plus className="w-4 h-4" />
          <Grid3X3 className="w-4 h-4" />
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        {isSilas ? (
          <SilasCaseStudy />
        ) : isMeetly ? (
          <MeetlyCaseStudy />
        ) : isTeammate ? (
          <TeammateCaseStudy />
        ) : (
          <>
            {/* Hero Section */}
            <div className={`relative h-[300px] bg-gradient-to-br ${study.color} flex items-center justify-center`}>
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">{study.title}</h1>
                <p className="text-xl opacity-90">{study.hero}</p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-8 py-12 bg-white">
              {/* Overview */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-black mb-4">Overview</h2>
                <p className="text-black/70 leading-relaxed">{study.overview}</p>
              </section>

              {/* Project Details */}
              <section className="mb-12 grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-2">Role</h3>
                  <p className="text-black">{study.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-2">Timeline</h3>
                  <p className="text-black">{study.timeline}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-2">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {study.tools.map(tool => (
                      <span key={tool} className="text-xs bg-black/5 text-black/70 px-2 py-1 rounded">{tool}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Challenge */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-black mb-4">The Challenge</h2>
                <p className="text-black/70 leading-relaxed">{study.challenge}</p>
              </section>

              {/* Solution */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-black mb-4">The Solution</h2>
                <p className="text-black/70 leading-relaxed">{study.solution}</p>
              </section>

              {/* Results */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-black mb-6">Results</h2>
                <div className="grid grid-cols-3 gap-4">
                  {study.results.map((result, i) => (
                    <div key={i} className={`p-6 rounded-xl bg-gradient-to-br ${study.color} text-white text-center`}>
                      <p className="text-lg font-semibold">{result}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

// Full Silas Case Study Component
function SilasCaseStudy() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <div className="relative py-20 px-8 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img src={SILAS_ICON} alt="Silas" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Silas: The Integrated AI Companion
          </h1>
          <p className="text-lg text-black/70 leading-relaxed max-w-3xl mx-auto">
            Silas is a smart companion built directly into your phone{"'"}s operating system. Right now, our digital lives are a chore: we constantly hop between a dozen disconnected apps just to plan a single day. Silas fixes this. It securely connects the dots between your calendar, bank, and messages, turning scattered information into helpful, proactive support.
          </p>
        </div>
      </div>

      {/* Project Info */}
      <div className="max-w-4xl mx-auto px-8 py-12 border-b border-black/10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Role</h3>
            <p className="text-black font-medium">Product Designer</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Year</h3>
            <p className="text-black font-medium">2026</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Timeline</h3>
            <p className="text-black font-medium">One month</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Type</h3>
            <p className="text-black font-medium">UX Case Study</p>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-4">Background</h3>
        <p className="text-black/80 leading-relaxed text-lg">
          Eloise spends too much mental energy managing her phone. Her calendar doesn{"'"}t talk to her maps, her weather app doesn{"'"}t talk to her closet, and her bank statements are full of confusing merchant codes. The goal of Silas is to do the heavy lifting for her securely and intuitively.
        </p>
      </div>

      {/* Process Section */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Process</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            This exploration follows the methodology of turning digital breadcrumbs into active assistance.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Observational Analysis</h3>
              <p className="text-black/70 leading-relaxed">
                I analyzed the daily hurdle of &ldquo;app hopping&rdquo; by observing how users like Eloise struggle when their apps fail to communicate. To meet a friend for lunch, she has to check a calendar, open a weather app to see how to dress, and open a map to check traffic. The apps don{"'"}t work together, making her do all the mental math.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Theoretical Scenario Mapping</h3>
              <p className="text-black/70 leading-relaxed">
                I developed the user Eloise to solve a better way. I mapped out her entire day to see exactly where a proactive assistant could step in, save her time, and reduce her stress without being annoying or intrusive.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Logic Architecture</h3>
              <p className="text-black/70 leading-relaxed">
                For Eloise to trust Silas, it has to be secure and technologically realistic. I designed a tiered permission architecture. Silas uses read-only access in the background to safely gather context, like looking at her calendar to notice an upcoming appointment. However, when it is time to take action, Silas temporarily requests execution permissions. It acts as a secure middleman, always requiring Eloise{"'"}s explicit approval before it connects to external APIs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Systemic Problem Solving</h3>
              <p className="text-black/70 leading-relaxed">
                Explored the &ldquo;forgetfulness gap,&rdquo; mapping how a lack of context continuity between apps leads to increased cognitive load for the user.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Features in Silas</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            Instead of waking up and opening five different apps to check her bank, her calendar, and the weather, Eloise opens the Hub.
          </p>

          <div className="space-y-20">
            {/* The Silas Hub */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">The Silas Hub</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                It{"'"}s her &ldquo;Control Center&rdquo;. She sees everything - her money, her orders, and her schedule - in one simple list. It doesn{"'"}t feel like &ldquo;tech&rdquo;; it feels like a calm morning briefing that tells her exactly where her life stands at that moment.
              </p>
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%201-DCyAK5AHlLld0eGIjOCKLL6GQSQLj4.png" alt="Silas Dashboard" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Dashboard</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%204-Pix0MBsuGsLALSeWEW9f9s8ckyw6zK.png" alt="Memory Graph" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Memory Graph</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2049-eWXPE7MhIBYjtU2dTioypBSJ7YLAFu.png" alt="Artifact Recipe" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Artifact</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%205-CoLHjTGJIGVxKq0lDGLNL8rsuaj3Kc.png" alt="Profile Settings" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Profile</p>
                </div>
              </div>
            </div>

            {/* Wardrobe & Weather */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Wardrobe & Weather</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                Eloise sees it{"'"}s going to be a 62F day. Silas already knows what{"'"}s in her closet because it &ldquo;read&rdquo; her past shopping receipts. It suggests a weather-appropriate outfit, highlighting her wide-leg trousers plus backup options. She doesn{"'"}t have to overthink; she just gets dressed and goes.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2044-hjfKPYLluWbP2lMrL8npfvI9wDzWj4.png" alt="Weather Insight" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Weather Insight</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2045-0TAyyhQvFToSEhuW2lis0hG8Wgtf6a.png" alt="Outfit with Receipt" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Pulls Outfit with Digital Receipt</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2046-COrFKfLbKbBu2awRROrZE1CmhOml8A.png" alt="Outfit Suggestion" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Outfit Suggestion</p>
                </div>
              </div>
            </div>

            {/* Time Management */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Time Management</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                She has her daughter{"'"}s recital at 10:00 AM. Silas understands the &ldquo;physical requirement&rdquo; of traveling there. It checks live traffic in the background and pops up at the perfect time, offering to book a rideshare so she isn{"'"}t late.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%206-3BWoc3sGlIiBjCsv7cS7MukzS2JKb5.png" alt="Calendar View" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Dashboard</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2057%20%281%29-Cu9zZu25QBG1eFO1YhOVu3lK9vnkSe.png" alt="Event Details with Ride" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Suggest Rideshare Option</p>
                </div>
              </div>
            </div>

            {/* Financial Intelligence */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Financial Intelligence</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                Eloise opens her bank app. Instead of confusing codes, Silas displays clear digital receipts detailing exactly what she bought. She can re-order items directly from her statement because Silas has turned her transaction history into a shoppable catalog.
              </p>
              <div className="grid grid-cols-5 gap-3 items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%209-quLGPkO6KNBFyQsxFCNpQSYZPmKIfA.png" alt="Bank Overview" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Dashboard</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2010-rwCKLW3zZDHoKKcPMbFsH6UeG52IUz.png" alt="Transaction History" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Transaction History</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2011-IC9n1zWbfj5jyU7kUBFHUrKKeVI0Cn.png" alt="Digital Receipt" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Digital Receipt</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2013-nPCwx99f2gEUc7lsbVvU7H0SD1kUK4.png" alt="Cart" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Cart</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2014%20%281%29-OXKYf0kMTuOWJBYdbnXzpy12kiyUiU.png" alt="Checkout" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Check Out</p>
                </div>
              </div>
            </div>

            {/* Product Intelligence */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Product Intelligence</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                Instead of searching the global internet, she is searching her personal internet. She has a search engine that cuts through the noise and gives her a clear, confident choice.
              </p>
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2065-ocyRHiATuNmFkhHzo61QPbO8UARepe.png" alt="Search Empty State" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Product Search</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2067-mzMNEdzuINot8FvvxbF5EC7aohTEzQ.png" alt="Search Results" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Product Result</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2027-PcN4dIn4xM4ixJizZUBBEwehjepqmK.png" alt="Product Detail" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Suggestion</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2069-l5wXllCRrLE4KeU3EtTeDdwmGDcMwI.png" alt="Ingredient Analysis" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Product Information</p>
                </div>
              </div>
            </div>

            {/* Travel Booking */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Explainable Travel Booking</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                Eloise needs to book a flight. Because Silas understands her habits, it already knows she prefers aisle seats, her frequent flyer number, and her typical budget. Instead of dumping a hundred overwhelming flight options on her, Silas presents the best matches.
              </p>
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2033-P3fqjFVc3EnheB5FOrBsPQztDU8l6G.png" alt="Active Trips" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Dashboard</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2036-o7eNyjMDJOSPhCHXDwl2B5o4wuscqy.png" alt="Preferences" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">User Profile</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2035-eWU7OhpjguXv14rdS2Ory9fIkMjVdX.png" alt="Seat Analysis" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Seat Analysis</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2034-8M9jhf6mWZmXLQF2tpgiEf4ACmo9y6.png" alt="Flight Selection" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Flight Insight</p>
                </div>
              </div>
            </div>

            {/* Juno */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Juno (Contextual Commerce)</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                Eloise is inside her favorite shopping app. Silas surfaces a &ldquo;memory&rdquo; from three days ago - a text from Daniel saying, &ldquo;Hunter is out of dog food.&rdquo; Silas isn{"'"}t interrupting her day; it{"'"}s enhancing her current shopping session.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2030-Ufk6p1qH3uiJ1KqZJgRhvsrF1zih2i.png" alt="Curated for Eloise" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Suggestion</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2047%20%281%29-KQ3MkvZW8wwcuw3jJYlSAYBYG4bPRy.png" alt="Product with Context" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Context</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2032-yueRj2B5riZiLHfqrPI13oDescaphw.png" alt="Evidence Found" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Evidence</p>
                </div>
              </div>
            </div>

            {/* Books */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Silas Books (Theme-Based Discovery)</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                To end her day, Eloise opens Silas Books. The recommendation is another form of &ldquo;evidence.&rdquo; Silas shows her a book not because it{"'"}s a bestseller, but because of a specific sentence she highlighted weeks ago.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2017-vD7J5N5WQLvcYy6tMmCCAoDvPhgtA5.png" alt="Library" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Dashboard</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2018-rtZzFsJ28O39L8eX3CLDF6Eu1UxUum.png" alt="Why This Book" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Suggestion</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2019-v9hgskr7Du3wKiL9bcYrcYYPoBcd96.png" alt="Excerpt Analysis" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Silas Reasoning</p>
                </div>
              </div>
            </div>

            {/* Lost & Found */}
            <div>
              <h3 className="text-2xl font-semibold text-black mb-4">Lost & Found</h3>
              <p className="text-black/70 leading-relaxed mb-8">
                A visual retracing tool that utilizes digital breadcrumbs to solve physical-world problems. If you misplace a physical item, Silas creates a chronological &ldquo;map of presence&rdquo; by merging your location history with your digital interactions.
              </p>
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2037-KeljTUoA1uAKwrfQGClFbh2qr2dmlF.png" alt="Locator Empty" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Search</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2038-doimziRe3RcEQohrjCdlfiDtUsU4hK.png" alt="Locator Keys Selected" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Item Selected</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2039-whUo54tXaqQerB5onNBUTWIds6OVap.png" alt="Floor Map Scanning" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Floor Map Scanning</p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2040-63dYmc1scg8VFvIDMELM1Nd643oDAo.png" alt="Item Detected" className="w-full h-auto" />
                  </div>
                  <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Item Detected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Results</h2>
          <p className="text-black/60 text-center mb-12 max-w-2xl mx-auto">
            The outcomes and achievements of the project, including conceptual validation and theoretical impact.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Conceptual Validation</h3>
              <p className="text-black/70 text-sm">
                Successfully demonstrates how a connected, proactive system can drastically reduce a user{"'"}s mental load.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Context Continuity</h3>
              <p className="text-black/70 text-sm">
                Proves we can speed up a user{"'"}s day without taking away their ability to make their own choices.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-purple-600">Theoretical Impact</h3>
              <p className="text-black/70 text-sm">
                Technology should be an invisible, helpful layer that quietly supports everyday life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 border-t border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-black/40 text-sm">2026 Charity Dupont</p>
        </div>
      </div>
    </div>
  )
}

// Full Meetly Case Study Component
function MeetlyCaseStudy() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <div className="relative py-16 px-8 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl">
            <img src={MEETLY_ICON} alt="Meetly" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">Meetly</h1>
          <p className="text-base text-black/70 leading-relaxed max-w-3xl mx-auto">
            Meetly is a mobile application designed to help social groups coordinate meetups and share schedules effortlessly. It bridges the gap between the organizational power of a calendar and the social ease of a messaging app to eliminate {"\""}coordination fatigue.{"\""}
          </p>
        </div>
      </div>

      {/* Role, Timeline & Goal */}
      <div className="max-w-4xl mx-auto px-8 py-10 border-b border-black/10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Role</h3>
            <p className="text-black font-medium">Co-Product Designer</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Timeline</h3>
            <p className="text-black font-medium">May 2024</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-2">Goal</h3>
            <p className="text-black/80 leading-relaxed">
              To solve the {"\""}hassle and frustration{"\""} users face when juggling busy schedules and conflicting availabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Phase 1: Discovery & User Research */}
      <div className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-black">Phase 1: Discovery & User Research</h2>
          <p className="text-black/60 text-center mb-12 max-w-2xl mx-auto text-sm">
            This project is grounded in primary research to understand the {"\""}why{"\""} behind failed social plans.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">Interviews</h3>
              <p className="text-black/70 text-sm">Conducted 5 in-depth interviews with potential users aged 25-35.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">Target Demographics</h3>
              <p className="text-black/70 text-sm">Users based in Florida, Illinois, North Carolina, and New York.</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">Key Insight: The {"\""}Hangout Fail{"\""}</h3>
              <p className="text-black/70 text-sm">Research revealed that busy work schedules and {"\""}intricate planning{"\""} are the primary causes of failed social events.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">Key Insight: Market Gap</h3>
              <p className="text-black/70 text-sm">Participants noted a complete absence of a tool designed specifically for social coordination rather than business.</p>
            </div>
          </div>

          {/* Competitive Analysis */}
          <h3 className="text-xl font-semibold text-black mb-6 text-center">Competitive Analysis</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h4 className="text-base font-semibold text-indigo-600 mb-2">Instagram</h4>
              <p className="text-black/70 text-sm">Great for visual storytelling and discovery, but has limited link-sharing and lacks direct scheduling features.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h4 className="text-base font-semibold text-indigo-600 mb-2">Google Calendar</h4>
              <p className="text-black/70 text-sm">Strong for managing time and recurring events, but users feel the interface lacks customization and is {"\""}disordered{"\""} for social use.</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Opportunity</h3>
            <p className="text-black/70 text-sm">Build a tool that combines the organizational power of a calendar with the social ease of a messaging app.</p>
          </div>
        </div>
      </div>

      {/* Phase 2: User Persona */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-black">Phase 2: User Persona & Scenario</h2>
          <p className="text-black/60 text-center mb-10 max-w-2xl mx-auto text-sm">
            To humanize the research data, a persona was developed to stress-test the solution.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">The Busy Professional</h3>
              <p className="text-black/70 text-sm">Gina Hargreaves, a 30-year-old Marketing Director.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Pain Points</h3>
              <p className="text-black/70 text-sm">Coordination fatigue and the fear of social disconnection (FOMO) due to work commitments.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Core Need</h3>
              <p className="text-black/70 text-sm">A {"\""}hassle-free{"\""} solution for planning activities in limited free time.</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-black/10 shadow-sm">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%206-ZhAnbMMomKNYq6IDGqTVXQSpImMfcK.jpg" alt="User Persona - Gina Hargreaves" className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Phase 3: Synthesis & Ideation */}
      <div className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-black">Phase 3: Synthesis & Ideation</h2>
          <p className="text-black/60 text-center mb-10 max-w-2xl mx-auto text-sm">
            The Before Synthesization phase involved collecting numerous raw, individual pieces of user feedback, capturing initial pain points and positive experiences. This data was then processed to create the After Synthesization stage, which resulted in consolidated, prioritized, and actionable concepts categorized by their potential impact and complexity.
          </p>

          {/* User Research Synthesis & Feature Prioritization - Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-black mb-4 text-center">User Research Synthesis</h3>
              <div className="rounded-xl overflow-hidden border border-black/10 flex-1 flex items-center justify-center">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ApLgUHySGxYaPLs-5ZFkUdVzlnsmvsq6Vqp0PWKvAcVfQK.png" alt="I Like, I Wish, What If Research Board" className="w-full h-auto object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-black mb-4 text-center">Feature Prioritization</h3>
              <div className="rounded-xl overflow-hidden border border-black/10 flex-1 flex items-center justify-center">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4ZAJu3RfxsHn87J-C40JZ9GtirbtlXMkE0VCQ1jcCnpZ3X.png" alt="Priority Feasibility Matrix" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Key Insight</h3>
              <p className="text-black/70 text-sm">Users appreciate connecting via existing social media platforms and using their own schedules to track plans.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Key Insight</h3>
              <p className="text-black/70 text-sm">Users expressed a need for an {"\""}easier way{"\""} to see friend availability without the {"\""}back and forth{"\""} texting.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Key Insight</h3>
              <p className="text-black/70 text-sm">Users mentioned the idea of adding privacy filters so users can share their calendar without revealing private work details.</p>
            </div>
          </div>

          {/* User Journey */}
          <h3 className="text-lg font-semibold text-black mb-4 text-center">The User Journey</h3>
          <p className="text-black/60 text-center mb-6 text-sm">Storyboarded the transition from {"\""}Texting Frustration{"\""} to {"\""}Meetly Success.{"\""}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h4 className="text-sm font-semibold text-indigo-600 mb-2">Key Insight</h4>
              <p className="text-black/70 text-xs">Gina realizes she hasn{"'"}t seen her friends in a while.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h4 className="text-sm font-semibold text-indigo-600 mb-2">Key Insight</h4>
              <p className="text-black/70 text-xs">They try to coordinate via text, but get {"\""}tired of asking back and forth{"\""} to find a time.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h4 className="text-sm font-semibold text-indigo-600 mb-2">Key Insight</h4>
              <p className="text-black/70 text-xs">By using Meetly, they export their calendars, the app eliminates occupied times, and they easily see when everyone is free.</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-black/10 shadow-sm bg-white">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8DQzUCALXHxbSfU-iN3Pe3zl6xMPnwCcP9vtIQb2ebcDyr.png" alt="User Journey Storyboard" className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Phase 4: Usability Testing */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-black">Phase 4: Usability Testing & Iteration</h2>
          <p className="text-black/60 text-center mb-10 max-w-2xl mx-auto text-sm">
            The design was refined through two recorded user tests to identify navigation friction.
          </p>

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 mb-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Test Objective</h3>
            <p className="text-black/70 text-sm">Assess effectiveness in scheduling a hangout, adding friends, and voting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h3 className="text-sm font-semibold text-green-600 mb-2">Research-Driven Change 1</h3>
              <p className="text-black/70 text-xs">Added Direct Invite Creation after users requested the ability to click a date and create an invite immediately.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h3 className="text-sm font-semibold text-green-600 mb-2">Research-Driven Change 2</h3>
              <p className="text-black/70 text-xs">Adjusted the Logic Flow so event deadlines occur before the occasion.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm">
              <h3 className="text-sm font-semibold text-green-600 mb-2">Research-Driven Change 3</h3>
              <p className="text-black/70 text-xs">Implemented Voting Confirmations to give users clarity that their input was received.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Solution */}
      <div className="py-16 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-black">Final Solution</h2>
          <p className="text-black/60 text-center mb-10 max-w-2xl mx-auto text-sm">
            The complete Meetly experience from personal calendar to group coordination.
          </p>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-xl p-5 text-center border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">The Dashboard</h3>
              <p className="text-black/70 text-xs">A centralized view of scheduled hangouts</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Voting Screen</h3>
              <p className="text-black/70 text-xs">A simplified interface for group decision-making</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center border border-black/5 shadow-sm">
              <h3 className="text-base font-semibold text-indigo-600 mb-2">Contextual Chat</h3>
              <p className="text-black/70 text-xs">Planning-focused messaging that integrates with the calendar</p>
            </div>
          </div>

          {/* App Screens Grid */}
          <div className="grid grid-cols-5 gap-4 mb-10">
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2023-YaC5eUy2iN2JImZekZb30iItst7UyL.png" alt="Home Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Home Screen</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2024-kvBQ0w5m9bcMxJDLYcbuSSVJrEcrPc.png" alt="Hangout Chat" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Hangout Chat</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2025-Y8hW7TmOJfVaW1Iizh9CJkHWFsIeSd.png" alt="Vote Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Vote Screen</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2026-ytP9uUYl1tfuGMTjpRlMvbw57l8wBx.png" alt="Vote Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Vote Screen</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2027-Zx75LyunsQWz207iWPdSipbuqvblvQ.png" alt="Vote Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Vote Screen</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2028-cLMG7tLrO3aQdiYlfASDZRvCUyqBwb.png" alt="Hangout Chat" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Hangout Chat</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2029-APo5XHVqWgkh2mMOv6e2p6mj91YUmK.png" alt="Hangout Chat" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Hangout Chat</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2030-7MAPn6ktJNerulMwPugsHcYNOqgrdA.png" alt="Set Time Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Set Time</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2031-0VLOPEN9C6TZam8ou1yfaXriYe3iON.png" alt="Success Screen" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Success</p>
            </div>
            <div className="text-center">
              <div className="mb-2">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2032-X5DdZgQI5aSWfhkZd9trlhxvPG8ZEU.png" alt="Home Screen End" className="w-full h-auto" />
              </div>
              <p className="text-[10px] text-black/50 uppercase tracking-wider font-medium">Home (End)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Demo Section */}
      <div className="py-12 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4">Experience the Prototype</h3>
          <p className="text-black/60 mb-6">Click below to interact with the Meetly prototype</p>
          <button
            onClick={() => setShowDemo(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Open Demo
          </button>
        </div>
      </div>

      {/* Demo Modal - Full Screen Figma Prototype with Side-by-Side Instructions */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] bg-gray-900 flex">
          {/* Instructions Panel - Left Side */}
          <div className="w-80 bg-white h-full overflow-y-auto flex-shrink-0 border-r border-gray-200">
            <div className="p-6">
              <h4 className="font-semibold text-indigo-600 mb-4 text-lg">Demo Instructions</h4>
              <ol className="text-sm text-black/70 space-y-3 list-decimal list-inside">
                <li>Click the <span className="font-medium">+ (plus)</span> button</li>
                <li>Select <span className="font-medium">Create Hangout</span></li>
                <li>Click on <span className="font-medium">Emily</span> under the &quot;All&quot; category (not Favorites)</li>
                <li>Click <span className="font-medium">Add</span></li>
                <li>Select <span className="font-medium">Group Name</span></li>
                <li>Click the <span className="font-medium">keyboard</span></li>
                <li>Click <span className="font-medium">Show Availability Only</span></li>
                <li>Click <span className="font-medium">Create</span></li>
                <li>Click the text box to open messages</li>
                <li>Review messages (last one says: &quot;How about we do sometime next month&quot;)</li>
                <li>Click the <span className="font-medium">keyboard</span></li>
                <li>Open the <span className="font-medium">Calendar</span></li>
                <li>Click the <span className="font-medium">Chevron (&gt;)</span> to move to January 2025</li>
                <li>Select <span className="font-medium">January 17</span></li>
                <li>Click <span className="font-medium">Vote</span></li>
                <li>Click <span className="font-medium">Confirm</span></li>
                <li>Close the calendar</li>
                <li>You&apos;ll see: &quot;Vote Pending – James has not voted yet&quot;</li>
                <li>Click <span className="font-medium">Cancel</span></li>
                <li>Click <span className="font-medium">Yes, Notify</span></li>
                <li>A new message from James appears in Messages</li>
                <li>Open the <span className="font-medium">Calendar</span></li>
                <li>Click <span className="font-medium">Close Calendar</span></li>
                <li>Click <span className="font-medium">Confirm</span></li>
                <li>Click <span className="font-medium">Set Time</span></li>
                <li>Select <span className="font-medium">Schedule with Suggested Time</span></li>
                <li>Click <span className="font-medium">Save the Date</span></li>
                <li>Click <span className="font-medium">Confirm</span></li>
                <li>Final result: the scheduled event appears on the calendar</li>
              </ol>
            </div>
          </div>

          {/* Figma Prototype - Right Side */}
          <div className="flex-1 relative">
            <iframe
              src="https://embed.figma.com/proto/PCUGC6wiSuEzlpmept0ybQ/Meetly-Official-Prototye?node-id=2002-143&scaling=scale-down&page-id=0%3A1&hide-ui=1&embed-host=share&hotspot-hints=0"
              className="w-full h-full border-0"
              allowFullScreen
            />
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="py-8 border-t border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-black/40 text-xs">2026 Charity Dupont</p>
        </div>
      </div>
    </div>
  )
}

// Teammate Case Study Component
function TeammateCaseStudy() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section with GIF */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-white overflow-hidden pt-16 pb-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 px-8 max-w-5xl mx-auto">
          {/* App Preview */}
          <div className="w-56 flex-shrink-0">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-CrKpENIJ1QkNGw5Ph7xHp3T8f3pYSc.png" alt="Teammate App Preview" className="w-full h-auto block drop-shadow-2xl" />
          </div>

          {/* Hero Text */}
          <div className="text-center md:text-left">
            <div className="w-16 h-16 mb-6 rounded-2xl overflow-hidden mx-auto md:mx-0">
              <img src={TEAMMATE_ICON} alt="Teammate" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#D85A5A]">
              Teammate
            </h1>
            <p className="text-2xl text-black/80 font-medium mb-4">{"\""}Don{"'"}t Play Alone{"\""}</p>
            <p className="text-lg text-black/60 leading-relaxed max-w-xl">
              Sports fans face challenges on regular dating apps. Our app connects them with like-minded individuals, assists in organizing dates based on mutual sports interests, and offers secure public venues such as sports events for fostering genuine relationships.
            </p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Role</h3>
              <p className="text-black/80 text-sm">Product Designer</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Year</h3>
              <p className="text-black/80 text-sm">2024</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Timeline</h3>
              <p className="text-black/80 text-sm">One month</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Type</h3>
              <p className="text-black/80 text-sm">UX Case Study</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Competition */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">The Competition</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/classic-bumble-logo-editable-and-for-tech-branding-and-creative-design-free-png-GQUpsWRD0QoLNqhIzdRe2J51TYAH7o.webp" alt="Bumble" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-600">Bumble</h3>
              </div>
              <div className="mb-4">
                <p className="text-sm text-green-600 mb-1">Pros:</p>
                <p className="text-black/70 text-sm">Inclusive, user-friendly, women initiate.</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Cons:</p>
                <p className="text-black/70 text-sm">High competition, conversation fatigue.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tinder-app-logo-tinder-app-logo-transparent-tinder-app-icon-transparent-free-free-png-PDRTDpNBdjoBo1j4DFXEHy6P36zP0Y.webp" alt="Tinder" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-red-500">Tinder</h3>
              </div>
              <div className="mb-4">
                <p className="text-sm text-green-600 mb-1">Pros:</p>
                <p className="text-black/70 text-sm">Global reach, massive user base, simple interface.</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Cons:</p>
                <p className="text-black/70 text-sm">Reputation for casual dating, shallow connections.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hinge-white-logo-icon-clean-with-transparent-background-for-ui-use-free-png-x8G86pfW3DS0MPdgJKfUAix4t3nz4e.webp" alt="Hinge" className="w-8 h-8 object-contain" />
                </div>
                <h3 className="text-xl font-semibold text-black">Hinge</h3>
              </div>
              <div className="mb-4">
                <p className="text-sm text-green-600 mb-1">Pros:</p>
                <p className="text-black/70 text-sm">Quality over quantity, detailed profiles.</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Cons:</p>
                <p className="text-black/70 text-sm">Slower matching, limited visibility for new users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Persona */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">User Persona</h2>

          <p className="text-2xl text-black/80 italic text-center mb-12 max-w-3xl mx-auto">
            {"\""}Dating would be so much better if I could find someone who shares my love for sports.{"\""}
          </p>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Photo and Info */}
            <div className="flex-shrink-0 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-64 h-72 rounded-lg overflow-hidden border-4 border-white">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5596c2979c96a2539e3168b8a3ac2bdfc26c3f84-mA8gGyFSaJVUWN1jUAVKb37z4yDtHr.png" alt="Hunter Fielding" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#001A57] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-white text-2xl font-bold">D</span>
                    <p className="text-white text-[6px] uppercase tracking-wider">Football</p>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mt-6">Hunter Fielding</h3>
              <p className="text-black/60 text-sm mt-2">Age / 36</p>
              <p className="text-black/60 text-sm">Occupation / Director of design marketing</p>
              <p className="text-black/60 text-sm">for Duke University football athletics</p>
              <p className="text-black/60 text-sm">Location / Durham, NC</p>
            </div>

            {/* Goals and Pain Points */}
            <div className="flex-1">
              <p className="text-black/80 mb-8 leading-relaxed">
                Hunter is a successful marketing professional at Duke University. He is passionate about college football and supporting his local teams. While his career is fulfilling, he seeks a partner who shares his love for sports and the excitement of game day.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-black mb-4">Goals & Needs</h4>
                  <ul className="space-y-3 text-black/70 text-sm">
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Easily connect with others who share his passion for sports.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Attend games and events with a like-minded partner.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Connect with fellow sports enthusiasts, especially Duke fans.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Use a convenient platform that facilitates connections with fellow sports fans.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Ensure first dates are engaging and centered around shared interests.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-4">Hesitation & Pain Points</h4>
                  <ul className="space-y-3 text-black/70 text-sm">
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Struggles to find people who share his passion for sports on traditional dating apps.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Pressed for time due to a demanding job, limiting opportunities to meet new people.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Finds it challenging to plan dates that align with his sports interests.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-black">{"•"}</span>
                      <span>Feels frustrated with the lack of connections that understand his enthusiasm for sports.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Research */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">User Research</h2>
          <p className="text-black/60 text-center mb-16">5 Interviewees (Aged 26-45+) | 3 Key Insight Cards</p>

          <div className="space-y-6">
            <div className="bg-rose-50 rounded-2xl p-8 border border-rose-100">
              <h3 className="text-xl font-semibold text-[#D85A5A] mb-4">The Character Proxy</h3>
              <p className="text-black/60 text-sm mb-2">Observation:</p>
              <p className="text-black/70 mb-4">Users seek partners with a sports background because they associate it with positive qualities like {"\""}teamwork and determination.{"\""}</p>
              <p className="text-black/60 text-sm mb-2">Design Implication:</p>
              <p className="text-black/70">Profiles prioritize {"\""}Sports Background{"\""} to signal these character traits early.</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">The {"\""}Newbie{"\""} Opportunity</h3>
              <p className="text-black/60 text-sm mb-2">Observation:</p>
              <p className="text-black/70 mb-4">Users are {"\""}open to trying new sports,{"\""} especially if guided by an enthusiastic partner.</p>
              <p className="text-black/60 text-sm mb-2">Design Implication:</p>
              <p className="text-black/70">The app shouldn{"'"}t just match experts; it should facilitate {"\""}learning{"\""} dates between die-hards and newbies.</p>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-semibold text-green-600 mb-4">Safety & Depth</h3>
              <p className="text-black/60 text-sm mb-2">Observation:</p>
              <p className="text-black/70 mb-4">Users find current dating apps {"\""}lacking in depth and safety.{"\""}</p>
              <p className="text-black/60 text-sm mb-2">Design Implication:</p>
              <p className="text-black/70">We focused on organizing dates in {"\""}secure public venues such as sports events{"\""} to alleviate safety concerns.</p>
            </div>
          </div>

          <div className="mt-12 bg-neutral-100 rounded-2xl p-8 border border-black/5 text-center">
            <p className="text-black/80 text-lg italic leading-relaxed">
              {"\""}While competitors focus on static personality traits, no current app solves the dynamic scheduling conflicts sports fans face. Teammate fills this gap by making the {"'"}Game Schedule{"'"} the catalyst for the connection.{"\""}
            </p>
          </div>
        </div>
      </div>

      {/* Ideation and Process */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Ideation and Process</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            We used the {"'"}I Like, I Wish, What If{"'"} method to brainstorm solutions.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">What If</h3>
              <p className="text-black/70">Users seek partners with a sports background because they associate it with positive qualities like {"\""}teamwork and determination.{"\""} Profiles prioritize {"\""}Sports Background{"\""} to signal these character traits early.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-yellow-600 mb-3">I Wish</h3>
              <p className="text-black/70">Users are {"\""}open to trying new sports,{"\""} especially if guided by an enthusiastic partner. The app should facilitate {"\""}learning{"\""} dates between die-hards and newbies.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-green-600 mb-3">The Pivot</h3>
              <p className="text-black/70">Users find current dating apps {"\""}lacking in depth and safety.{"\""} We focused on organizing dates in {"\""}secure public venues such as sports events{"\""} to alleviate safety concerns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refining the Experience */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Refining the Experience</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            Would users successfully discover and plan sports events with a match?
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-[#D85A5A] mb-3">Visual Clarity</h3>
              <p className="text-black/70 text-sm">Users were confused by the color coding of the Heart vs. X buttons, so we refined the contrast.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-[#D85A5A] mb-3">Onboarding</h3>
              <p className="text-black/70 text-sm">Users wanted to skip the {"\""}upload image{"\""} step if they weren{"'"}t ready, so we added flexibility.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h3 className="text-lg font-semibold text-[#D85A5A] mb-3">Interaction</h3>
              <p className="text-black/70 text-sm">The {"\""}dictation button{"\""} was hard to find, so we improved the input field layout.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Solution - High Fidelity Mockups */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Final Solution</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            High-fidelity screens showcasing the complete Teammate experience.
          </p>

          {/* All Screens - 3x3 Grid */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-CrKpENIJ1QkNGw5Ph7xHp3T8f3pYSc.png" alt="Splash Screen" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Splash</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2012-icLvnxmHlb92OGRKo9D0O1WHZdvArb.png" alt="Home Events" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Home</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2021-RrPHoCUYlabu00xhzKPVEwBgjLsBSR.png" alt="Potential Matches" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Matches</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2022-qH8EpKsSi9iyAmMV7ok2Rv6nsbllzI.png" alt="Matched Screen" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Matched</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2015-rFXMnhU5fddwskSbSnrkNYmoUM0o3O.png" alt="Messages List" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Messages</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2027-F0qbCMbalUtdrcyRX4qUp5FDVEmk3a.png" alt="Chat Conversation" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Chat</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2023-qoDUhBfWLpQ7CPJGik2sl9WOvsmhr0.png" alt="Schedule a Date" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Schedule</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2024-tHJPUnwvCOwQMV11nvzXN6J61JF2eH.png" alt="Ticket Purchase" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Purchase</p>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2026-XPpU77QCL4TMfc1SYvQdSGJNuSfdNP.png" alt="Confirmation" className="w-full h-auto" />
              </div>
              <p className="text-xs text-black/50 uppercase tracking-wider font-medium">Confirmation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Ideas */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Future Ideas</h2>
          <p className="text-black/60 text-center mb-16 max-w-2xl mx-auto">
            With limited time and unlimited imagination, we had a lot of ideas that had to be shelved to implement in the future.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#D85A5A] rounded-2xl p-8 text-center text-white">
              <h3 className="text-lg font-semibold mb-3">Virtual Viewing</h3>
              <p className="text-white/90 text-sm">Implementing a live stream option to watch games together virtually.</p>
            </div>
            <div className="bg-[#D85A5A] rounded-2xl p-8 text-center text-white">
              <h3 className="text-lg font-semibold mb-3">Community</h3>
              <p className="text-white/90 text-sm">Expanding beyond dating to find platonic friends and local fanbases.</p>
            </div>
            <div className="bg-[#D85A5A] rounded-2xl p-8 text-center text-white">
              <h3 className="text-lg font-semibold mb-3">Dynamic UI</h3>
              <p className="text-white/90 text-sm">Changing the display colors to represent the fanbase the user is currently swiping on.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 border-t border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-black/40 text-sm">2026 Charity Dupont</p>
        </div>
      </div>
    </div>
  )
}
