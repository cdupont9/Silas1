"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar"

// A public interactive avatar that ships on most HeyGen plans.
// Override with NEXT_PUBLIC_HEYGEN_AVATAR_ID if you have a custom one.
const AVATAR_ID = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID || "Ann_Therapist_public"

const GREETING =
  "Hi! I'm Charity's live assistant. Ask me anything about her work, her design process, or her experience, and I'll walk you through it."

const KNOWLEDGE_BASE =
  "You are the friendly live assistant for Charity Dupont, a product/UX designer. " +
  "Speak warmly and concisely (2-4 sentences). Help visitors learn about Charity's design work, " +
  "her case studies (including the Teammate sports dating app and Silas projects), her process, " +
  "her tech stack, and her experience. Encourage visitors to explore her portfolio. " +
  "If you don't know a specific detail, invite them to chat with Charity directly or open her resume."

type Status = "idle" | "connecting" | "live" | "error"

export function LiveAvatar() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [input, setInput] = useState("")

  const avatarRef = useRef<StreamingAvatar | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const attachStream = useCallback((stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(() => {})
      }
    }
  }, [])

  const start = useCallback(async () => {
    setError(null)
    setStatus("connecting")
    try {
      const res = await fetch("/api/heygen-token", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not start the live avatar.")

      const avatar = new StreamingAvatar({ token: data.token })
      avatarRef.current = avatar

      avatar.on(StreamingEvents.STREAM_READY, (event: { detail: MediaStream }) => {
        if (event.detail) attachStream(event.detail)
        setStatus("live")
        // Greet the visitor once the stream is live.
        avatar.speak({ text: GREETING, taskType: TaskType.REPEAT }).catch(() => {})
      })
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => setIsSpeaking(true))
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => setIsSpeaking(false))
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        setStatus("idle")
        setIsSpeaking(false)
      })

      await avatar.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: AVATAR_ID,
        knowledgeBase: KNOWLEDGE_BASE,
        language: "en",
      })
    } catch (err) {
      console.log("[v0] LiveAvatar start error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong starting the avatar.")
      setStatus("error")
    }
  }, [attachStream])

  const stop = useCallback(async () => {
    try {
      await avatarRef.current?.stopAvatar()
    } catch {
      // ignore
    }
    avatarRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus("idle")
    setIsSpeaking(false)
  }, [])

  const ask = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const text = input.trim()
      if (!text || !avatarRef.current || status !== "live") return
      setInput("")
      try {
        // TALK uses HeyGen's built-in LLM + knowledge base to answer.
        await avatarRef.current.speak({ text, taskType: TaskType.TALK })
      } catch (err) {
        console.log("[v0] LiveAvatar speak error:", err)
      }
    },
    [input, status],
  )

  // Clean up the session if the component unmounts.
  useEffect(() => {
    return () => {
      avatarRef.current?.stopAvatar().catch(() => {})
      avatarRef.current = null
    }
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden border border-amber-900/15 bg-[#1a1413] mb-4">
      {/* Video stage */}
      <div className="relative aspect-video bg-gradient-to-br from-[#2a211a] to-[#1a1413]">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={`w-full h-full object-cover transition-opacity duration-300 ${status === "live" ? "opacity-100" : "opacity-0"}`}
        />

        {/* Overlays for non-live states */}
        {status !== "live" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e8920c] flex items-center justify-center shadow-[0_0_24px_rgba(245,166,35,0.45)]">
              <span className="text-white font-bold">AI</span>
            </div>
            {status === "idle" && (
              <p className="text-white/70 text-xs leading-relaxed max-w-[260px]">
                Meet Charity&apos;s live talking avatar. Start a session to ask questions out loud.
              </p>
            )}
            {status === "connecting" && (
              <p className="text-[#f0a3a3] text-xs animate-pulse">Connecting live avatar&hellip;</p>
            )}
            {status === "error" && (
              <p className="text-[#f0a3a3] text-xs leading-relaxed max-w-[280px]">{error}</p>
            )}
          </div>
        )}

        {/* Live indicator */}
        {status === "live" && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? "bg-green-400 animate-pulse" : "bg-[#f5a623]"}`} />
            <span className="text-white text-[10px] font-medium uppercase tracking-wide">
              {isSpeaking ? "Speaking" : "Live"}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 bg-[#231b15]">
        {status === "live" ? (
          <div className="flex flex-col gap-2">
            <form onSubmit={ask} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the avatar a question…"
                className="flex-1 bg-white/10 text-white text-[12px] rounded-full px-3 py-2 outline-none placeholder-white/40 border border-white/10 focus:border-[#f5a623]/60"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="shrink-0 px-3 py-2 rounded-full bg-gradient-to-b from-[#f5a623] to-[#e8920c] text-white text-[12px] font-semibold disabled:opacity-50 hover:brightness-110 transition-all"
              >
                Ask
              </button>
            </form>
            <button
              onClick={stop}
              className="text-white/50 text-[11px] hover:text-white/80 transition-colors self-center"
            >
              End live session
            </button>
          </div>
        ) : (
          <button
            onClick={start}
            disabled={status === "connecting"}
            className="w-full py-2.5 rounded-full bg-gradient-to-b from-[#f5a623] to-[#e8920c] text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === "connecting" ? "Starting…" : status === "error" ? "Try again" : "Start live avatar"}
          </button>
        )}
      </div>
    </div>
  )
}
