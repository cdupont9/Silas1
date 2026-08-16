"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { RETRO_THEMES, raisedBevel, sunkenBevel, type RetroEra } from "../retro-theme"

interface MinesweeperProps {
  era: RetroEra
  isMobile: boolean
}

type Cell = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  count: number
}

const ROWS = 9
const COLS = 9
const MINES = 10

const NUM_COLORS = ["", "#0000ff", "#008000", "#ff0000", "#000080", "#800000", "#008080", "#000000", "#808080"]

function makeEmpty(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })),
  )
}

// Place mines after first click so the first cell is always safe.
function placeMines(board: Cell[][], safeR: number, safeC: number): Cell[][] {
  const b = board.map((row) => row.map((c) => ({ ...c })))
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (b[r][c].mine) continue
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
    b[r][c].mine = true
    placed++
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (b[r][c].mine) continue
      let n = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine) n++
        }
      b[r][c].count = n
    }
  }
  return b
}

export function Minesweeper({ era, isMobile }: MinesweeperProps) {
  const t = RETRO_THEMES[era]
  const [board, setBoard] = useState<Cell[][]>(makeEmpty)
  const [started, setStarted] = useState(false)
  const [dead, setDead] = useState(false)
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(0)
  const [flagMode, setFlagMode] = useState(false) // touch-friendly flagging toggle

  const flags = useMemo(() => board.flat().filter((c) => c.flagged).length, [board])
  const minesLeft = MINES - flags

  useEffect(() => {
    if (!started || dead || won) return
    const id = setInterval(() => setTime((x) => Math.min(999, x + 1)), 1000)
    return () => clearInterval(id)
  }, [started, dead, won])

  const reset = useCallback(() => {
    setBoard(makeEmpty())
    setStarted(false)
    setDead(false)
    setWon(false)
    setTime(0)
  }, [])

  const floodReveal = (b: Cell[][], r: number, c: number) => {
    const stack: [number, number][] = [[r, c]]
    while (stack.length) {
      const [cr, cc] = stack.pop()!
      const cell = b[cr][cc]
      if (cell.revealed || cell.flagged) continue
      cell.revealed = true
      if (cell.count === 0 && !cell.mine) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr
            const nc = cc + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !b[nr][nc].revealed) stack.push([nr, nc])
          }
      }
    }
  }

  const checkWin = (b: Cell[][]) => b.flat().every((c) => c.mine || c.revealed)

  const reveal = (r: number, c: number) => {
    if (dead || won) return
    if (flagMode) return toggleFlag(r, c)
    let b = board.map((row) => row.map((cell) => ({ ...cell })))
    if (!started) {
      b = placeMines(b, r, c)
      setStarted(true)
    }
    if (b[r][c].flagged || b[r][c].revealed) return
    if (b[r][c].mine) {
      b.forEach((row) => row.forEach((cell) => (cell.revealed = cell.mine ? true : cell.revealed)))
      b[r][c].revealed = true
      setBoard(b)
      setDead(true)
      return
    }
    floodReveal(b, r, c)
    setBoard(b)
    if (checkWin(b)) setWon(true)
  }

  const toggleFlag = (r: number, c: number) => {
    if (dead || won) return
    const b = board.map((row) => row.map((cell) => ({ ...cell })))
    if (b[r][c].revealed) return
    b[r][c].flagged = !b[r][c].flagged
    setBoard(b)
  }

  const face = dead ? "😵" : won ? "😎" : "🙂"

  const cellSize = isMobile ? 30 : 24

  return (
    <div
      className="h-full w-full flex items-start justify-center p-3 select-none"
      style={{ background: t.windowBg, fontFamily: t.fontFamily }}
    >
      <div className="p-1" style={raisedBevel(t)}>
        {/* Scoreboard */}
        <div className="flex items-center justify-between p-1 mb-1" style={sunkenBevel(t)}>
          <LedNumber value={minesLeft} />
          <button
            onClick={reset}
            className="w-8 h-8 text-[18px] leading-none active:translate-y-px"
            style={raisedBevel(t)}
            aria-label="New game"
          >
            {face}
          </button>
          <LedNumber value={time} />
        </div>
        {/* Flag toggle (handy on touch) */}
        <button
          onClick={() => setFlagMode((f) => !f)}
          className="w-full mb-1 py-[3px] text-[11px] active:translate-y-px"
          style={raisedBevel(t)}
        >
          {flagMode ? "Mode: 🚩 Flag" : "Mode: ⛏ Dig"} (tap to switch)
        </button>
        {/* Grid */}
        <div style={sunkenBevel(t)}>
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => {
                const revealed = cell.revealed
                return (
                  <button
                    key={c}
                    onClick={() => reveal(r, c)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      toggleFlag(r, c)
                    }}
                    className="flex items-center justify-center text-[14px] font-bold leading-none"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      ...(revealed
                        ? {
                            border: "1px solid #a0a0a0",
                            background: cell.mine ? "#ff0000" : "#c0c0c0",
                          }
                        : raisedBevel(t)),
                      color: NUM_COLORS[cell.count] || "#000",
                    }}
                  >
                    {revealed
                      ? cell.mine
                        ? "💣"
                        : cell.count > 0
                          ? cell.count
                          : ""
                      : cell.flagged
                        ? "🚩"
                        : ""}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-center mt-1 text-black">
          {won ? "You cleared the field!" : dead ? "Boom! Click the face to retry." : `${ROWS}×${COLS} • ${MINES} mines`}
        </p>
      </div>
    </div>
  )
}

// Classic red LED 3-digit display.
function LedNumber({ value }: { value: number }) {
  const clamped = Math.max(-99, Math.min(999, value))
  const text = clamped < 0 ? `-${String(Math.abs(clamped)).padStart(2, "0")}` : String(clamped).padStart(3, "0")
  return (
    <div
      className="px-1 font-mono text-[20px] font-bold tracking-widest"
      style={{ background: "#000", color: "#ff2b2b", minWidth: 46, textAlign: "center" }}
    >
      {text}
    </div>
  )
}
