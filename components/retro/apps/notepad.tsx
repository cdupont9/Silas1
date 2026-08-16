"use client"

import { RETRO_THEMES, type RetroEra } from "../retro-theme"

interface NotepadProps {
  era: RetroEra
  title?: string
  body: string
  photo?: string
}

// Classic Notepad: white monospace text well with a menu bar. Used for the "About" bio.
export function Notepad({ era, body, photo }: NotepadProps) {
  const t = RETRO_THEMES[era]
  return (
    <div className="flex flex-col h-full text-black" style={{ fontFamily: t.fontFamily }}>
      <div className="flex items-center gap-3 px-2 py-[3px] border-b border-[#808080] bg-[#ece9d8] text-[12px]">
        {["File", "Edit", "Format", "View", "Help"].map((m) => (
          <span key={m} className="cursor-default hover:underline">
            <span className="underline">{m[0]}</span>
            {m.slice(1)}
          </span>
        ))}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <div className="p-3">
          {photo && (
            <img
              src={photo || "/placeholder.svg"}
              alt="Charity Dupont"
              className="float-right ml-3 mb-2 w-[120px] border border-gray-400"
              crossOrigin="anonymous"
            />
          )}
          <pre className="whitespace-pre-wrap text-[13px] leading-relaxed font-mono text-black">{body}</pre>
        </div>
      </div>
    </div>
  )
}
