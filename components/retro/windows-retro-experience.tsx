"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { RETRO_THEMES, raisedBevel, sunkenBevel, type RetroEra } from "./retro-theme"
import { RetroWindow } from "./retro-window"
import {
  MyComputerIcon,
  RecycleBinIcon,
  FolderIcon,
  NotepadIcon,
  DocIcon,
  PaintIcon,
  MineIcon,
  PinballIcon,
  AimIcon,
  DisplayIcon,
  StartFlagIcon,
} from "./retro-icons"
import { MyComputer } from "./apps/my-computer"
import { Notepad } from "./apps/notepad"
import { ResumeViewer } from "./apps/resume-viewer"
import { AimMessenger } from "./apps/aim-messenger"
import { Minesweeper } from "./apps/minesweeper"
import { Paint } from "./apps/paint"
import { Pinball } from "./apps/pinball"

type AppId = "mycomputer" | "about" | "resume" | "aim" | "games" | "paint" | "minesweeper" | "pinball" | "display"

interface BackgroundOption {
  id: string
  type: string
  url: string
  preview: string
  name: string
  retro?: RetroEra
}

interface RetroProps {
  era: RetroEra
  isMobile: boolean
  wallpaperUrl: string
  caseStudies: Record<string, any>
  aboutBody: string
  charityPhoto: string
  resumeUrl: string
  backgroundOptions: BackgroundOption[]
  currentBackgroundId: string
  onSelectBackground: (bg: BackgroundOption) => void
  onExit: () => void
}

const APP_META: Record<AppId, { title: string; icon: (p: any) => React.ReactNode; w: number; h: number }> = {
  mycomputer: { title: "My Computer", icon: (p) => <MyComputerIcon {...p} />, w: 680, h: 480 },
  about: { title: "About Charity - Notepad", icon: (p) => <NotepadIcon {...p} />, w: 460, h: 420 },
  resume: { title: "Resume - Charity Dupont", icon: (p) => <DocIcon {...p} />, w: 620, h: 560 },
  aim: { title: "AOL Instant Messenger", icon: (p) => <AimIcon {...p} />, w: 300, h: 460 },
  games: { title: "Games", icon: (p) => <FolderIcon {...p} />, w: 420, h: 300 },
  paint: { title: "untitled - Paint", icon: (p) => <PaintIcon {...p} />, w: 620, h: 480 },
  minesweeper: { title: "Minesweeper", icon: (p) => <MineIcon {...p} />, w: 320, h: 400 },
  pinball: { title: "3D Pinball - Space Cadet", icon: (p) => <PinballIcon {...p} />, w: 360, h: 620 },
  display: { title: "Display Properties", icon: (p) => <DisplayIcon {...p} />, w: 420, h: 460 },
}

let seq = 10

export function WindowsRetroExperience(props: RetroProps) {
  const { era, isMobile, wallpaperUrl, caseStudies, aboutBody, charityPhoto, resumeUrl } = props
  const t = RETRO_THEMES[era]

  const [booting, setBooting] = useState(true)
  const [startOpen, setStartOpen] = useState(false)
  const [clock, setClock] = useState("")
  // window stack: id -> { z, minimized, pos }
  const [windows, setWindows] = useState<Record<string, { z: number; minimized: boolean; pos: { x: number; y: number } }>>({})

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const h = d.getHours()
      const m = d.getMinutes().toString().padStart(2, "0")
      const ap = h >= 12 ? "PM" : "AM"
      setClock(`${h % 12 || 12}:${m} ${ap}`)
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setBooting(false), 1700)
    return () => clearTimeout(id)
  }, [])

  const openApp = (id: AppId) => {
    setStartOpen(false)
    setWindows((prev) => {
      seq += 1
      const existing = prev[id]
      const offset = Object.keys(prev).length * 26
      return {
        ...prev,
        [id]: {
          z: seq,
          minimized: false,
          pos: existing?.pos ?? { x: 90 + offset, y: 60 + offset },
        },
      }
    })
  }
  const focusApp = (id: string) =>
    setWindows((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], z: ++seq, minimized: false } } : prev))
  const minimizeApp = (id: string) =>
    setWindows((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], minimized: true } } : prev))
  const closeApp = (id: string) =>
    setWindows((prev) => {
      const n = { ...prev }
      delete n[id]
      return n
    })
  const toggleTaskbar = (id: string) =>
    setWindows((prev) => {
      const w = prev[id]
      if (!w) return prev
      if (w.minimized) return { ...prev, [id]: { ...w, minimized: false, z: ++seq } }
      // if focused already, minimize; else focus
      const topZ = Math.max(...Object.values(prev).map((x) => x.z))
      if (w.z === topZ) return { ...prev, [id]: { ...w, minimized: true } }
      return { ...prev, [id]: { ...w, z: ++seq } }
    })

  const topId = useMemo(() => {
    let top: string | null = null
    let z = -1
    for (const [id, w] of Object.entries(windows)) if (!w.minimized && w.z > z) (z = w.z), (top = id)
    return top
  }, [windows])

  const renderAppBody = (id: AppId) => {
    switch (id) {
      case "mycomputer":
        return <MyComputer era={era} caseStudies={caseStudies} />
      case "about":
        return <Notepad era={era} body={aboutBody} photo={charityPhoto} />
      case "resume":
        return <ResumeViewer era={era} url={resumeUrl} />
      case "aim":
        return <AimMessenger era={era} isMobile={isMobile} />
      case "paint":
        return <Paint era={era} />
      case "minesweeper":
        return <Minesweeper era={era} isMobile={isMobile} />
      case "pinball":
        return <Pinball era={era} />
      case "games":
        return <GamesFolder era={era} onOpen={openApp} />
      case "display":
        return <DisplayProperties {...props} />
      default:
        return null
    }
  }

  // Desktop icons
  const desktopIcons: { id: AppId | "recycle"; label: string; icon: React.ReactNode }[] = [
    { id: "mycomputer", label: "My Computer", icon: <MyComputerIcon size={isMobile ? 40 : 32} /> },
    { id: "about", label: "About Me", icon: <NotepadIcon size={isMobile ? 40 : 32} /> },
    { id: "aim", label: "AOL IM", icon: <AimIcon size={isMobile ? 40 : 32} /> },
    { id: "games", label: "Games", icon: <FolderIcon size={isMobile ? 40 : 32} /> },
    { id: "resume", label: "Resume", icon: <DocIcon size={isMobile ? 40 : 32} /> },
    { id: "recycle", label: "Recycle Bin", icon: <RecycleBinIcon size={isMobile ? 40 : 32} /> },
  ]

  if (booting) {
    return <BootSplash era={era} />
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden select-none"
      style={{ background: t.desktopFallback, fontFamily: t.fontFamily }}
      onClick={() => startOpen && setStartOpen(false)}
    >
      {/* Wallpaper */}
      <img
        src={wallpaperUrl || "/placeholder.svg"}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      />

      {/* Desktop icons */}
      <div
        className={
          isMobile
            ? "absolute inset-x-0 top-0 bottom-[48px] p-4 grid grid-cols-4 gap-3 content-start z-10"
            : "absolute top-2 left-2 flex flex-col gap-4 z-10"
        }
      >
        {desktopIcons.map((di) => (
          <button
            key={di.id}
            onDoubleClick={() => di.id !== "recycle" && openApp(di.id as AppId)}
            onClick={(e) => {
              // On touch, single tap opens; on desktop single tap just selects (double opens).
              if (isMobile && di.id !== "recycle") openApp(di.id as AppId)
              e.stopPropagation()
            }}
            className="flex flex-col items-center gap-1 w-[74px] p-1 rounded group"
          >
            <span className="drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">{di.icon}</span>
            <span className="text-[11px] text-white text-center leading-tight px-1 group-hover:bg-[#0a3a8a]/70 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
              {di.label}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {Object.entries(windows).map(([id, w]) =>
        w.minimized ? null : (
          <RetroWindow
            key={id}
            era={era}
            title={APP_META[id as AppId].title}
            icon={APP_META[id as AppId].icon({ size: 14 })}
            isFocused={topId === id}
            isMobile={isMobile}
            initialPosition={w.pos}
            width={APP_META[id as AppId].w}
            height={APP_META[id as AppId].h}
            zIndex={w.z}
            onFocus={() => focusApp(id)}
            onClose={() => closeApp(id)}
            onMinimize={() => minimizeApp(id)}
          >
            {renderAppBody(id as AppId)}
          </RetroWindow>
        ),
      )}

      {/* Start menu */}
      {startOpen && (
        <StartMenu
          era={era}
          isMobile={isMobile}
          onOpen={openApp}
          onExit={props.onExit}
          onClose={() => setStartOpen(false)}
        />
      )}

      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40px] flex items-center gap-1 px-1 z-40"
        style={{
          background: t.taskbar,
          borderTop: era === "win2000" ? `1px solid ${t.faceLight}` : "1px solid #4a86e8",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setStartOpen((s) => !s)}
          className="flex items-center gap-1 h-[30px] px-2 font-bold text-[14px] italic active:translate-y-px"
          style={
            era === "xp"
              ? {
                  background: t.startButton,
                  color: "#fff",
                  borderRadius: "3px 12px 12px 3px",
                  border: "1px solid #2a6a20",
                  boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.4)",
                }
              : { ...raisedBevel(t), color: "#000", fontStyle: "normal" }
          }
        >
          <StartFlagIcon size={18} />
          start
        </button>

        <div className="w-[3px] h-[26px] mx-1" style={{ borderLeft: "1px solid rgba(0,0,0,0.3)", borderRight: "1px solid rgba(255,255,255,0.3)" }} />

        {/* Running windows */}
        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
          {Object.entries(windows).map(([id, w]) => (
            <button
              key={id}
              onClick={() => toggleTaskbar(id)}
              className="flex items-center gap-1 h-[30px] px-2 text-[12px] min-w-0 max-w-[160px] active:translate-y-px"
              style={
                topId === id && !w.minimized
                  ? { ...sunkenBevel(t), background: era === "xp" ? "#1a52c9" : "#c0bcb4", color: era === "xp" ? "#fff" : "#000" }
                  : { ...raisedBevel(t), background: era === "xp" ? "#3f7fe6" : t.windowBg, color: era === "xp" ? "#fff" : "#000" }
              }
            >
              <span className="shrink-0">{APP_META[id as AppId].icon({ size: 14 })}</span>
              <span className="truncate">{APP_META[id as AppId].title}</span>
            </button>
          ))}
        </div>

        {/* System tray + clock */}
        <div
          className="flex items-center gap-2 h-[26px] px-2 text-[12px]"
          style={era === "xp" ? { background: "#1290e9", color: "#fff", borderLeft: "1px solid #0d6ec2" } : { ...sunkenBevel(t), color: "#000" }}
        >
          {clock}
        </div>
      </div>
    </div>
  )
}

// ---------- Boot splash ----------
function BootSplash({ era }: { era: RetroEra }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white" style={{ fontFamily: RETRO_THEMES[era].fontFamily }}>
      {era === "xp" ? (
        <>
          <div className="flex items-center gap-3 mb-8">
            <StartFlagIcon size={44} />
            <div className="leading-none text-left">
              <p className="text-[13px] text-gray-300">Microsoft</p>
              <p className="text-[30px] font-bold tracking-tight">
                Windows<span className="text-orange-400 align-super text-[16px]">xp</span>
              </p>
            </div>
          </div>
          <div className="w-[180px] h-[14px] border border-gray-600 rounded-full overflow-hidden">
            <div className="h-full w-[60px] rounded-full animate-[bootslide_1.4s_ease-in-out_infinite]" style={{ background: "linear-gradient(90deg,#0a3,#6f6,#0a3)" }} />
          </div>
          <style>{`@keyframes bootslide{0%{transform:translateX(-60px)}100%{transform:translateX(180px)}}`}</style>
        </>
      ) : (
        <>
          <p className="text-[22px] mb-6">
            Microsoft<span className="mx-2 font-bold">Windows 2000</span>
          </p>
          <p className="text-[12px] text-gray-400 mb-4">Professional</p>
          <div className="w-[220px] h-[16px] border border-gray-600">
            <div className="h-full w-[70px] bg-[#3a6ea5] animate-[bootslide_1.2s_linear_infinite]" />
          </div>
          <style>{`@keyframes bootslide{0%{margin-left:0}100%{margin-left:150px}}`}</style>
        </>
      )}
      <p className="mt-8 text-[11px] text-gray-500">Charity Dupont • Portfolio OS</p>
    </div>
  )
}

// ---------- Start menu ----------
function StartMenu({
  era,
  isMobile,
  onOpen,
  onExit,
  onClose,
}: {
  era: RetroEra
  isMobile: boolean
  onOpen: (id: AppId) => void
  onExit: () => void
  onClose: () => void
}) {
  const t = RETRO_THEMES[era]
  const items: { id: AppId; label: string; icon: React.ReactNode }[] = [
    { id: "mycomputer", label: "My Computer", icon: <MyComputerIcon size={22} /> },
    { id: "about", label: "About Charity", icon: <NotepadIcon size={22} /> },
    { id: "aim", label: "AOL Instant Messenger", icon: <AimIcon size={22} /> },
    { id: "resume", label: "Resume", icon: <DocIcon size={22} /> },
    { id: "games", label: "Games", icon: <FolderIcon size={22} /> },
    { id: "display", label: "Display Properties", icon: <DisplayIcon size={22} /> },
  ]
  return (
    <div
      className="absolute bottom-[40px] left-1 z-50"
      style={{ width: isMobile ? "calc(100% - 8px)" : 260 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ ...raisedBevel(t), padding: 0 }}>
        {/* Header band */}
        <div
          className="px-3 py-2 text-white font-bold text-[15px]"
          style={{ background: era === "xp" ? "linear-gradient(180deg,#1a6fe0,#0a3aa0)" : "linear-gradient(180deg,#0a246a,#3a6ea5)" }}
        >
          Charity Dupont
          <span className="block text-[10px] font-normal opacity-80">Portfolio OS</span>
        </div>
        <div className="flex">
          {/* left blue rail (xp) */}
          {!isMobile && era === "xp" && <div className="w-[6px]" style={{ background: "#2a6fdb" }} />}
          <div className="flex-1 bg-white">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => {
                  onOpen(it.id)
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-black hover:bg-[#2a6fdb] hover:text-white text-left"
              >
                <span className="shrink-0">{it.icon}</span>
                {it.label}
              </button>
            ))}
            <div className="border-t border-gray-300" />
            <button
              onClick={() => {
                onExit()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-black hover:bg-[#c00] hover:text-white text-left"
            >
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded bg-[#c00] text-white text-[13px] font-bold shrink-0">
                ⏻
              </span>
              Turn Off Computer (back to Mac)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Games folder ----------
function GamesFolder({ era, onOpen }: { era: RetroEra; onOpen: (id: AppId) => void }) {
  const t = RETRO_THEMES[era]
  const games: { id: AppId; label: string; icon: React.ReactNode }[] = [
    { id: "minesweeper", label: "Minesweeper", icon: <MineIcon size={40} /> },
    { id: "paint", label: "Paint", icon: <PaintIcon size={40} /> },
    { id: "pinball", label: "3D Pinball", icon: <PinballIcon size={40} /> },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: t.windowBg, fontFamily: t.fontFamily }}>
      <div className="flex items-center gap-3 px-2 py-[3px] border-b border-[#808080] text-[12px] text-black">
        {["File", "Edit", "View", "Help"].map((m) => (
          <span key={m} className="cursor-default hover:underline">
            <span className="underline">{m[0]}</span>
            {m.slice(1)}
          </span>
        ))}
      </div>
      <div className="flex-1 bg-white p-4 flex flex-wrap gap-4 content-start">
        {games.map((g) => (
          <button
            key={g.id}
            onDoubleClick={() => onOpen(g.id)}
            onClick={() => onOpen(g.id)}
            className="w-[92px] flex flex-col items-center gap-1 p-2 rounded hover:bg-[#e8eef9] focus:bg-[#cbdcf5] outline-none text-black"
          >
            {g.icon}
            <span className="text-[11px] text-center">{g.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Display Properties (switch wallpaper / exit) ----------
function DisplayProperties({
  era,
  backgroundOptions,
  currentBackgroundId,
  onSelectBackground,
}: RetroProps) {
  const t = RETRO_THEMES[era]
  return (
    <div className="flex flex-col h-full text-black text-[12px]" style={{ background: t.windowBg, fontFamily: t.fontFamily }}>
      {/* Tabs */}
      <div className="flex items-end gap-1 px-2 pt-2">
        <span className="px-3 py-1" style={{ ...raisedBevel(t), borderBottom: "none" }}>
          Background
        </span>
      </div>
      <div className="mx-2 mb-2 flex-1 min-h-0 flex flex-col" style={{ ...raisedBevel(t), padding: 10 }}>
        {/* Monitor preview */}
        <div className="flex justify-center mb-3">
          <div className="w-[150px] p-2 pb-5 rounded-md" style={{ ...raisedBevel(t) }}>
            <div className="h-[86px] rounded-sm overflow-hidden border border-black">
              <img
                src={backgroundOptions.find((b) => b.id === currentBackgroundId)?.url || "/placeholder.svg"}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <p className="mb-1 font-bold">Select a background or wallpaper:</p>
        <div className="flex-1 min-h-0 overflow-y-auto p-1" style={sunkenBevel(t)}>
          {backgroundOptions.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBackground(b)}
              className={`w-full flex items-center gap-2 px-2 py-1 text-left ${
                b.id === currentBackgroundId ? "bg-[#0a246a] text-white" : "hover:bg-[#cbdcf5] text-black"
              }`}
            >
              <img src={b.preview || "/placeholder.svg"} alt="" className="w-6 h-6 object-cover border border-gray-500" />
              <span>
                {b.name}
                {b.retro ? "  (Retro OS)" : ""}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-600 mt-2">
          Tip: pick a non-retro wallpaper to return to the modern Mac experience.
        </p>
      </div>
    </div>
  )
}
