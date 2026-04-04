'use client'

import { useState, useRef, useEffect } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
  reaction?: string
}

interface CharityChatProps {
  openCaseStudy?: (project: string) => void
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const REACTIONS = ['❤️', '👍', '👎', '😂', '❗', '❓', '😢', '😍']

const getCharityResponse = (userMessage: string): string => {
  // Normalize: lowercase, trim, remove extra letters (hiiiii -> hi, youuuu -> you)
  const msg = userMessage.toLowerCase().trim()
  const normalized = msg.replace(/(.)\1{2,}/g, '$1$1') // reduce repeated chars to max 2
  
  // Simple yes/no follow-ups
  if (normalized.match(/^(yes|yep|yeah|yea|ya|yup|yuh|mhm|uh huh|bet|aight|ight|fasho|fo sho|fosho)[\s!?.]*$/i)) {
    return "Nice!"
  }
  
  if (normalized.match(/^(no|nope|nah|naw)[\s!?.]*$/i)) {
    return "No worries!"
  }
  
  // At Google? type follow-ups
  if (normalized.match(/^at google\??$/i)) {
    return "Yep!"
  }
  
  if (normalized.match(/^(really|for real|fr|deadass|no cap|serious|seriously)\??$/i)) {
    return "Yep!"
  }
  
  // Simple greetings - handle extended letters and slang
  if (normalized.match(/^(hi+|hey+|hello+|sup|yo+|howdy|wassup|wasup|whaddup|what's good|whats good|ayy+|ayo+|hiya)[\s!.?]*$/i)) {
    return "Hey! Great to meet you"
  }
  
  // How are you - handle variations and slang
  if (normalized.match(/^(how are you+|how's it going|how you doing|how u doing|how you doin|what's up|whats up|wassup|wyd|what you doing|whatchu doing|how's everything|hows everything|how are ya|how ya doing|how u)[\s!?.]*$/i)) {
    return "Doing well, thanks for asking! How can I help"
  }
  
  // What's good / what's poppin
  if (normalized.match(/^(what'?s good|whats good|what'?s poppin|whats poppin|what'?s crackin|whats crackin)[\s!?.]*$/i)) {
    return "Heyyy not much! What's up with you"
  }
  
  // Name
  if (normalized.match(/^(what'?s your name|whats your name|your name|who are you|who dis|who this|who is this)\??$/i) || normalized === 'name') {
    return "I'm Charity"
  }
  
  // Full name
  if (normalized.match(/full name/)) {
    return "Charity Dupont"
  }
  
  // What do you do
  if (normalized.match(/^(what do you do|what you do|whatchu do|wyd for work|what do u do)\??$/i)) {
    return "I'm a UX Designer"
  }
  
  // Where do you work
  if (normalized.match(/^(where do you work|where you work|where u work|where do u work)\??$/i) || normalized.match(/^where.*you.*work/i)) {
    return "I work at Google"
  }
  
  // About/Tell me about yourself
  if (normalized.match(/(tell me about yourself|about you|introduce yourself|who is charity|who you|tell me bout you)/)) {
    return "I'm a UX Designer focused on AI-assisted experiences where clarity and trust really matter - I design systems that help people navigate complex workflows with confidence"
  }
  
  // Current role details
  if (normalized.match(/(your role|your job|work.*on|day to day|daily)/)) {
    return "I design AI-assisted experiences - thinking through how AI shows up, when it steps in, and how it communicates intuitively"
  }
  
  // Why UX
  if (normalized.match(/(why ux|why design|love about|enjoy about)/)) {
    return "I love designing products that help people think more clearly, especially as AI becomes more embedded in everyday tools"
  }
  
  // How did you get into UX
  if (normalized.match(/(how did you|how'd you|how you get into|get into|your story|your journey|start.*ux|background|path)/)) {
    return "In 2020 during COVID, my mom volunteered me to build a website - I had no clue what I was doing but figured it out! I was teaching 4th grade at the time but that sparked my interest. Did a bootcamp at Columbia and here I am"
  }
  
  // Teaching
  if (normalized.match(/(previous|before|teacher|teaching|used to|taught)/)) {
    return "I was a 4th grade teacher before getting into UX"
  }
  
  // Education
  if (normalized.match(/(education|school|degree|university|college|study|studied|columbia|njcu)/)) {
    return "Psychology at NJCU and a UX/UI Bootcamp at Columbia"
  }
  
  // Where do you live
  if (normalized.match(/^where.*(live|based|located|stay|at)\??$/i) || normalized === 'location') {
    return "New Jersey"
  }
  
  // Where are you from
  if (normalized.match(/(where.*from|originally|grew up|where you from)/)) {
    return "Born in Chicago but I live in New Jersey now"
  }
  
  // Chicago specific
  if (normalized.match(/chicago/)) {
    return "Yep I was born there! Moved to New Jersey when I was 10"
  }
  
  // Remote/relocation
  if (normalized.match(/(relocat|remote|hybrid|office)/)) {
    return "Open to relocation and remote - currently hybrid, 2 to 3 days in office"
  }
  
  // Family
  if (normalized.match(/^family\??$/i)) {
    return "My mom and our dog Hunter"
  }
  
  // Mom
  if (normalized.match(/(mom|mother|mama|ma\b)/)) {
    return "My mom and I are super close - she's the one who encouraged me to pursue UX"
  }
  
  // Dad
  if (normalized.match(/(dad|father|pops)/)) {
    return "My dad passed when I was 13"
  }
  
  // Siblings
  if (normalized.match(/(sibling|brother|sister|bro\b|sis\b)/)) {
    return "No siblings, just me"
  }
  
  // Pet / Dog
  if (normalized.match(/(pet|dog|dalmatian|hunter|puppy|pup)/)) {
    return "I have a Dalmatian named Hunter! He's 2 with liver spots - brown instead of black"
  }
  
  // Married
  if (normalized.match(/(married|husband|wife)/)) {
    return "Nope"
  }
  
  // Dating/relationship - redirect warmly
  if (normalized.match(/(single|dating|relationship|boyfriend|girlfriend|seeing anyone|love life|boo\b|bae\b|talking to someone)/)) {
    return "Haha that's a bit personal - happy to share more about my work or background though!"
  }
  
  // Kids
  if (normalized.match(/(kid|children|babies)/)) {
    return "No kids"
  }
  
  // Age
  if (normalized.match(/(how old|age|your age|what's your age|whats your age)/)) {
    return "I'm 30"
  }
  
  // Birthday
  if (normalized.match(/(birthday|birth|born.*when|when.*born|bday)/)) {
    return "May 25th"
  }
  
  // Favorite color
  if (normalized.match(/(favorite )?colou?r|fav colou?r/)) {
    return "Pink!"
  }
  
  // Hobbies
  if (normalized.match(/^hobbies\??$/i) || normalized.match(/^interests\??$/i)) {
    return "Spending time with Hunter, quality time with my mom, and watching good shows"
  }
  
  // Free time / fun
  if (normalized.match(/(free time|for fun|fun\??$|weekend|what you do for fun|whatchu do for fun)/)) {
    return "I love spending time with my dog Hunter, hanging with my mom, and finding good shows to binge"
  }
  
  // Passion / outside work
  if (normalized.match(/(passion|outside work)/)) {
    return "Hunter, family time, and getting lost in a really good show"
  }
  
  // TV/Shows
  if (normalized.match(/(tv|show|watch|netflix|favorite show|fav show|binge)/)) {
    return "Emily in Paris is my favorite!"
  }
  
  // Movies
  if (normalized.match(/movie/)) {
    return "I actually prefer shows over movies"
  }
  
  // Music
  if (normalized.match(/(music|listen|song|artist|jazz|playlist|spotify|what you listen)/)) {
    return "Jazz while working - Miles Davis, Kenny G - and I'm super nostalgic for early 2000s music"
  }
  
  // Food
  if (normalized.match(/(food|eat|meal|restaurant|hungry|favorite food|fav food|what you eat|whatchu eat)/)) {
    return "Lamb chops with fig jam! And apple pie with vanilla bean ice cream for dessert"
  }
  
  // Cookies
  if (normalized.match(/(cookie|dessert|sweet|treat)/)) {
    return "White chocolate chip cookies - but no macadamia!"
  }
  
  // Skills/tools
  if (normalized.match(/(skill|tool|software|figma|design tool)/)) {
    return "Figma mostly - but my real strength is systems thinking, structuring complex workflows into clear flows"
  }
  
  // Strengths
  if (normalized.match(/(strength|strong|good at|best at)/)) {
    return "Structuring ambiguity and advocating for users, especially those who feel overlooked"
  }
  
  // Process
  if (normalized.match(/(how.*work|process|approach|method|iterate)/)) {
    return "Super iterative - I refine until things feel precise and trustworthy"
  }
  
  // Feedback
  if (normalized.match(/(feedback|criticism|critique)/)) {
    return "I listen, take notes, and like to process before responding"
  }
  
  // Collaboration
  if (normalized.match(/(collaborat|team|work with others|coworker)/)) {
    return "I work across disciplines to turn complex capabilities into clear experiences"
  }
  
  // Culture
  if (normalized.match(/(culture|environment|company|thrive)/)) {
    return "I thrive with structure and thoughtful decision-making"
  }
  
  // Personality
  if (normalized.match(/(personality|describe yourself|kind of person|type of person)/)) {
    return "Definitely an observer and listener - I like to evaluate before responding"
  }
  
  // Favorite case study
  if (normalized.match(/(favorite|fav|best|proudest).*(case study|project|work)/)) {
    return "LINK:silas:My favorite is Silas, the AI companion - you can check it out here if you'd like!"
  }
  
  // Projects/Case Studies
  if (normalized.match(/^(projects?|portfolio|case stud)/i)) {
    return "I have three - Teammate, Meetly, and Silas! Check out the case study folders in the dock"
  }
  
  // Teammate
  if (normalized.match(/teammate/)) {
    return "LINK:teammate:It's a dating app for sports fans - click here to check it out!"
  }
  
  // Meetly
  if (normalized.match(/meetly/)) {
    return "LINK:meetly:A scheduling and meeting management platform - click here to see it!"
  }
  
  // Silas
  if (normalized.match(/silas|most recent|latest/)) {
    return "LINK:silas:My most recent project - it's an AI companion! Click here to check it out"
  }
  
  // What makes you unique
  if (normalized.match(/(unique|hire|candidate|stand out|different|why should)/)) {
    return "I focus on making things make sense, not just look good - I design systems that help people think clearly"
  }
  
  // Fun fact
  if (normalized.match(/(fun fact|interesting|childhood|young|kid|cool.*about)/)) {
    return "I used to make movies in Windows Movie Maker as a kid haha"
  }
  
  // Contact
  if (normalized.match(/(contact|email|reach|connect|linkedin|work together|hit you up|hmu)/)) {
    return "Feel free to reach out! My contact info is in the portfolio"
  }
  
  // Navigate
  if (normalized.match(/(macbook|navigate|explore|around|click|folder|desktop|what can i|where should)/)) {
    return "Check out the case study folders in the dock, or explore Photos, Notes, and other apps!"
  }
  
  // Thank you - handle variations
  if (normalized.match(/(thank|thanks|appreciate|preciate|thx|ty\b)/)) {
    return "Of course!"
  }
  
  // Bye - handle variations
  if (normalized.match(/(bye|goodbye|see you|take care|later|peace|deuces|gotta go|ima head out|imma head out)/)) {
    return "Take care!"
  }
  
  // Nice to meet you
  if (normalized.match(/(nice to meet|pleasure|good to meet)/)) {
    return "Nice to meet you too!"
  }
  
  // Cool / awesome / nice responses - handle slang
  if (normalized.match(/^(cool|awesome|nice|great|wow|amazing|interesting|dope|fire|lit|sick|tight|bet)[\s!.]*$/i)) {
    return "Thanks!"
  }
  
  // Ok / okay / got it - handle variations
  if (normalized.match(/^(ok|okay|k|kk|got it|i see|makes sense|word|copy|heard)[\s!.]*$/i)) {
    return "Let me know if you have any other questions!"
  }
  
  // That's cool/dope etc
  if (normalized.match(/^that'?s (cool|dope|fire|lit|sick|awesome|amazing)[\s!.]*$/i)) {
    return "Thanks! Let me know if you wanna know more about anything"
  }
  
  // Inappropriate/personal questions - redirect warmly
  if (normalized.match(/(sexy|hot\b|attractive|beautiful|cute|date me|go out|number|phone|address|where do you live exactly|salary|money|income|politics|religion|vote)/)) {
    return "Haha I'd love to share more about my work and case studies instead!"
  }
  
  // Help
  if (normalized.match(/^help\??$/i) || normalized.match(/what can i ask/)) {
    return "Ask me about my work, background, or case studies - or just say hi!"
  }
  
  // Lol / haha responses
  if (normalized.match(/^(lol|lmao|haha|hehe|rofl|dead|dying)[\s!.]*$/i)) {
    return "Haha glad I could make you laugh!"
  }
  
  // I like that / love that
  if (normalized.match(/^i (like|love) that[\s!.]*$/i)) {
    return "Thanks!"
  }
  
  // Default - warm and diplomatic
  return "Hmm I'm not sure about that one - but feel free to ask me about my work, background, or projects!"
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function CharityChat({ openCaseStudy, messages, setMessages }: CharityChatProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    
    const userMessage: ChatMessage = {
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
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response,
      time: getCurrentTime(),
    }
    
    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleDoubleClick = (messageId: string) => {
    setShowReactions(showReactions === messageId ? null : messageId)
  }

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reaction: msg.reaction === reaction ? undefined : reaction }
        : msg
    ))
    setShowReactions(null)
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
          <div key={message.id} className="flex flex-col relative">
            <div 
              className={`max-w-[75%] ${message.role === 'assistant' ? 'self-start' : 'self-end'} relative`}
              onDoubleClick={() => handleDoubleClick(message.id)}
            >
              <div className={`rounded-2xl px-4 py-2 cursor-pointer ${message.role === 'assistant' ? 'bg-[#e9e9eb] text-black' : 'bg-blue-500 text-white'}`}>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                  {message.text.startsWith('LINK:') ? (
                    (() => {
                      const parts = message.text.split(':')
                      const projectId = parts[1]
                      const displayText = parts.slice(2).join(':')
                      const linkMatch = displayText.match(/(.*)(click here|check it out here|here if you'd like)(.*)/i)
                      if (linkMatch && openCaseStudy) {
                        return (
                          <>
                            {linkMatch[1]}
                            <button 
                              onClick={() => openCaseStudy(projectId)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {linkMatch[2]}
                            </button>
                            {linkMatch[3]}
                          </>
                        )
                      }
                      return displayText
                    })()
                  ) : message.text}
                </p>
              </div>
              
              {/* Reaction display */}
              {message.reaction && (
                <div className={`absolute -bottom-2 ${message.role === 'assistant' ? 'right-0' : 'left-0'}`}>
                  <span className="text-sm bg-white rounded-full px-1 shadow-sm border border-black/10">
                    {message.reaction}
                  </span>
                </div>
              )}
              
              {/* Reaction picker */}
              {showReactions === message.id && (
                <div className={`absolute bottom-full mb-2 ${message.role === 'assistant' ? 'left-0' : 'right-0'} bg-white rounded-full shadow-lg border border-black/10 px-2 py-1.5 flex gap-1 z-50`}>
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => addReaction(message.id, reaction)}
                      className="hover:scale-125 transition-transform text-lg px-0.5"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
              
              <span className={`text-[10px] text-black/40 mt-1 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block ${message.reaction ? 'mt-3' : 'mt-1'}`}>
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
