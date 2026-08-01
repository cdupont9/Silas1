"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { RETRO_THEMES, raisedBevel, type RetroEra } from "../retro-theme"

interface PinballProps {
  era: RetroEra
}

const W = 320
const H = 520
const R = 8 // ball radius
const GRAV = 0.22
const FRICTION = 0.999

type Vec = { x: number; y: number }
type Bumper = { x: number; y: number; r: number; score: number }
type Wall = { a: Vec; b: Vec } // static line segment

// Static table geometry (walls). The plunger lane is on the right; a drain gap sits bottom-center.
const WALLS: Wall[] = [
  { a: { x: 12, y: 20 }, b: { x: 12, y: 470 } }, // left wall
  { a: { x: 288, y: 20 }, b: { x: 288, y: 500 } }, // right outer wall (plunger lane)
  { a: { x: 12, y: 20 }, b: { x: 288, y: 20 } }, // top wall
  { a: { x: 262, y: 60 }, b: { x: 262, y: 470 } }, // plunger lane inner wall
  { a: { x: 12, y: 470 }, b: { x: 110, y: 512 } }, // left drain slope
  { a: { x: 262, y: 470 }, b: { x: 210, y: 512 } }, // right drain slope
  { a: { x: 12, y: 120 }, b: { x: 60, y: 60 } }, // top-left angled feeder
]

const BUMPERS: Bumper[] = [
  { x: 90, y: 130, r: 20, score: 100 },
  { x: 170, y: 100, r: 20, score: 100 },
  { x: 135, y: 200, r: 22, score: 250 },
  { x: 70, y: 260, r: 16, score: 150 },
  { x: 200, y: 250, r: 16, score: 150 },
]

// Flipper pivots near the bottom.
const LEFT_PIVOT = { x: 95, y: 452 }
const RIGHT_PIVOT = { x: 179, y: 452 }
const FLIP_LEN = 62
const REST_ANGLE = 0.5 // radians below horizontal
const UP_ANGLE = -0.5

function closestPointOnSeg(p: Vec, a: Vec, b: Vec): Vec {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / (abx * abx + aby * aby || 1)))
  return { x: a.x + abx * t, y: a.y + aby * t }
}

export function Pinball({ era }: PinballProps) {
  const t = RETRO_THEMES[era]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  const ball = useRef<{ p: Vec; v: Vec; inLane: boolean }>({ p: { x: 275, y: 460 }, v: { x: 0, y: 0 }, inLane: true })
  const leftDown = useRef(false)
  const rightDown = useRef(false)
  const leftAngle = useRef(REST_ANGLE)
  const rightAngle = useRef(REST_ANGLE)
  const plunger = useRef(0) // charge 0..1
  const plungerCharging = useRef(false)

  const [score, setScore] = useState(0)
  const [balls, setBalls] = useState(3)
  const [msg, setMsg] = useState("Hold LAUNCH (or Space) to charge, release to play")
  const scoreRef = useRef(0)
  const ballsRef = useRef(3)

  const addScore = (n: number) => {
    scoreRef.current += n
    setScore(scoreRef.current)
  }

  const resetBall = useCallback(() => {
    ball.current = { p: { x: 275, y: 460 }, v: { x: 0, y: 0 }, inLane: true }
    plunger.current = 0
  }, [])

  const newGame = useCallback(() => {
    scoreRef.current = 0
    ballsRef.current = 3
    setScore(0)
    setBalls(3)
    setMsg("Hold LAUNCH (or Space) to charge, release to play")
    resetBall()
  }, [resetBall])

  const launch = useCallback(() => {
    if (!ball.current.inLane) return
    const power = 6 + plunger.current * 12
    ball.current.v = { x: 0, y: -power }
    ball.current.inLane = false
    plunger.current = 0
    setMsg("")
  }, [])

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "z" || e.key === "Z") leftDown.current = true
      if (e.key === "ArrowRight" || e.key === "/" || e.key === "x" || e.key === "X") rightDown.current = true
      if (e.key === " ") {
        e.preventDefault()
        plungerCharging.current = true
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "z" || e.key === "Z") leftDown.current = false
      if (e.key === "ArrowRight" || e.key === "/" || e.key === "x" || e.key === "X") rightDown.current = false
      if (e.key === " ") {
        plungerCharging.current = false
        launch()
      }
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [launch])

  // Physics + render loop
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext("2d")!

    const flipperSeg = (pivot: Vec, angle: number, dir: 1 | -1): Wall => ({
      a: pivot,
      b: { x: pivot.x + Math.cos(angle) * FLIP_LEN * dir, y: pivot.y + Math.sin(angle) * FLIP_LEN },
    })

    const step = () => {
      const b = ball.current

      // Flipper angles ease toward target
      const lTarget = leftDown.current ? UP_ANGLE : REST_ANGLE
      const rTarget = rightDown.current ? UP_ANGLE : REST_ANGLE
      const prevL = leftAngle.current
      const prevR = rightAngle.current
      leftAngle.current += (lTarget - leftAngle.current) * 0.4
      rightAngle.current += (rTarget - rightAngle.current) * 0.4

      // Plunger charge
      if (plungerCharging.current && b.inLane) plunger.current = Math.min(1, plunger.current + 0.02)

      if (b.inLane) {
        // Ball waits in lane, gently rests at bottom of lane.
        b.p.x = 275
        b.p.y = 460
      } else {
        b.v.y += GRAV
        b.v.x *= FRICTION
        b.v.y *= FRICTION
        // integrate with a couple of substeps for stability
        const steps = 3
        for (let s = 0; s < steps; s++) {
          b.p.x += b.v.x / steps
          b.p.y += b.v.y / steps

          // Walls
          for (const w of WALLS) collideSeg(b, w)

          // Flippers (moving segments; add impulse when flipping up)
          const lSeg = flipperSeg(LEFT_PIVOT, leftAngle.current, 1)
          const rSeg = flipperSeg(RIGHT_PIVOT, rightAngle.current, -1)
          const lMoving = leftAngle.current < prevL - 0.01
          const rMoving = rightAngle.current < prevR - 0.01
          collideSeg(b, lSeg, lMoving ? 5 : 0)
          collideSeg(b, rSeg, rMoving ? 5 : 0)

          // Bumpers
          for (const bm of BUMPERS) {
            const dx = b.p.x - bm.x
            const dy = b.p.y - bm.y
            const dist = Math.hypot(dx, dy)
            if (dist < bm.r + R) {
              const nx = dx / (dist || 1)
              const ny = dy / (dist || 1)
              b.p.x = bm.x + nx * (bm.r + R)
              b.p.y = bm.y + ny * (bm.r + R)
              const dot = b.v.x * nx + b.v.y * ny
              b.v.x = (b.v.x - 2 * dot * nx) * 0.9 + nx * 2
              b.v.y = (b.v.y - 2 * dot * ny) * 0.9 + ny * 2
              addScore(bm.score)
            }
          }
        }

        // Drain
        if (b.p.y > H + 20) {
          ballsRef.current -= 1
          setBalls(ballsRef.current)
          if (ballsRef.current <= 0) {
            setMsg(`GAME OVER — ${scoreRef.current} pts. Press New Game.`)
            b.inLane = true
            b.p = { x: 275, y: 460 }
            b.v = { x: 0, y: 0 }
          } else {
            setMsg("Ball lost! Launch again.")
            resetBall()
          }
        }
      }

      // ---- Render ----
      ctx.clearRect(0, 0, W, H)
      // Table background
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, "#12245a")
      grad.addColorStop(1, "#0a1636")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Walls
      ctx.strokeStyle = "#8fb3ff"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      for (const w of WALLS) {
        ctx.beginPath()
        ctx.moveTo(w.a.x, w.a.y)
        ctx.lineTo(w.b.x, w.b.y)
        ctx.stroke()
      }

      // Bumpers
      for (const bm of BUMPERS) {
        ctx.beginPath()
        ctx.arc(bm.x, bm.y, bm.r, 0, Math.PI * 2)
        ctx.fillStyle = bm.score >= 250 ? "#f4a300" : bm.score >= 150 ? "#2a9d8f" : "#e63946"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(bm.x, bm.y, bm.r * 0.45, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.6)"
        ctx.fill()
      }

      // Flippers
      const drawFlip = (pivot: Vec, angle: number, dir: 1 | -1) => {
        const end = { x: pivot.x + Math.cos(angle) * FLIP_LEN * dir, y: pivot.y + Math.sin(angle) * FLIP_LEN }
        ctx.beginPath()
        ctx.moveTo(pivot.x, pivot.y)
        ctx.lineTo(end.x, end.y)
        ctx.strokeStyle = "#e8e8ff"
        ctx.lineWidth = 12
        ctx.lineCap = "round"
        ctx.stroke()
      }
      drawFlip(LEFT_PIVOT, leftAngle.current, 1)
      drawFlip(RIGHT_PIVOT, rightAngle.current, -1)

      // Ball
      if (!b.inLane || true) {
        ctx.beginPath()
        ctx.arc(b.p.x, b.p.y, R, 0, Math.PI * 2)
        const bg = ctx.createRadialGradient(b.p.x - 3, b.p.y - 3, 1, b.p.x, b.p.y, R)
        bg.addColorStop(0, "#ffffff")
        bg.addColorStop(1, "#8a8a8a")
        ctx.fillStyle = bg
        ctx.fill()
      }

      // Plunger charge indicator
      if (b.inLane && plunger.current > 0) {
        ctx.fillStyle = "#3ac13a"
        ctx.fillRect(268, 500 - plunger.current * 40, 14, plunger.current * 40)
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [resetBall])

  // Ball-vs-segment collision with optional extra impulse (for active flippers).
  function collideSeg(b: { p: Vec; v: Vec }, w: Wall, impulse = 0) {
    const cp = closestPointOnSeg(b.p, w.a, w.b)
    const dx = b.p.x - cp.x
    const dy = b.p.y - cp.y
    const dist = Math.hypot(dx, dy)
    if (dist < R && dist > 0.0001) {
      const nx = dx / dist
      const ny = dy / dist
      b.p.x = cp.x + nx * R
      b.p.y = cp.y + ny * R
      const dot = b.v.x * nx + b.v.y * ny
      b.v.x = (b.v.x - 2 * dot * nx) * 0.82
      b.v.y = (b.v.y - 2 * dot * ny) * 0.82
      if (impulse) {
        b.v.x += nx * impulse
        b.v.y += ny * impulse
      }
    }
  }

  return (
    <div
      className="flex flex-col h-full items-center text-white"
      style={{ background: "#0a1636", fontFamily: t.fontFamily }}
    >
      {/* Score header */}
      <div className="w-full flex items-center justify-between px-3 py-1 text-[13px]" style={{ background: "#12245a" }}>
        <span className="font-mono">SCORE {String(score).padStart(7, "0")}</span>
        <span>BALL {Math.max(1, balls)}</span>
        <button onClick={newGame} className="px-2 py-[1px] text-[11px] text-black active:translate-y-px" style={raisedBevel(t)}>
          New Game
        </button>
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="max-h-full touch-none"
          style={{ border: "3px solid #8fb3ff", background: "#0a1636", aspectRatio: `${W} / ${H}` }}
        />
        {msg && <p className="text-[11px] text-center mt-1 text-[#bcd0ff] max-w-[320px]">{msg}</p>}
      </div>

      {/* On-screen touch controls */}
      <div className="w-full flex items-stretch gap-1 p-2">
        <button
          onPointerDown={() => (leftDown.current = true)}
          onPointerUp={() => (leftDown.current = false)}
          onPointerLeave={() => (leftDown.current = false)}
          className="flex-1 py-3 text-black text-[13px] font-bold active:translate-y-px"
          style={raisedBevel(t)}
        >
          ◀ Left Flip
        </button>
        <button
          onPointerDown={() => (plungerCharging.current = true)}
          onPointerUp={() => {
            plungerCharging.current = false
            launch()
          }}
          className="flex-1 py-3 text-black text-[13px] font-bold active:translate-y-px"
          style={raisedBevel(t)}
        >
          Launch
        </button>
        <button
          onPointerDown={() => (rightDown.current = true)}
          onPointerUp={() => (rightDown.current = false)}
          onPointerLeave={() => (rightDown.current = false)}
          className="flex-1 py-3 text-black text-[13px] font-bold active:translate-y-px"
          style={raisedBevel(t)}
        >
          Right Flip ▶
        </button>
      </div>
    </div>
  )
}
