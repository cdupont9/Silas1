"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface PacManGameProps {
  width?: number
  height?: number
  onScoreChange?: (score: number) => void
}

export function PacManGame({ width = 400, height = 240, onScoreChange }: PacManGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  
  const gameState = useRef({
    pacman: { x: 1, y: 1, dir: 0 },
    ghost: { x: 18, y: 10 },
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
      [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
      [1,0,0,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,0,0,0,0,1,0,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    score: 0,
    animationId: 0
  })

  const SIZE = width / 20

  const resetGame = useCallback(() => {
    gameState.current = {
      pacman: { x: 1, y: 1, dir: 0 },
      ghost: { x: 18, y: 10 },
      map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
        [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
        [1,0,0,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,0,0,0,0,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
      score: 0,
      animationId: 0
    }
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    onScoreChange?.(0)
  }, [onScoreChange])

  const move = useCallback((direction: number) => {
    if (gameOver || gameWon) return
    gameState.current.pacman.dir = direction
  }, [gameOver, gameWon])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameState.current

    const drawMap = () => {
      for (let y = 0; y < state.map.length; y++) {
        for (let x = 0; x < state.map[y].length; x++) {
          if (state.map[y][x] === 1) {
            ctx.fillStyle = '#1919a6'
            ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
          } else if (state.map[y][x] === 0) {
            ctx.fillStyle = '#ffb8ae'
            ctx.beginPath()
            ctx.arc(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const drawEntities = () => {
      // Draw Pacman with mouth animation
      ctx.fillStyle = '#fdf000'
      ctx.beginPath()
      const mouthAngle = 0.2
      let startAngle = mouthAngle * Math.PI
      let endAngle = (2 - mouthAngle) * Math.PI
      
      // Rotate based on direction
      if (state.pacman.dir === 1) { // Left
        startAngle += Math.PI
        endAngle += Math.PI
      } else if (state.pacman.dir === 2) { // Up
        startAngle -= Math.PI / 2
        endAngle -= Math.PI / 2
      } else if (state.pacman.dir === 3) { // Down
        startAngle += Math.PI / 2
        endAngle += Math.PI / 2
      }
      
      ctx.arc(
        state.pacman.x * SIZE + SIZE / 2,
        state.pacman.y * SIZE + SIZE / 2,
        SIZE / 2 - 2,
        startAngle,
        endAngle
      )
      ctx.lineTo(state.pacman.x * SIZE + SIZE / 2, state.pacman.y * SIZE + SIZE / 2)
      ctx.fill()

      // Draw Ghost
      ctx.fillStyle = '#ff0000'
      const gx = state.ghost.x * SIZE + 2
      const gy = state.ghost.y * SIZE + 2
      const gw = SIZE - 4
      const gh = SIZE - 4
      
      // Ghost body
      ctx.beginPath()
      ctx.arc(gx + gw / 2, gy + gw / 2, gw / 2, Math.PI, 0)
      ctx.lineTo(gx + gw, gy + gh)
      ctx.lineTo(gx + gw * 0.75, gy + gh - 3)
      ctx.lineTo(gx + gw * 0.5, gy + gh)
      ctx.lineTo(gx + gw * 0.25, gy + gh - 3)
      ctx.lineTo(gx, gy + gh)
      ctx.closePath()
      ctx.fill()
      
      // Ghost eyes
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(gx + gw * 0.35, gy + gw * 0.4, 3, 0, Math.PI * 2)
      ctx.arc(gx + gw * 0.65, gy + gw * 0.4, 3, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#00f'
      ctx.beginPath()
      ctx.arc(gx + gw * 0.35, gy + gw * 0.45, 1.5, 0, Math.PI * 2)
      ctx.arc(gx + gw * 0.65, gy + gw * 0.45, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    const movePacman = () => {
      let nextX = state.pacman.x
      let nextY = state.pacman.y

      if (state.pacman.dir === 0) nextX++ // Right
      if (state.pacman.dir === 1) nextX-- // Left
      if (state.pacman.dir === 2) nextY-- // Up
      if (state.pacman.dir === 3) nextY++ // Down

      if (state.map[nextY]?.[nextX] !== 1) {
        state.pacman.x = nextX
        state.pacman.y = nextY
        if (state.map[state.pacman.y][state.pacman.x] === 0) {
          state.map[state.pacman.y][state.pacman.x] = -1
          state.score += 10
          setScore(state.score)
          onScoreChange?.(state.score)
        }
      }
    }

    const moveGhost = () => {
      const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      const move = directions[Math.floor(Math.random() * directions.length)]
      if (state.map[state.ghost.y + move[1]]?.[state.ghost.x + move[0]] !== 1) {
        state.ghost.x += move[0]
        state.ghost.y += move[1]
      }
    }

    const checkCollision = () => {
      if (state.ghost.x === state.pacman.x && state.ghost.y === state.pacman.y) {
        setGameOver(true)
        return true
      }
      return false
    }

    const checkWin = () => {
      const hasDots = state.map.some(row => row.some(cell => cell === 0))
      if (!hasDots) {
        setGameWon(true)
        return true
      }
      return false
    }

    let lastUpdate = 0
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastUpdate > 200) {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        drawMap()
        
        if (!gameOver && !gameWon) {
          movePacman()
          moveGhost()
          if (checkCollision() || checkWin()) {
            drawEntities()
            return
          }
        }
        
        drawEntities()
        lastUpdate = timestamp
      }
      
      state.animationId = requestAnimationFrame(gameLoop)
    }

    state.animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(state.animationId)
    }
  }, [SIZE, gameOver, gameWon, onScoreChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') move(0)
      if (e.key === 'ArrowLeft') move(1)
      if (e.key === 'ArrowUp') move(2)
      if (e.key === 'ArrowDown') move(3)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-4 border-blue-900 rounded-lg"
          style={{ background: '#000' }}
        />
        
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
            <p className={`text-2xl font-bold ${gameWon ? 'text-yellow-400' : 'text-red-500'}`}>
              {gameWon ? 'YOU WIN!' : 'GAME OVER'}
            </p>
            <p className="text-yellow-400 mt-2">Score: {score}</p>
            <button
              onClick={resetGame}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      {/* Touch Controls for Mobile */}
      <div className="mt-4 flex flex-col items-center gap-1 md:hidden">
        <button
          onTouchStart={() => move(2)}
          onClick={() => move(2)}
          className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center active:bg-yellow-500/50"
        >
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="flex gap-1">
          <button
            onTouchStart={() => move(1)}
            onClick={() => move(1)}
            className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center active:bg-yellow-500/50"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onTouchStart={() => move(3)}
            onClick={() => move(3)}
            className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center active:bg-yellow-500/50"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onTouchStart={() => move(0)}
            onClick={() => move(0)}
            className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center active:bg-yellow-500/50"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
