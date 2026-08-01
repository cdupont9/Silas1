"use client"

import { useEffect, useRef, useState } from "react"
import { RETRO_THEMES, sunkenBevel, raisedBevel, type RetroEra } from "../retro-theme"
import { AimIcon } from "../retro-icons"

interface AimMessengerProps {
  era: RetroEra
  isMobile: boolean
}

interface Buddy {
  screenName: string
  status: "online" | "away" | "idle"
  blurb: string
}

const BUDDIES: Buddy[] = [
  { screenName: "CharityDzn", status: "online", blurb: "UX Designer • ask me anything about my work!" },
  { screenName: "SmarterChild", status: "online", blurb: "your friendly chat bot" },
  { screenName: "LunaAgent00", status: "away", blurb: "listening..." },
]

type Msg = { from: "me" | "buddy"; text: string }

// A keyword-based auto-responder so the AIM chat actually talks back like 2003.
function autoReply(input: string, buddy: string): string {
  const q = input.toLowerCase()
  if (buddy === "SmarterChild") {
    if (q.includes("weather")) return "It's always sunny inside a CRT monitor :) Ask me about Charity's work!"
    if (q.includes("hi") || q.includes("hey") || q.includes("hello")) return "hiya! type 'help' to see what I can do."
    if (q.includes("help")) return "Try asking about: Luna, Silas, Teammate, Meetly, resume, or contact."
    return "I'm just a lil bot. Try messaging CharityDzn for the real answers!"
  }
  // CharityDzn / default
  if (q.includes("luna")) return "Luna is my interaction model for agentic AI — making an AI's listening, reasoning, and speaking states legible through motion + color. Open My Computer to read the full case study!"
  if (q.includes("silas")) return "Silas is an integrated AI companion that turns passive data into executable intelligence. Less thinking, more living :)"
  if (q.includes("teammate")) return "Teammate is a sports dating app — it schedules dates around live game events. Fun one!"
  if (q.includes("meetly")) return "Meetly helps friend groups coordinate meetups with availability + voting. No more 20-text threads."
  if (q.includes("resume") || q.includes("cv")) return "You can open my Resume right from the Start menu or the desktop. brb formatting it in Times New Roman ;)"
  if (q.includes("contact") || q.includes("email") || q.includes("hire")) return "I'd love to chat! Reach me through the Resume, or just keep IMing me here."
  if (q.includes("hi") || q.includes("hey") || q.includes("hello") || q.includes("sup")) return "hey!! thanks for stopping by my desktop :) what do you want to know about my work?"
  if (q.includes("bye") || q.includes("gtg") || q.includes("cya")) return "bye!! *door slam sound* don't be a stranger 🙂"
  return "ooh good question — try asking me about Luna, Silas, Teammate, Meetly, or my resume!"
}

export function AimMessenger({ era, isMobile }: AimMessengerProps) {
  const t = RETRO_THEMES[era]
  const [view, setView] = useState<"signon" | "buddies" | "chat">("signon")
  const [screenName, setScreenName] = useState("guest2003")
  const [activeBuddy, setActiveBuddy] = useState<string | null>(null)
  const [threads, setThreads] = useState<Record<string, Msg[]>>({})
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [threads, activeBuddy, view])

  const openChat = (buddy: string) => {
    setActiveBuddy(buddy)
    setView("chat")
    setThreads((prev) =>
      prev[buddy]
        ? prev
        : {
            ...prev,
            [buddy]: [{ from: "buddy", text: BUDDIES.find((b) => b.screenName === buddy)?.blurb ?? "hey!" }],
          },
    )
  }

  const send = () => {
    const text = draft.trim()
    if (!text || !activeBuddy) return
    setDraft("")
    setThreads((prev) => ({ ...prev, [activeBuddy]: [...(prev[activeBuddy] ?? []), { from: "me", text }] }))
    const reply = autoReply(text, activeBuddy)
    setTimeout(() => {
      setThreads((prev) => ({ ...prev, [activeBuddy!]: [...(prev[activeBuddy!] ?? []), { from: "buddy", text: reply }] }))
    }, 700)
  }

  const yellow = "#f4c20d"

  // ---- Sign-on screen ----
  if (view === "signon") {
    return (
      <div className="flex flex-col h-full bg-white text-black" style={{ fontFamily: t.fontFamily }}>
        <div className="h-2" style={{ background: yellow }} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5 text-center">
          <AimIcon size={64} />
          <p className="text-[15px] font-bold">America Online Instant Messenger</p>
          <div className="w-full max-w-[240px] text-left text-[12px]">
            <label className="block mb-1">Screen Name</label>
            <input
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              className="w-full px-2 py-1 text-[13px] outline-none"
              style={sunkenBevel(t)}
            />
            <label className="block mt-2 mb-1">Password</label>
            <input
              type="password"
              defaultValue="123456"
              className="w-full px-2 py-1 text-[13px] outline-none"
              style={sunkenBevel(t)}
            />
          </div>
          <button
            onClick={() => setView("buddies")}
            className="mt-2 px-6 py-1 text-[13px] font-bold active:translate-y-px"
            style={raisedBevel(t)}
          >
            Sign On
          </button>
          <p className="text-[10px] text-gray-500">You've Got Mail! (probably not, it's a portfolio)</p>
        </div>
      </div>
    )
  }

  // ---- Buddy list ----
  if (view === "buddies") {
    const online = BUDDIES.filter((b) => b.status === "online")
    const away = BUDDIES.filter((b) => b.status !== "online")
    return (
      <div className="flex flex-col h-full bg-white text-black" style={{ fontFamily: t.fontFamily }}>
        <div className="px-2 py-1 text-[12px] font-bold flex items-center gap-2" style={{ background: yellow }}>
          <AimIcon size={16} /> {screenName}'s Buddy List
        </div>
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-1 text-[12px]">
          <BuddyGroup label={`Buddies (${online.length}/${BUDDIES.length})`}>
            {online.map((b) => (
              <BuddyRow key={b.screenName} buddy={b} onOpen={() => openChat(b.screenName)} />
            ))}
          </BuddyGroup>
          <BuddyGroup label={`Away (${away.length})`}>
            {away.map((b) => (
              <BuddyRow key={b.screenName} buddy={b} onOpen={() => openChat(b.screenName)} />
            ))}
          </BuddyGroup>
        </div>
        <div className="p-1 text-[11px] text-gray-600 border-t border-gray-300">
          Double-click a buddy to send an Instant Message.
        </div>
      </div>
    )
  }

  // ---- Chat / IM window ----
  const msgs = activeBuddy ? threads[activeBuddy] ?? [] : []
  return (
    <div className="flex flex-col h-full bg-white text-black" style={{ fontFamily: t.fontFamily }}>
      <div className="px-2 py-1 text-[12px] font-bold flex items-center gap-2" style={{ background: yellow }}>
        <button onClick={() => setView("buddies")} className="text-[11px] underline">
          ‹ Buddies
        </button>
        <span className="ml-1">Instant Message with {activeBuddy}</span>
      </div>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-2 text-[13px] leading-snug" style={sunkenBevel(t)}>
        {msgs.map((m, i) => (
          <p key={i} className="mb-1">
            <span className={m.from === "me" ? "text-[#c00]" : "text-[#00c]"} style={{ fontWeight: 700 }}>
              {m.from === "me" ? screenName : activeBuddy}:
            </span>{" "}
            <span>{m.text}</span>
          </p>
        ))}
      </div>
      <div className="p-1 flex items-end gap-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              send()
            }
          }}
          rows={isMobile ? 2 : 2}
          className="flex-1 px-2 py-1 text-[13px] outline-none resize-none"
          style={sunkenBevel(t)}
          placeholder="Type a message..."
        />
        <button onClick={send} className="px-4 py-2 text-[12px] font-bold active:translate-y-px" style={raisedBevel(t)}>
          Send
        </button>
      </div>
    </div>
  )
}

function BuddyGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="font-bold text-[12px] text-[#0a3a8a] px-1">▾ {label}</div>
      <div className="pl-3">{children}</div>
    </div>
  )
}

function BuddyRow({ buddy, onOpen }: { buddy: Buddy; onOpen: () => void }) {
  return (
    <button
      onDoubleClick={onOpen}
      onClick={onOpen}
      className="w-full text-left px-1 py-[2px] rounded hover:bg-[#cbdcf5] flex items-center gap-2"
      title={buddy.blurb}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: buddy.status === "online" ? "#3ac13a" : "#e0a020" }}
      />
      <span className={buddy.status === "online" ? "font-bold" : "text-gray-500 italic"}>{buddy.screenName}</span>
    </button>
  )
}
