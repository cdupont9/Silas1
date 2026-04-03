'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
}

// Knowledge base for Charity's responses - based on actual info
const getCharityResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()
  
  // Simple greetings
  if (msg.match(/^(hi|hello|hey|sup|what'?s up|howdy|yo)$/i) || msg.match(/^(hi|hello|hey)\s*[!.?]*$/i)) {
    return "Hey! Great to meet you."
  }
  
  // How are you
  if (msg.match(/(how are you|how's it going|how you doing)/)) {
    return "I'm doing well, thanks for asking! How can I help you today?"
  }
  
  // Name
  if (msg.match(/^what'?s your name\??$/i) || msg.match(/^who are you\??$/i)) {
    return "I'm Charity, a UX Designer at Google."
  }
  
  // About/Tell me about yourself
  if (msg.match(/(tell me about yourself|about you|introduce yourself)/)) {
    return "I'm a UX/UI designer at Google focused on AI-assisted, high-stakes experiences. I design systems that help users navigate complexity with clarity and confidence."
  }
  
  // Current role/job - simple
  if (msg.match(/^(where do you work|what do you do)\??$/i)) {
    return "I'm a UX Designer at Google."
  }
  
  // Current role - more detail
  if (msg.match(/(your role|at google|what.*work on|job)/)) {
    return "I work within Google DeepMind, focused on AI UX. I design agent-assisted and high-stakes experiences where clarity and trust really matter."
  }
  
  // Why UX
  if (msg.match(/(why ux|why design|get into ux|got into)/)) {
    return "I'm drawn to UX because it combines problem-solving with human understanding. I enjoy thinking through systems and figuring out how to make things clearer and more intuitive."
  }
  
  // Origin story / How did you get into UX
  if (msg.match(/(how did you|your story|your journey|start|began|background)/)) {
    return "I got into UX unexpectedly. During COVID, my mom volunteered me to build a website for a client - I had no idea what I was doing. That experience sparked my interest. I later pursued it through a bootcamp at Columbia while teaching, which led me to where I am today."
  }
  
  // Previous job / Teaching
  if (msg.match(/(previous|before|teacher|teaching|used to do)/)) {
    return "I was previously a 4th grade teacher at Metuchen Christian Academy in New Jersey."
  }
  
  // Education
  if (msg.match(/(education|school|degree|university|college|study|studied|columbia)/)) {
    return "I studied Psychology at New Jersey City University and completed a UX/UI Bootcamp at Columbia University."
  }
  
  // Location - simple
  if (msg.match(/^where.*(?:live|based|from)\??$/i)) {
    return "I'm based in New York, currently living in New Jersey."
  }
  
  // Location - more detail
  if (msg.match(/(location|relocat|remote|hybrid)/)) {
    return "I'm based in New York/New Jersey. I'm open to relocation and remote work. Currently I work a hybrid schedule, going into the office 2-3 days a week."
  }
  
  // Born / Chicago
  if (msg.match(/(born|chicago|grew up|originally)/)) {
    return "I was born in Chicago and moved to the New York/New Jersey area in 2005 when I was 10."
  }
  
  // Family - simple
  if (msg.match(/^(family|siblings)\??$/i)) {
    return "It's just me and my mom. We're very close."
  }
  
  // Mom
  if (msg.match(/(mom|mother|parent)/)) {
    return "My mom and I are very close. She's actually the one who encouraged me to get into UX - she volunteered me to build that first website!"
  }
  
  // Dad (sensitive)
  if (msg.match(/(dad|father)/)) {
    return "My dad passed away when I was 13. It's just been my mom and me since then."
  }
  
  // Siblings
  if (msg.match(/(brother|sister|sibling)/)) {
    return "No, I don't have any siblings."
  }
  
  // Pet / Dog
  if (msg.match(/(pet|dog|dalmatian|hunter)/)) {
    return "I have a Dalmatian named Hunter. He's 2 years old and has liver spots - brown instead of black. I spend a lot of time with him."
  }
  
  // Relationship status
  if (msg.match(/(married|single|dating|relationship|boyfriend|girlfriend)/)) {
    if (msg.match(/married/)) return "No, I'm not married."
    if (msg.match(/single/)) return "Yes, I'm single."
    if (msg.match(/kid|children/)) return "No, I don't have kids."
    return "I tend to keep that part of my life private."
  }
  
  // Kids
  if (msg.match(/(kid|children)/)) {
    return "No, I don't have kids."
  }
  
  // Hobbies - simple
  if (msg.match(/^(hobbies|interests)\??$/i)) {
    return "I enjoy spending time with my dog Hunter, quality time with my mom, and watching good TV shows."
  }
  
  // Hobbies - more detail
  if (msg.match(/(hobby|hobbies|fun|free time|interests|outside work|weekend)/)) {
    return "I spend a lot of time with my Dalmatian Hunter, enjoy quality time with my mom, and love discovering good TV shows. Saturdays are for rest and recharge, Sundays for church and rest."
  }
  
  // TV / Shows
  if (msg.match(/(tv|show|watch|netflix|movie)/)) {
    return "I prefer TV shows over movies. My favorite show is Emily in Paris - I enjoy visually rich and engaging storytelling."
  }
  
  // Music
  if (msg.match(/(music|listen|song|artist|jazz)/)) {
    return "I listen to jazz while working - Miles Davis, Kenny G, Joshua Redman. I also enjoy classical and pretty much all genres. I'm nostalgic for early 2000s music."
  }
  
  // Food
  if (msg.match(/(food|eat|favorite meal|restaurant|cook)/)) {
    return "My favorite meal is lamb chops with fig jam. For dessert, apple pie with vanilla bean ice cream. My favorite restaurant is Broadway Chicken in Westfield - their honey chicken is amazing."
  }
  
  // Cookies
  if (msg.match(/(cookie|dessert|sweet)/)) {
    return "My favorite cookies are white chocolate chip - no macadamia though!"
  }
  
  // Color
  if (msg.match(/(color|colour)/)) {
    return "Pink is my favorite color."
  }
  
  // Birthday
  if (msg.match(/(birthday|born|age)/)) {
    return "My birthday is May 25th."
  }
  
  // Skills / Tools
  if (msg.match(/(skills|tools|software|figma)/)) {
    return "I work with standard design tools like Figma. My real strength is in systems thinking - structuring complex workflows into clear, usable flows."
  }
  
  // Strengths
  if (msg.match(/(strength|good at|best at)/)) {
    return "I advocate strongly for users, especially those who feel overlooked. I design for clarity in complex systems and bring structure to ambiguity."
  }
  
  // How do you work
  if (msg.match(/(how.*work|process|approach|methodology)/)) {
    return "I'm highly iterative - I refine until things feel clear and intentional. I focus on flows, edge cases, and structure, not just UI. I design systems, not just screens."
  }
  
  // Feedback
  if (msg.match(/(feedback|criticism|review)/)) {
    return "I listen first and take notes. I process feedback before reacting and evaluate it in context of the product and user needs. I respond thoughtfully rather than immediately."
  }
  
  // Team / Culture
  if (msg.match(/(team|culture|environment|collaborate)/)) {
    return "I thrive in structured environments with clear systems. I value thoughtful decision-making over speed for the sake of speed, and environments where user advocacy is taken seriously."
  }
  
  // Projects/Case Studies - simple
  if (msg.match(/^(projects|portfolio|case stud)/i)) {
    return "I have three case studies you can explore: Teammate, Meetly, and Silas. Click the folders on the desktop to view them!"
  }
  
  // Teammate
  if (msg.match(/teammate/)) {
    return "Teammate is a dating app for sports fans. It connects them with like-minded individuals and helps organize dates around mutual sports interests. Check out the full case study by clicking the Teammate folder!"
  }
  
  // Meetly
  if (msg.match(/meetly/)) {
    return "Meetly is a scheduling and meeting management platform I designed. Click the Meetly folder on the desktop to see the full case study!"
  }
  
  // Silas
  if (msg.match(/silas/)) {
    return "Silas is my most recent case study - it's an AI companion project. Click the Silas folder to explore it!"
  }
  
  // What makes you a strong candidate
  if (msg.match(/(strong candidate|hire you|why should)/)) {
    return "I don't just focus on making things look good - I focus on making them make sense. I'm strong at breaking down complex systems into clear, usable experiences."
  }
  
  // Fun facts / childhood
  if (msg.match(/(fun fact|cool|interesting|childhood|young)/)) {
    return "When I was younger, I used to make movies in Windows Movie Maker! I'd put pictures together for my mom. Even in middle school, I made fancy backgrounds for my assignments - I guess I was into design before I knew it had a name."
  }
  
  // Career aspirations
  if (msg.match(/(wanted to be|dream|aspir)/)) {
    return "Growing up I wanted to be a chef, ballet dancer, writer, and music artist. Life takes you in interesting directions!"
  }
  
  // Contact
  if (msg.match(/(contact|email|reach|connect|linkedin|hire)/)) {
    return "Feel free to reach out! You can find my contact information in the portfolio."
  }
  
  // MacBook/Navigation
  if (msg.match(/(macbook|navigate|explore|what can i|where should|how do i|click|folder)/)) {
    return "You can click the folders on the desktop to view my case studies - Teammate, Meetly, and Silas. Feel free to explore the other apps in the dock too!"
  }
  
  // Thank you
  if (msg.match(/(thank|thanks|appreciate)/)) {
    return "You're welcome! Feel free to ask if you have any other questions."
  }
  
  // Bye/Goodbye
  if (msg.match(/(bye|goodbye|see you|take care)/)) {
    return "Take care! Thanks for stopping by my portfolio."
  }
  
  // Default - keep it simple
  return "Feel free to ask me about my work, background, or case studies. You can also explore by clicking around the desktop!"
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function CharityChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hey! Welcome to my portfolio on my MacBook.",
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
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600))
    
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
    <div className="flex-1 flex flex-col bg-white min-h-0">
      {/* Chat Header */}
      <div className="h-12 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-black/5 flex items-center justify-center px-4 shrink-0">
        <span className="text-[13px] font-medium text-black/80">Charity</span>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className={`max-w-[70%] ${message.role === 'assistant' ? 'self-start' : 'self-end'}`}>
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
