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
  
  // Simple greetings - keep them simple
  if (msg.match(/^(hi|hello|hey|sup|yo|howdy)[\s!.?]*$/i)) {
    return "Hey! Great to meet you."
  }
  
  // How are you
  if (msg.match(/(how are you|how's it going|how you doing|what's up)/)) {
    return "I'm doing well, thanks for asking! How can I help you?"
  }
  
  // Name - simple
  if (msg.match(/^what'?s your name\??$/i) || msg.match(/^who are you\??$/i) || msg === 'name') {
    return "I'm Charity."
  }
  
  // Full name
  if (msg.match(/full name/)) {
    return "Charity Dupont."
  }
  
  // About/Tell me about yourself - the 30 second pitch
  if (msg.match(/(tell me about yourself|about you|introduce yourself|who is charity)/)) {
    return "I'm Charity, a UX/UI designer focused on high-stakes, AI-assisted experiences where clarity, trust, and decision-making really matter. My work sits at the intersection of behavioral systems and intelligent interfaces. I design structures that help people navigate complex workflows with confidence."
  }
  
  // What do you do - simple
  if (msg.match(/^what do you do\??$/i)) {
    return "I'm a UX Designer at Google."
  }
  
  // Where do you work - simple  
  if (msg.match(/^where do you work\??$/i)) {
    return "Google."
  }
  
  // Current role - more detail
  if (msg.match(/(your role|your job|at google|work.*on|day to day|daily)/)) {
    return "I design AI-assisted experiences that help people navigate complex, high-stakes workflows with clarity and confidence. I spend a lot of time shaping agent-assisted experiences - thinking through how AI shows up, when it should step in, and how it communicates intuitively."
  }
  
  // Work life / what's work like
  if (msg.match(/(work life|work like|typical day)/)) {
    return "A big part of my work is structuring ambiguity. I break down complex systems into clear, usable flows - mapping edge cases, refining interaction patterns, and tightening language so every step feels intentional. I think deeply about cognitive load, information hierarchy, and designing scaffolding that helps users stay oriented."
  }
  
  // Why UX / why design
  if (msg.match(/(why ux|why design|love about|enjoy about)/)) {
    return "What excites me most is designing products that don't just function well, but actively support better thinking - especially as AI becomes more embedded in everyday tools."
  }
  
  // How did you get into UX / origin story
  if (msg.match(/(how did you|get into|your story|your journey|start|background|path)/)) {
    return "Back in 2020 during COVID, my mom volunteered me to build a website for one of her clients. I had zero clue what I was doing - I used Wix to figure it out. That sparked my interest. I was teaching 4th grade at the time, but my mom encouraged me to pursue UX seriously. I did a bootcamp at Columbia University, and that led me to where I am today."
  }
  
  // Previous job / Teaching
  if (msg.match(/(previous|before|teacher|teaching|used to|taught)/)) {
    return "I was a 4th grade teacher before getting into UX. It was a great role, but my heart really felt called to move in a different direction."
  }
  
  // If not UX
  if (msg.match(/(if not|different field|other career|still be)/)) {
    return "I'd probably still be a teacher. Teaching was fulfilling, but I believe I'm doing something now that my heart really feels content doing."
  }
  
  // Education
  if (msg.match(/(education|school|degree|university|college|study|studied|columbia|njcu)/)) {
    return "I studied Psychology at New Jersey City University and completed a UX/UI Bootcamp at Columbia University."
  }
  
  // Location - simple
  if (msg.match(/^where.*(?:live|based|located)\??$/i) || msg === 'location') {
    return "I'm based in New York, currently living in New Jersey."
  }
  
  // Location - remote/relocation
  if (msg.match(/(relocat|remote|hybrid|office)/)) {
    return "I'm open to relocation and remote work. Currently I work a hybrid schedule - 2 to 3 days in the office."
  }
  
  // Born / Chicago / originally from
  if (msg.match(/(born|chicago|originally|grew up|from)/)) {
    return "I was born in Chicago and moved to the New York/New Jersey area in 2005 when I was 10. Moved with my mom first to New York, then to New Jersey."
  }
  
  // Family - simple
  if (msg.match(/^family\??$/i)) {
    return "It's just my mom and me, and our dog Hunter."
  }
  
  // Mom / mother
  if (msg.match(/(mom|mother)/)) {
    return "My mom and I are really close. She's actually the one who believed I could create magic out of thin air and volunteered me to build that first website. She's always encouraged me to pursue what I'm passionate about."
  }
  
  // Dad / father (sensitive topic)
  if (msg.match(/(dad|father)/)) {
    return "My dad passed away when I was 13. It's been my mom and me since then."
  }
  
  // Siblings
  if (msg.match(/(sibling|brother|sister)/)) {
    return "No, I don't have any siblings."
  }
  
  // Pet / Dog / Hunter
  if (msg.match(/(pet|dog|dalmatian|hunter)/)) {
    return "I have a Dalmatian named Hunter! He's 2 years old with liver spots - brown instead of black. I spend a lot of time with him, whether we're playing, getting outside, or just relaxing together."
  }
  
  // Married
  if (msg.match(/married/)) {
    return "No, I'm not married."
  }
  
  // Single / dating
  if (msg.match(/(single|dating|relationship|boyfriend|girlfriend)/)) {
    return "I'm single."
  }
  
  // Kids / children
  if (msg.match(/(kid|children)/)) {
    return "No, I don't have kids."
  }
  
  // Age / birthday
  if (msg.match(/(age|old are you|birthday|birth)/)) {
    return "My birthday is May 25th."
  }
  
  // Favorite color
  if (msg.match(/(color|colour)/)) {
    return "Pink!"
  }
  
  // Hobbies - simple
  if (msg.match(/^hobbies\??$/i) || msg.match(/^interests\??$/i)) {
    return "Spending time with Hunter, quality time with my mom, and watching good shows."
  }
  
  // Three passions / outside work
  if (msg.match(/(passion|outside work|free time|fun|weekend)/)) {
    return "Three things I'm passionate about outside of work: Hunter and taking care of him, family connections - especially time with my mom, and storytelling through visual media. I love discovering shows that are visually rich or have compelling narratives."
  }
  
  // Personal life
  if (msg.match(/(personal life|downtime|recharge)/)) {
    return "I make space to recharge in ways that feel grounding. I spend a lot of time with Hunter, prioritize quality time with my mom, and enjoy catching up on really good shows - especially on weekends when I have no plans."
  }
  
  // TV / Shows
  if (msg.match(/(tv|show|watch|netflix|favorite show)/)) {
    return "My favorite show is Emily in Paris. I like getting pulled into something well-written or visually engaging and just immersing myself in it."
  }
  
  // Movies
  if (msg.match(/movie/)) {
    return "I actually prefer shows over movies!"
  }
  
  // Music
  if (msg.match(/(music|listen|song|artist|jazz|playlist)/)) {
    return "I listen to jazz while working - Miles Davis, Kenny G, Joshua Redman. I also enjoy classical and pretty much all genres. I'm nostalgic for early 2000s music too."
  }
  
  // Food / favorite meal
  if (msg.match(/(food|eat|meal|restaurant|hungry)/)) {
    return "My favorite meal is lamb chops with fig jam. For dessert, apple pie with vanilla bean ice cream. My favorite restaurant is Broadway Chicken in Westfield - their honey chicken is amazing."
  }
  
  // Cookies / dessert
  if (msg.match(/(cookie|dessert|sweet|treat)/)) {
    return "White chocolate chip cookies - but no macadamia!"
  }
  
  // Skills / tools / software
  if (msg.match(/(skill|tool|software|figma|design tool)/)) {
    return "I work with standard design tools like Figma. My real strength is systems thinking - structuring complex workflows into clear, usable flows and balancing automation with human control."
  }
  
  // Strengths / good at
  if (msg.match(/(strength|strong|good at|best at)/)) {
    return "I advocate strongly for users, especially those who feel overlooked. I'm good at structuring ambiguity - breaking down complex systems into something clear and usable. I'm also highly iterative. I revisit and refine until things feel precise and trustworthy."
  }
  
  // How do you work / process
  if (msg.match(/(how.*work|process|approach|method|iterate)/)) {
    return "I'm highly iterative. I revisit and refine often - whether it's a flow, UX writing, or how an AI response is framed - until it feels precise, coherent, and trustworthy. I think through systems, not just screens."
  }
  
  // Feedback / criticism
  if (msg.match(/(feedback|criticism|critique)/)) {
    return "When receiving feedback, I'm always taking notes and listening. I evaluate what's being said, think on it before responding. I like to process feedback before reacting - sometimes you need time to think through things properly."
  }
  
  // Collaboration / team
  if (msg.match(/(collaborat|team|work with others|coworker)/)) {
    return "Collaboration is less about alignment and more about translation. I work across disciplines to turn complex technical capabilities into experiences that are understandable, reliable, and grounded in real human needs."
  }
  
  // Company culture / environment
  if (msg.match(/(culture|environment|company|thrive)/)) {
    return "I thrive in a company that has structure - so I know how to not color outside the lines. I value thoughtful decision-making over speed for the sake of speed."
  }
  
  // Personality / describe yourself
  if (msg.match(/(personality|describe yourself|kind of person|type of person)/)) {
    return "I'm a collaborative person. I work well in teams but I consider myself more of an observer and a listener rather than someone who responds right away. If you're too quick to speak, you might miss something. It's good to listen first, evaluate, and sit on something before responding."
  }
  
  // Stay up to date / technology
  if (msg.match(/(stay up|up to date|technology|trends|learn)/)) {
    return "I have a Twitter account where I follow what's being talked about in the design and AI space. I like seeing what's new and what's becoming a big topic."
  }
  
  // Projects / Case Studies - simple
  if (msg.match(/^(projects?|portfolio|case stud)/i)) {
    return "I have three case studies: Teammate, Meetly, and Silas. Click the folders on the desktop to explore them!"
  }
  
  // Teammate
  if (msg.match(/teammate/)) {
    return "Teammate is a dating app for sports fans - connecting them with like-minded individuals and helping organize dates around mutual sports interests. Check out the folder on the desktop!"
  }
  
  // Meetly
  if (msg.match(/meetly/)) {
    return "Meetly is a scheduling and meeting management platform I designed. Click the Meetly folder to see more!"
  }
  
  // Silas
  if (msg.match(/silas|most recent|latest/)) {
    return "Silas is my most recent case study - it's an AI companion project. Click the Silas folder to explore it!"
  }
  
  // What makes you unique / hire you / strong candidate
  if (msg.match(/(unique|hire|candidate|stand out|different)/)) {
    return "I don't just focus on making things look good - I focus on making them make sense. I'm designing systems that don't just function well, but actively help people think more clearly and act with confidence in AI-supported environments."
  }
  
  // Fun fact / childhood / young
  if (msg.match(/(fun fact|interesting|childhood|young|kid|cool.*about)/)) {
    return "I used to make movies in Windows Movie Maker when I was younger! I'd put pictures together for my mom. Even in middle school, I made fancy backgrounds on my assignments - I guess I was into design before I knew it had a name."
  }
  
  // Dream / wanted to be
  if (msg.match(/(dream|wanted to be|aspir|grow up)/)) {
    return "Growing up I wanted to be a chef, a ballet dancer, a writer, and a music artist. Life takes you in interesting directions!"
  }
  
  // Contact / hire / reach out
  if (msg.match(/(contact|email|reach|connect|linkedin|hire|work together)/)) {
    return "Feel free to reach out! You can find my contact information in the portfolio. I'm always open to connecting."
  }
  
  // MacBook / Navigate / explore
  if (msg.match(/(macbook|navigate|explore|around|click|folder|desktop|what can i|where should)/)) {
    return "Click the folders on the desktop to view my case studies - Teammate, Meetly, and Silas. You can also check out the Photos app, Notes, or explore the other apps in the dock!"
  }
  
  // Thank you
  if (msg.match(/(thank|thanks|appreciate)/)) {
    return "You're welcome!"
  }
  
  // Bye / Goodbye
  if (msg.match(/(bye|goodbye|see you|take care|later)/)) {
    return "Take care! Thanks for stopping by."
  }
  
  // Nice to meet you
  if (msg.match(/(nice to meet|pleasure)/)) {
    return "Nice to meet you too!"
  }
  
  // Help
  if (msg.match(/^help\??$/i) || msg.match(/what can i ask/)) {
    return "You can ask me about my work, background, case studies, hobbies, or how to navigate this MacBook portfolio. What would you like to know?"
  }
  
  // Default
  return "Feel free to ask me about my work, background, projects, or anything else. You can also explore by clicking around the desktop!"
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
      text: "Feel free to explore around - check out my Projects on the desktop or click on any of my case study folders.",
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
