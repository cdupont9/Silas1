"use client"

import { RETRO_THEMES, type RetroEra } from "../retro-theme"

interface ResumeViewerProps {
  era: RetroEra
  url: string
}

// Opens the resume PDF inside a classic document window.
export function ResumeViewer({ era, url }: ResumeViewerProps) {
  const t = RETRO_THEMES[era]
  return (
    <div className="flex flex-col h-full text-black" style={{ fontFamily: t.fontFamily }}>
      <div className="flex items-center justify-between gap-3 px-2 py-[3px] border-b border-[#808080] bg-[#ece9d8] text-[12px]">
        <div className="flex items-center gap-3">
          {["File", "Edit", "View", "Help"].map((m) => (
            <span key={m} className="cursor-default hover:underline">
              <span className="underline">{m[0]}</span>
              {m.slice(1)}
            </span>
          ))}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-[1px] text-[11px] active:translate-y-px"
          style={{
            borderTop: "1px solid #fff",
            borderLeft: "1px solid #fff",
            borderRight: "1px solid #808080",
            borderBottom: "1px solid #808080",
          }}
        >
          Open in new window
        </a>
      </div>
      <div className="flex-1 min-h-0 bg-[#525659]">
        <iframe src={`${url}#toolbar=1`} title="Charity Dupont resume" className="w-full h-full border-0" />
      </div>
    </div>
  )
}
