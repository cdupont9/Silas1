'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
}

const getCharityResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase().trim()
  
  // Simple greetings
  if (msg.match(/^(hi|hello|hey|sup|yo|howdy)[\s!.?]*$/i)) {
    return "Hey! Great to meet you."
  }
  
  // How are you
  if (msg.match(/^(how are you|how's it going|how you doing|what's up)[\s!?.]*$/i)) {
    return "Doing well, thanks! How can I help?"
  }
  
  // Name
  if (msg.match(/^what'?s your name\??$/i) || msg.match(/^who are you\??$/i) || msg === 'name') {
    return "Charity."
  }
  
  // Full name
  if (msg.match(/full name/)) {
    return "Charity Dupont."
  }
  
  // What do you do
  if (msg.match(/^what do you do\??$/i)) {
    return "I'm a UX Designer."
  }
  
  // Where do you work
  if (msg.match(/^where do you work\??$/i) || msg.match(/^where.*you.*work/i)) {
    return "Google."
  }
  
  // About/Tell me about yourself
  if (msg.match(/(tell me about yourself|about you|introduce yourself|who is charity)/)) {
    return "I'm a UX Designer focused on AI-assisted experiences where clarity and trust really matter. I design systems that help people navigate complex workflows with confidence."
  }
  
  // Current role details
  if (msg.match(/(your role|your job|at google|work.*on|day to day|daily)/)) {
    return "I design AI-assisted experiences - thinking through how AI shows up, when it steps in, and how it communicates intuitively."
  }
  
  // Why UX
  if (msg.match(/(why ux|why design|love about|enjoy about)/)) {
    return "I love designing products that help people think more clearly, especially as AI becomes more embedded in everyday tools."
  }
  
  // How did you get into UX
  if (msg.match(/(how did you|get into|your story|your journey|start.*ux|background|path)/)) {
    return "In 2020 during COVID, my mom volunteered me to build a website. I had no clue what I was doing but figured it out. I was teaching 4th grade at the time, but that sparked my interest. Did a bootcamp at Columbia, and here I am."
  }
  
  // Teaching
  if (msg.match(/(previous|before|teacher|teaching|used to|taught)/)) {
    return "I was a 4th grade teacher before UX."
  }
  
  // Education
  if (msg.match(/(education|school|degree|university|college|study|studied|columbia|njcu)/)) {
    return "Psychology at NJCU, UX/UI Bootcamp at Columbia."
  }
  
  // Where do you live
  if (msg.match(/^where.*(?:live|based|located)\??$/i) || msg === 'location') {
    return "New Jersey."
  }
  
  // Where are you from
  if (msg.match(/(where.*from|born|chicago|originally|grew up)/)) {
    return "Born in Chicago, moved to New Jersey when I was 10."
  }
  
  // Remote/relocation
  if (msg.match(/(relocat|remote|hybrid|office)/)) {
    return "Open to relocation and remote. Currently hybrid - 2 to 3 days in office."
  }
  
  // Family
  if (msg.match(/^family\??$/i)) {
    return "My mom and our dog Hunter."
  }
  
  // Mom
  if (msg.match(/(mom|mother)/)) {
    return "My mom and I are close. She's the one who encouraged me to pursue UX."
  }
  
  // Dad
  if (msg.match(/(dad|father)/)) {
    return "My dad passed when I was 13."
  }
  
  // Siblings
  if (msg.match(/(sibling|brother|sister)/)) {
    return "No siblings."
  }
  
  // Pet / Dog
  if (msg.match(/(pet|dog|dalmatian|hunter)/)) {
    return "I have a Dalmatian named Hunter - he's 2 with liver spots."
  }
  
  // Married
  if (msg.match(/married/)) {
    return "No."
  }
  
  // Dating/relationship - redirect professionally
  if (msg.match(/(single|dating|relationship|boyfriend|girlfriend|seeing anyone|love life)/)) {
    return "That's a bit personal - happy to share more about my work or background though!"
  }
  
  // Kids
  if (msg.match(/(kid|children)/)) {
    return "No kids."
  }
  
  // Age/birthday
  if (msg.match(/(age|old are you|birthday|birth)/)) {
    return "May 25th."
  }
  
  // Favorite color
  if (msg.match(/(favorite )?colou?r/)) {
    return "Pink."
  }
  
  // Hobbies
  if (msg.match(/^hobbies\??$/i) || msg.match(/^interests\??$/i)) {
    return "Time with Hunter, my mom, and good shows."
  }
  
  // Free time
  if (msg.match(/(passion|outside work|free time|fun|weekend)/)) {
    return "Hunter, family time, and finding good shows to watch."
  }
  
  // TV/Shows
  if (msg.match(/(tv|show|watch|netflix|favorite show)/)) {
    return "Emily in Paris is my favorite."
  }
  
  // Movies
  if (msg.match(/movie/)) {
    return "I prefer shows over movies."
  }
  
  // Music
  if (msg.match(/(music|listen|song|artist|jazz|playlist)/)) {
    return "Jazz while working - Miles Davis, Kenny G. Also into early 2000s music."
  }
  
  // Food
  if (msg.match(/(food|eat|meal|restaurant|hungry|favorite food)/)) {
    return "Lamb chops with fig jam. Apple pie with vanilla bean ice cream for dessert."
  }
  
  // Cookies
  if (msg.match(/(cookie|dessert|sweet|treat)/)) {
    return "White chocolate chip cookies - no macadamia."
  }
  
  // Skills/tools
  if (msg.match(/(skill|tool|software|figma|design tool)/)) {
    return "Figma. My strength is systems thinking - structuring complex workflows into clear flows."
  }
  
  // Strengths
  if (msg.match(/(strength|strong|good at|best at)/)) {
    return "Structuring ambiguity and advocating for users, especially those who feel overlooked."
  }
  
  // Process
  if (msg.match(/(how.*work|process|approach|method|iterate)/)) {
    return "Highly iterative. I refine until things feel precise and trustworthy."
  }
  
  // Feedback
  if (msg.match(/(feedback|criticism|critique)/)) {
    return "I listen, take notes, and process before responding."
  }
  
  // Collaboration
  if (msg.match(/(collaborat|team|work with others|coworker)/)) {
    return "I work across disciplines to turn complex capabilities into clear experiences."
  }
  
  // Culture
  if (msg.match(/(culture|environment|company|thrive)/)) {
    return "I thrive with structure and thoughtful decision-making."
  }
  
  // Personality
  if (msg.match(/(personality|describe yourself|kind of person|type of person)/)) {
    return "Observer and listener. I evaluate before responding."
  }
  
  // Projects/Case Studies
  if (msg.match(/^(projects?|portfolio|case stud)/i)) {
    return "Teammate, Meetly, and Silas. Check out the case study folders in the dock!"
  }
  
  // Teammate
  if (msg.match(/teammate/)) {
    return "Dating app for sports fans. Click the folder to see more!"
  }
  
  // Meetly
  if (msg.match(/meetly/)) {
    return "Scheduling and meeting management platform."
  }
  
  // Silas
  if (msg.match(/silas|most recent|latest/)) {
    return "My most recent - an AI companion project."
  }
  
  // What makes you unique
  if (msg.match(/(unique|hire|candidate|stand out|different)/)) {
    return "I focus on making things make sense, not just look good. I design systems that help people think clearly."
  }
  
  // Fun fact
  if (msg.match(/(fun fact|interesting|childhood|young|kid|cool.*about)/)) {
    return "I used to make movies in Windows Movie Maker as a kid!"
  }
  
  // Contact
  if (msg.match(/(contact|email|reach|connect|linkedin|work together)/)) {
    return "Feel free to reach out - my contact info is in the portfolio."
  }
  
  // Navigate
  if (msg.match(/(macbook|navigate|explore|around|click|folder|desktop|what can i|where should)/)) {
    return "Check out the case study folders in the dock, or explore Photos, Notes, and other apps!"
  }
  
  // Thank you
  if (msg.match(/(thank|thanks|appreciate)/)) {
    return "You're welcome!"
  }
  
  // Bye
  if (msg.match(/(bye|goodbye|see you|take care|later)/)) {
    return "Take care!"
  }
  
  // Nice to meet you
  if (msg.match(/(nice to meet|pleasure)/)) {
    return "Nice to meet you too!"
  }
  
  // Inappropriate/personal questions - redirect professionally
  if (msg.match(/(sexy|hot|attractive|beautiful|cute|date me|go out|number|phone|address|where do you live exactly|salary|money|income|politics|religion|vote)/)) {
    return "I'd love to share more about my work and case studies instead!"
  }
  
  // Help
  if (msg.match(/^help\??$/i) || msg.match(/what can i ask/)) {
    return "Ask me about my work, background, or case studies!"
  }
  
  // Default
  return "Feel free to ask about my work, background, or projects!"
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
      text: "Feel free to explore - check out my case studies in the dock below or click around!",
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
    
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
    
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
            <div className={`max-w-[75%] ${message.role === 'assistant' ? 'self-start' : 'self-end'}`}>
              <div className={`rounded-2xl px-4 py-2 ${message.role === 'assistant' ? 'bg-[#e9e9eb] text-black' : 'bg-blue-500 text-white'}`}>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
              <span className={`text-[10px] text-black/40 mt-1 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex flex-col">
            <div className="max-w-[75%] self-start">
              <div className="rounded-2xl px-4 py-3 bg-[#e9e9eb]">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
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
