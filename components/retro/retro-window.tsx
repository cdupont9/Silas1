"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { RETRO_THEMES, type RetroEra } from "./retro-theme"

interface RetroWindowProps {
  era: RetroEra
  title: string
  icon?: React.ReactNode
  isFocused: boolean
  isMobile: boolean
  initialPosition?: { x: number; y: number }
  width?: number
  height?: number
  zIndex: number
  resizable?: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  children: React.ReactNode
}

// A draggable, classic-Windows-styled window frame shared by every retro app.
export function RetroWindow({
  era,
  title,
  icon,
  isFocused,
  isMobile,
  initialPosition = { x: 120, y: 80 },
  width = 640,
  height = 460,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  children,
}: RetroWindowProps) {
  const t = RETRO_THEMES[era]
  const [pos, setPos] = useState(initialPosition)
  const [maximized, setMaximized] = useState(false)
  const dragState = useRef<{ dragging: boolean; offX: number; offY: number }>({ dragging: false, offX: 0, offY: 0 })

  useEffect(() => {
    if (!dragState.current) return
    const onMove = (e: MouseEvent) => {
      if (!dragState.current.dragging) return
      setPos({
        x: Math.max(0, e.clientX - dragState.current.offX),
        y: Math.max(0, e.clientY - dragState.current.offY),
      })
    }
    const onUp = () => {
      dragState.current.dragging = false
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  const startDrag = (e: React.MouseEvent) => {
    if (isMobile || maximized) return
    onFocus()
    dragState.current = { dragging: true, offX: e.clientX - pos.x, offY: e.clientY - pos.y }
  }

  // On mobile every window fills the screen (single-window feel like a real phone app).
  const frameStyle: React.CSSProperties =
    isMobile || maximized
      ? { position: "absolute", inset: 0, zIndex, display: "flex", flexDirection: "column" }
      : {
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width,
          height,
          zIndex,
          display: "flex",
          flexDirection: "column",
        }

  const btnStyle: React.CSSProperties = {
    borderTop: `1px solid ${t.faceLight}`,
    borderLeft: `1px solid ${t.faceLight}`,
    borderRight: `1px solid ${t.faceDark}`,
    borderBottom: `1px solid ${t.faceDark}`,
    background: t.windowBg,
  }

  return (
    <div
      style={{
        ...frameStyle,
        background: t.windowBg,
        border: `1px solid ${t.windowBorder}`,
        boxShadow: era === "xp" ? "2px 2px 10px rgba(0,0,0,0.4)" : "1px 1px 0 #000, 2px 2px 6px rgba(0,0,0,0.35)",
        fontFamily: t.fontFamily,
        borderRadius: era === "xp" && !(isMobile || maximized) ? "8px 8px 0 0" : 0,
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        onMouseDown={startDrag}
        onDoubleClick={() => !isMobile && setMaximized((m) => !m)}
        style={{
          height: 26,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 4px 0 6px",
          cursor: isMobile ? "default" : "move",
          background: isFocused ? t.titleBarActive : t.titleBarInactive,
          color: t.titleText,
          borderRadius: era === "xp" && !(isMobile || maximized) ? "7px 7px 0 0" : 0,
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {icon && <span className="flex items-center justify-center w-4 h-4 shrink-0">{icon}</span>}
        <span className="text-[13px] font-bold truncate drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">{title}</span>
        <div className="ml-auto flex items-center gap-[2px]">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
            className="w-[21px] h-[20px] flex items-end justify-center pb-[3px] active:translate-y-px"
            style={btnStyle}
          >
            <span className="block w-[9px] h-[2px] bg-black" />
          </button>
          {!isMobile && (
            <button
              aria-label="Maximize"
              onClick={(e) => {
                e.stopPropagation()
                setMaximized((m) => !m)
              }}
              className="w-[21px] h-[20px] flex items-center justify-center active:translate-y-px"
              style={btnStyle}
            >
              <span className="block w-[10px] h-[9px] border-2 border-black border-t-[3px]" />
            </button>
          )}
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="w-[21px] h-[20px] flex items-center justify-center text-[13px] font-bold leading-none active:translate-y-px"
            style={{
              ...btnStyle,
              background: era === "xp" ? "linear-gradient(180deg,#e8846b 0%,#d14a2b 100%)" : t.windowBg,
              color: era === "xp" ? "#fff" : "#000",
            }}
          >
            <span className="-mt-[1px]">×</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ background: t.windowBg }}>
        {children}
      </div>
    </div>
  )
}
