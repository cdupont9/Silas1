'use client'

import { useState, useRef, useEffect } from 'react'

const MEMOJI_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4110-E2fYwoTlD9Gx8uziQPBMJ46UxlVNiL.PNG"

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
}

// Knowledge base for Charity's responses
const getCharityResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()
  
  // Greetings
  if (msg.match(/^(hi|hello|hey|sup|what'?s up|howdy)/)) {
    return "Hey there! Great to meet you! I'm Charity, a UX Designer currently at Google. Feel free to explore my portfolio and ask me anything about my work or background!"
  }
  
  // About/Who are you
  if (msg.match(/(who are you|about you|tell me about yourself|introduce yourself)/)) {
    return "I'm Charity Dupont, a UX Designer at Google based in New York City. I'm passionate about creating meaningful digital experiences that actually help people. I have a background in software development which gives me a unique perspective on bridging design and engineering. Outside of work, I love traveling, tennis, and spending time in nature!"
  }
  
  // Current role/job
  if (msg.match(/(where do you work|current job|what do you do|your role|at google)/)) {
    return "I'm currently a UX Designer at Google, where I work on creating intuitive and impactful user experiences. Before Google, I worked at Meta and IBM. I love being able to design at scale and see my work impact millions of users!"
  }
  
  // Experience/Background
  if (msg.match(/(experience|background|career|resume|cv|work history)/)) {
    return "I've had an exciting career journey! I started as a software developer, which gave me strong technical foundations. Then I transitioned into UX design because I wanted to focus more on the human side of technology. I've worked at IBM, Meta, and now Google. I also have a Master's in Human-Computer Interaction from Georgia Tech."
  }
  
  // Education
  if (msg.match(/(education|school|degree|university|college|georgia tech|study|studied)/)) {
    return "I have a Master's degree in Human-Computer Interaction from Georgia Tech, and I studied Computer Science for my undergrad at Spelman College. The combination of technical and design education has been invaluable in my career!"
  }
  
  // Skills
  if (msg.match(/(skills|tools|software|figma|design tools)/)) {
    return "I'm proficient in Figma, Sketch, Adobe Creative Suite, and prototyping tools like Principle and ProtoPie. On the technical side, I know HTML, CSS, JavaScript, and React. I also have experience with user research methods, usability testing, and data analysis."
  }
  
  // Projects/Portfolio/Case Studies
  if (msg.match(/(project|portfolio|case stud|work samples|teammate|meetly|silas)/)) {
    return "I have three main case studies you can explore:\n\n• Teammate - A dating app for sports fans to connect over shared interests\n• Meetly - A scheduling and meeting management platform\n• Silas - A project I'm really proud of\n\nYou can click on the folders on the desktop or in the Case Studies folder to see the full details of each project!"
  }
  
  // Teammate specific
  if (msg.match(/teammate/)) {
    return "Teammate is a dating app designed specifically for sports fans! The idea came from recognizing that sports fans face challenges on regular dating apps. Teammate connects them with like-minded individuals, assists in organizing dates based on mutual sports interests, and offers secure public venues like sports events for fostering genuine relationships. Check out the full case study by clicking on the Teammate folder!"
  }
  
  // Design process
  if (msg.match(/(design process|how do you design|methodology|approach)/)) {
    return "My design process typically involves: 1) Research & Discovery - understanding users and the problem space, 2) Ideation - sketching and brainstorming solutions, 3) Prototyping - creating interactive mockups, 4) Testing - validating designs with real users, and 5) Iteration - refining based on feedback. I believe in being data-informed but not data-driven!"
  }
  
  // Contact/Hire/Email
  if (msg.match(/(contact|email|hire|reach|connect|linkedin)/)) {
    return "I'd love to connect! You can reach me at charitydupont@gmail.com or find me on LinkedIn. I'm always open to discussing new opportunities, collaborations, or just chatting about design!"
  }
  
  // Location
  if (msg.match(/(where.*live|location|based|city|new york)/)) {
    return "I'm based in New York City! I love the energy here and the amazing design community. The city has so many opportunities for creative inspiration."
  }
  
  // Hobbies/Interests
  if (msg.match(/(hobby|hobbies|fun|free time|interests|outside work)/)) {
    return "Outside of design, I love traveling and exploring new places, playing tennis, hiking and being in nature, and trying out new restaurants. I also enjoy reading about psychology and human behavior - it definitely influences my design work!"
  }
  
  // Why UX/Design
  if (msg.match(/(why ux|why design|passion|love about|what drives)/)) {
    return "I love UX design because it lets me combine creativity with problem-solving to make a real impact on people's lives. There's something magical about understanding a user's pain point and then designing a solution that makes their experience better. Every project is a new puzzle to solve!"
  }
  
  // Advice
  if (msg.match(/(advice|tip|recommend|suggestion|getting started|break into)/)) {
    return "My biggest advice for aspiring designers: 1) Build a strong portfolio with real projects, 2) Learn to articulate your design decisions, 3) Get comfortable with feedback and iteration, 4) Understand the basics of development, and 5) Never stop being curious about how people think and behave!"
  }

  // MacBook/Portfolio navigation
  if (msg.match(/(macbook|navigate|explore|what can i|where should|how do i)/)) {
    return "Great question! On this MacBook you can:\n\n• Click the folders on the desktop (Teammate, Meetly, Silas) to view my case studies\n• Open the Photos app to see some of my photography\n• Check out the Notes app for more info\n• Click on the case study contacts in this Messages app to learn about each project\n\nFeel free to explore around!"
  }
  
  // Thank you
  if (msg.match(/(thank|thanks|appreciate)/)) {
    return "You're so welcome! It was great chatting with you. Feel free to reach out anytime, and don't forget to explore the rest of my portfolio!"
  }
  
  // Default response
  return "That's a great question! I'd be happy to tell you more about my work, background, or any of my case studies. You can also explore my portfolio by clicking around the MacBook - check out the project folders on the desktop or browse through the apps in the dock!"
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function CharityChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hey! Welcome to my portfolio on my MacBook!",
      time: getCurrentTime(),
    },
    {
      id: 'welcome-2', 
      role: 'assistant',
      text: "Feel free to explore around - check out my Projects on the desktop or click on any of my case study folders below.",
      time: getCurrentTime(),
    },
    {
      id: 'welcome-3',
      role: 'assistant',
      text: "I'm a UX Designer passionate about creating meaningful digital experiences. Feel free to ask me anything!",
      time: getCurrentTime(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input.trim(),
      time: getCurrentTime(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const response = getCharityResponse(userMessage.text)
    
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response,
      time: getCurrentTime(),
    }
    
    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="h-12 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-black/5 flex items-center justify-center px-4 shrink-0">
        <span className="text-[13px] font-medium text-black/80">Charity</span>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className={`max-w-[70%] ${message.role === 'assistant' ? 'self-start' : 'self-end'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-end gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0">
                    <img src={MEMOJI_URL} alt="Charity" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className={`rounded-2xl px-4 py-2 ${message.role === 'assistant' ? 'bg-[#e9e9eb] text-black' : 'bg-blue-500 text-white'}`}>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
              <span className={`text-[10px] text-black/40 mt-1 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col">
            <div className="max-w-[70%] self-start">
              <div className="flex items-end gap-2 mb-1">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0">
                  <img src={MEMOJI_URL} alt="Charity" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#e9e9eb]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-black/5 shrink-0">
        <div className="bg-[#f5f5f7] rounded-full px-4 py-2 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Message" 
            className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
