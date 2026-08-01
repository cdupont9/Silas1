"use client"

import { useState } from "react"
import { RETRO_THEMES, sunkenBevel, type RetroEra } from "../retro-theme"
import { FolderIcon, DocIcon, MyComputerIcon } from "../retro-icons"

interface CaseStudy {
  title: string
  subtitle: string
  hero: string
  overview: string
  role: string
  timeline: string
  tools: string[]
  challenge: string
  solution: string
  results: string[]
  screenshot: string
  icon: string
}

interface MyComputerProps {
  era: RetroEra
  caseStudies: Record<string, CaseStudy>
  initialOpenId?: string | null
}

const ORDER = ["luna", "silas", "teammate", "meetly"]

export function MyComputer({ era, caseStudies, initialOpenId = null }: MyComputerProps) {
  const t = RETRO_THEMES[era]
  const [openId, setOpenId] = useState<string | null>(initialOpenId)
  const cs = openId ? caseStudies[openId] : null

  return (
    <div className="flex flex-col h-full text-[12px] text-black" style={{ fontFamily: t.fontFamily }}>
      {/* Menu bar */}
      <div className="flex items-center gap-3 px-2 py-[3px] border-b border-[#808080] bg-[#ece9d8]">
        {["File", "Edit", "View", "Favorites", "Help"].map((m) => (
          <span key={m} className="hover:underline cursor-default">
            <span className="underline">{m[0]}</span>
            {m.slice(1)}
          </span>
        ))}
      </div>
      {/* Address bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-[#808080] bg-[#ece9d8]">
        <button
          onClick={() => setOpenId(null)}
          className="px-2 py-[2px] text-[11px] active:translate-y-px"
          style={{
            borderTop: "1px solid #fff",
            borderLeft: "1px solid #fff",
            borderRight: "1px solid #808080",
            borderBottom: "1px solid #808080",
            opacity: openId ? 1 : 0.5,
          }}
          disabled={!openId}
        >
          ← Back
        </button>
        <span className="text-[11px]">Address</span>
        <div className="flex-1 flex items-center gap-1 px-1 py-[2px]" style={sunkenBevel(t)}>
          <MyComputerIcon size={14} />
          <span className="text-[11px] truncate">
            My Computer{cs ? `\\Portfolio\\${cs.title}` : "\\Portfolio"}
          </span>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="flex-1 min-h-0 flex">
        {/* Blue side panel (XP look) */}
        <div
          className="w-[150px] shrink-0 p-2 text-white hidden sm:block"
          style={{
            background:
              era === "xp"
                ? "linear-gradient(180deg,#7aa0e6 0%,#5a83d6 40%,#4a6fc9 100%)"
                : "#d4d0c8",
            color: era === "xp" ? "#fff" : "#000",
          }}
        >
          <div className="font-bold text-[12px] mb-1 border-b border-white/40 pb-1">
            {cs ? "Details" : "Portfolio Tasks"}
          </div>
          {cs ? (
            <div className="text-[11px] leading-relaxed">
              <p className="font-bold">{cs.title}</p>
              <p className="opacity-90">{cs.subtitle}</p>
              <p className="mt-2 opacity-90">
                <span className="font-bold">Role:</span> {cs.role}
              </p>
              <p className="opacity-90">
                <span className="font-bold">Timeline:</span> {cs.timeline}
              </p>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed opacity-95">
              Select a project to view the full case study. Double-click a folder to open it.
            </p>
          )}
        </div>

        {/* Content well */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white p-3">
          {!cs ? (
            <div className="flex flex-wrap gap-4 content-start">
              {ORDER.filter((id) => caseStudies[id]).map((id) => (
                <button
                  key={id}
                  onDoubleClick={() => setOpenId(id)}
                  onClick={(e) => {
                    // single click selects; double opens. Keep it forgiving on touch: open on click too.
                    if (e.detail === 1) setOpenId(id)
                  }}
                  className="w-[92px] flex flex-col items-center gap-1 p-2 rounded hover:bg-[#e8eef9] focus:bg-[#cbdcf5] outline-none"
                >
                  <FolderIcon size={40} />
                  <span className="text-[11px] text-center leading-tight">{caseStudies[id].title}</span>
                </button>
              ))}
            </div>
          ) : (
            <article className="max-w-[640px] mx-auto text-[12px] leading-relaxed text-black">
              <div className="flex items-center gap-3 border-b border-gray-300 pb-2 mb-3">
                <img
                  src={cs.icon || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 object-contain rounded"
                  crossOrigin="anonymous"
                />
                <div>
                  <h1 className="text-[18px] font-bold leading-tight">{cs.title}</h1>
                  <p className="text-gray-600">{cs.subtitle}</p>
                </div>
              </div>

              <img
                src={cs.screenshot || "/placeholder.svg"}
                alt={`${cs.title} preview`}
                className="w-full max-h-[220px] object-contain bg-[#f4f4f4] border border-gray-300 mb-3"
                crossOrigin="anonymous"
              />

              <Section title="Overview" body={cs.overview} />
              <div className="grid grid-cols-2 gap-x-4 my-2 text-[11px]">
                <p>
                  <span className="font-bold">Role:</span> {cs.role}
                </p>
                <p>
                  <span className="font-bold">Timeline:</span> {cs.timeline}
                </p>
                <p className="col-span-2">
                  <span className="font-bold">Tools:</span> {cs.tools.join(", ")}
                </p>
              </div>
              <Section title="The Challenge" body={cs.challenge} />
              <Section title="The Solution" body={cs.solution} />
              <div className="mt-2">
                <h2 className="font-bold text-[13px] text-[#0a3a8a]">Results</h2>
                <ul className="list-disc pl-5 mt-1">
                  {cs.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 mt-4 text-gray-500 text-[11px]">
                <DocIcon size={14} />
                <span>{cs.title}.doc — Portfolio</span>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-2 py-[2px] border-t border-[#808080] bg-[#ece9d8] text-[11px]">
        {cs ? "1 document" : `${ORDER.filter((id) => caseStudies[id]).length} objects`}
      </div>
    </div>
  )
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-2">
      <h2 className="font-bold text-[13px] text-[#0a3a8a]">{title}</h2>
      <p className="mt-1">{body}</p>
    </div>
  )
}
