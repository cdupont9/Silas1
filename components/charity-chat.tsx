'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'

const MEMOJI_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4110-E2fYwoTlD9Gx8uziQPBMJ46UxlVNiL.PNG"

// Helper function to get text from UIMessage parts
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}

export function CharityChat() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    initialMessages: [
      {
        id: 'welcome-1',
        role: 'assistant',
        parts: [{ type: 'text', text: "Hey! Welcome to my portfolio on my MacBook!" }],
      },
      {
        id: 'welcome-2', 
        role: 'assistant',
        parts: [{ type: 'text', text: "Feel free to explore around - check out my Projects folder on the desktop or click on any of my case studies below." }],
      },
      {
        id: 'welcome-3',
        role: 'assistant',
        parts: [{ type: 'text', text: "I'm a UX/UI designer at Google, passionate about creating meaningful digital experiences. Ask me anything about my work, background, or projects!" }],
      },
    ],
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  // Get current time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="h-12 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-black/5 flex items-center justify-center px-4 shrink-0">
        <span className="text-[13px] font-medium text-black/80">Charity</span>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((message) => {
          const text = getMessageText(message)
          if (!text) return null
          
          return (
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
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{text}</p>
                </div>
                <span className={`text-[10px] text-black/40 mt-1 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block`}>
                  {getCurrentTime()}
                </span>
              </div>
            </div>
          )
        })}
        
        {/* Typing indicator */}
        {isLoading && (
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
            placeholder="Ask me anything..." 
            className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
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
