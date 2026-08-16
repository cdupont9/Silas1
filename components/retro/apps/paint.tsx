"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { RETRO_THEMES, raisedBevel, sunkenBevel, type RetroEra } from "../retro-theme"

interface PaintProps {
  era: RetroEra
}

type Tool = "pencil" | "brush" | "line" | "rect" | "ellipse" | "eraser" | "fill"

const PALETTE = [
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
  "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",
]

const TOOLS: { id: Tool; label: string }[] = [
  { id: "pencil", label: "✏️" },
  { id: "brush", label: "🖌" },
  { id: "line", label: "＼" },
  { id: "rect", label: "▭" },
  { id: "ellipse", label: "◯" },
  { id: "eraser", label: "▧" },
  { id: "fill", label: "🪣" },
]

export function Paint({ era }: PaintProps) {
  const t = RETRO_THEMES[era]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snapshotRef = useRef<ImageData | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const drawingRef = useRef(false)
  const [tool, setTool] = useState<Tool>("pencil")
  const [color, setColor] = useState("#000000")
  const [size, setSize] = useState(3)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cv.width, cv.height)
  }, [])

  const getPos = (e: React.PointerEvent) => {
    const cv = canvasRef.current!
    const rect = cv.getBoundingClientRect()
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * cv.width),
      y: Math.round(((e.clientY - rect.top) / rect.height) * cv.height),
    }
  }

  const ctxOf = () => canvasRef.current!.getContext("2d")!

  const floodFill = (x: number, y: number, hex: string) => {
    const cv = canvasRef.current!
    const ctx = ctxOf()
    const img = ctx.getImageData(0, 0, cv.width, cv.height)
    const data = img.data
    const w = cv.width
    const idx = (px: number, py: number) => (py * w + px) * 4
    const start = idx(x, y)
    const target = [data[start], data[start + 1], data[start + 2], data[start + 3]]
    const rgb = hexToRgb(hex)
    if (target[0] === rgb[0] && target[1] === rgb[1] && target[2] === rgb[2]) return
    const stack: [number, number][] = [[x, y]]
    const match = (i: number) =>
      Math.abs(data[i] - target[0]) < 10 &&
      Math.abs(data[i + 1] - target[1]) < 10 &&
      Math.abs(data[i + 2] - target[2]) < 10
    while (stack.length) {
      const [px, py] = stack.pop()!
      if (px < 0 || py < 0 || px >= w || py >= cv.height) continue
      const i = idx(px, py)
      if (!match(i)) continue
      data[i] = rgb[0]
      data[i + 1] = rgb[1]
      data[i + 2] = rgb[2]
      data[i + 3] = 255
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1])
    }
    ctx.putImageData(img, 0, 0)
  }

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault()
    const cv = canvasRef.current!
    cv.setPointerCapture(e.pointerId)
    const p = getPos(e)
    const ctx = ctxOf()
    if (tool === "fill") {
      floodFill(p.x, p.y, color)
      return
    }
    drawingRef.current = true
    startRef.current = p
    snapshotRef.current = ctx.getImageData(0, 0, cv.width, cv.height)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }
  }

  const onMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return
    const ctx = ctxOf()
    const p = getPos(e)
    const start = startRef.current!
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color
    ctx.fillStyle = tool === "eraser" ? "#ffffff" : color
    ctx.lineWidth = tool === "brush" ? size * 2 : tool === "eraser" ? size * 4 : size

    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      return
    }
    // Shape preview: restore snapshot then draw the in-progress shape.
    if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0)
    ctx.beginPath()
    if (tool === "line") {
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    } else if (tool === "rect") {
      ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y)
    } else if (tool === "ellipse") {
      ctx.ellipse(
        (start.x + p.x) / 2,
        (start.y + p.y) / 2,
        Math.abs(p.x - start.x) / 2,
        Math.abs(p.y - start.y) / 2,
        0,
        0,
        Math.PI * 2,
      )
      ctx.stroke()
    }
  }

  const onUp = () => {
    drawingRef.current = false
    startRef.current = null
    snapshotRef.current = null
  }

  const clearCanvas = () => {
    const cv = canvasRef.current!
    const ctx = ctxOf()
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cv.width, cv.height)
  }

  return (
    <div className="flex flex-col h-full text-black" style={{ background: t.windowBg, fontFamily: t.fontFamily }}>
      <div className="flex items-center gap-3 px-2 py-[3px] border-b border-[#808080] text-[12px]">
        {["File", "Edit", "View", "Image", "Colors", "Help"].map((m) => (
          <span key={m} className="cursor-default hover:underline">
            <span className="underline">{m[0]}</span>
            {m.slice(1)}
          </span>
        ))}
        <button onClick={clearCanvas} className="ml-auto px-2 py-[1px] text-[11px] active:translate-y-px" style={raisedBevel(t)}>
          Clear
        </button>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Tool box */}
        <div className="w-[62px] shrink-0 p-1 border-r border-[#808080]">
          <div className="grid grid-cols-2 gap-1">
            {TOOLS.map((tl) => (
              <button
                key={tl.id}
                onClick={() => setTool(tl.id)}
                className="h-7 text-[13px] flex items-center justify-center active:translate-y-px"
                style={tool === tl.id ? sunkenBevel(t) : raisedBevel(t)}
                title={tl.id}
                aria-label={tl.id}
                aria-pressed={tool === tl.id}
              >
                {tl.label}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px]">Size</div>
          <div className="flex flex-col gap-1 mt-1">
            {[2, 4, 8].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="h-5 flex items-center justify-center active:translate-y-px"
                style={size === s ? sunkenBevel(t) : raisedBevel(t)}
              >
                <span className="rounded-full bg-black" style={{ width: s + 2, height: s + 2 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 min-h-0 p-2 overflow-auto" style={{ background: "#808080" }}>
          <canvas
            ref={canvasRef}
            width={520}
            height={340}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className="bg-white touch-none max-w-full"
            style={{ border: "1px solid #000", cursor: "crosshair", imageRendering: "pixelated" }}
          />
        </div>
      </div>

      {/* Palette */}
      <div className="flex items-center gap-2 p-1 border-t border-[#808080]">
        <div className="w-8 h-8 shrink-0" style={{ ...sunkenBevel(t), background: color }} aria-label="Current color" />
        <div className="grid grid-rows-2 grid-flow-col gap-[2px]">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-4 h-4"
              style={{ background: c, border: "1px solid #808080" }}
              aria-label={`color ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
