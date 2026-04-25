"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface PacManGameProps {
  width?: number
  height?: number
  onScoreChange?: (score: number) => void
}

export function PacManGame({ width = 400, height = 240, onScoreChange }: PacManGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  
  // Touch tracking for swipe detection
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  
  const gameState = useRef({
    pacman: { x: 1, y: 1, dir: 0, nextDir: 0 },
    ghosts: [
      { x: 18, y: 1, dir: 0, color: '#ff0000' },   // Red - Blinky (chases directly)
      { x: 18, y: 10, dir: 0, color: '#00ffff' },  // Cyan - Inky 
      { x: 1, y: 10, dir: 0, color: '#ffb8ff' },   // Pink - Pinky
      { x: 10, y: 5, dir: 0, color: '#ffb852' }    // Orange - Clyde
    ],
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
    animationId: 0,
    frameCount: 0
  })

  const COLS = 20
  const ROWS = 12
  const SIZE = Math.min(width / COLS, height / ROWS)

  const resetGame = useCallback(() => {
    gameState.current = {
      pacman: { x: 1, y: 1, dir: 0, nextDir: 0 },
      ghosts: [
        { x: 18, y: 1, dir: 0, color: '#ff0000' },
        { x: 18, y: 10, dir: 0, color: '#00ffff' },
        { x: 1, y: 10, dir: 0, color: '#ffb8ff' },
        { x: 10, y: 5, dir: 0, color: '#ffb852' }
      ],
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
      animationId: 0,
      frameCount: 0
    }
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    onScoreChange?.(0)
  }, [onScoreChange])

  const move = useCallback((direction: number) => {
    if (gameOver || gameWon) return
    gameState.current.pacman.nextDir = direction
  }, [gameOver, gameWon])

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const minSwipe = 30 // Minimum swipe distance
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipe) {
        if (deltaX > 0) {
          move(0) // Right
        } else {
          move(1) // Left
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipe) {
        if (deltaY > 0) {
          move(3) // Down
        } else {
          move(2) // Up
        }
      }
    }
    
    touchStart.current = null
  }, [move])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameState.current

    const isWall = (x: number, y: number) => {
      return state.map[y]?.[x] === 1
    }

    const drawMap = () => {
      for (let y = 0; y < state.map.length; y++) {
        for (let x = 0; x < state.map[y].length; x++) {
          if (state.map[y][x] === 1) {
            ctx.fillStyle = '#1919a6'
            ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
            // Add wall border effect
            ctx.strokeStyle = '#4040ff'
            ctx.lineWidth = 1
            ctx.strokeRect(x * SIZE + 1, y * SIZE + 1, SIZE - 2, SIZE - 2)
          } else if (state.map[y][x] === 0) {
            ctx.fillStyle = '#ffb8ae'
            ctx.beginPath()
            ctx.arc(x * SIZE + SIZE / 2, y * SIZE + SIZE / 2, SIZE / 8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const drawPacman = () => {
      ctx.fillStyle = '#fdf000'
      ctx.beginPath()
      
      // Animate mouth open/close
      const mouthAngle = 0.2 + Math.sin(state.frameCount * 0.5) * 0.15
      let startAngle = mouthAngle * Math.PI
      let endAngle = (2 - mouthAngle) * Math.PI
      
      // Rotate based on direction
      const rotations = [0, Math.PI, -Math.PI / 2, Math.PI / 2]
      const rotation = rotations[state.pacman.dir]
      startAngle += rotation
      endAngle += rotation
      
      ctx.arc(
        state.pacman.x * SIZE + SIZE / 2,
        state.pacman.y * SIZE + SIZE / 2,
        SIZE / 2 - 2,
        startAngle,
        endAngle
      )
      ctx.lineTo(state.pacman.x * SIZE + SIZE / 2, state.pacman.y * SIZE + SIZE / 2)
      ctx.fill()
    }

    const drawGhost = (ghost: { x: number; y: number; color: string }) => {
      const gx = ghost.x * SIZE + 2
      const gy = ghost.y * SIZE + 2
      const gw = SIZE - 4
      const gh = SIZE - 4
      
      ctx.fillStyle = ghost.color
      
      // Ghost body with rounded top
      ctx.beginPath()
      ctx.arc(gx + gw / 2, gy + gw / 2, gw / 2, Math.PI, 0)
      ctx.lineTo(gx + gw, gy + gh)
      
      // Wavy bottom
      const waves = 3
      const waveWidth = gw / waves
      for (let i = waves; i >= 0; i--) {
        const wx = gx + i * waveWidth
        const wy = gy + gh - (i % 2 === 0 ? 4 : 0)
        ctx.lineTo(wx, wy)
      }
      ctx.closePath()
      ctx.fill()
      
      // Eyes
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(gx + gw * 0.35, gy + gw * 0.4, gw * 0.2, 0, Math.PI * 2)
      ctx.arc(gx + gw * 0.65, gy + gw * 0.4, gw * 0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Pupils - look toward pacman
      const dx = state.pacman.x - ghost.x
      const dy = state.pacman.y - ghost.y
      const angle = Math.atan2(dy, dx)
      const pupilOffset = gw * 0.08
      
      ctx.fillStyle = '#0000ff'
      ctx.beginPath()
      ctx.arc(gx + gw * 0.35 + Math.cos(angle) * pupilOffset, gy + gw * 0.45 + Math.sin(angle) * pupilOffset, gw * 0.1, 0, Math.PI * 2)
      ctx.arc(gx + gw * 0.65 + Math.cos(angle) * pupilOffset, gy + gw * 0.45 + Math.sin(angle) * pupilOffset, gw * 0.1, 0, Math.PI * 2)
      ctx.fill()
    }

    const movePacman = () => {
      // Try to turn in the queued direction
      const dirs = [[1, 0], [-1, 0], [0, -1], [0, 1]] // right, left, up, down
      const nextDir = dirs[state.pacman.nextDir]
      const nextX = state.pacman.x + nextDir[0]
      const nextY = state.pacman.y + nextDir[1]
      
      if (!isWall(nextX, nextY)) {
        state.pacman.dir = state.pacman.nextDir
      }
      
      // Move in current direction
      const currentDir = dirs[state.pacman.dir]
      const moveX = state.pacman.x + currentDir[0]
      const moveY = state.pacman.y + currentDir[1]
      
      if (!isWall(moveX, moveY)) {
        state.pacman.x = moveX
        state.pacman.y = moveY
        
        // Eat dot
        if (state.map[state.pacman.y][state.pacman.x] === 0) {
          state.map[state.pacman.y][state.pacman.x] = -1
          state.score += 10
          setScore(state.score)
          onScoreChange?.(state.score)
        }
      }
    }

    const moveGhost = (ghost: { x: number; y: number; dir: number; color: string }, index: number) => {
      const dirs = [[1, 0], [-1, 0], [0, -1], [0, 1]] // right, left, up, down
      const opposite = [1, 0, 3, 2] // opposite directions
      
      // Get valid moves (not walls, not going backwards unless stuck)
      const validMoves: number[] = []
      for (let d = 0; d < 4; d++) {
        const nx = ghost.x + dirs[d][0]
        const ny = ghost.y + dirs[d][1]
        if (!isWall(nx, ny)) {
          validMoves.push(d)
        }
      }
      
      if (validMoves.length === 0) return
      
      // Remove opposite direction unless it's the only option
      let moves = validMoves.filter(d => d !== opposite[ghost.dir])
      if (moves.length === 0) moves = validMoves
      
      // Different AI for different ghosts
      let chosenDir = moves[0]
      
      if (index === 0) {
        // Red ghost (Blinky) - directly chase Pac-Man
        let minDist = Infinity
        for (const d of moves) {
          const nx = ghost.x + dirs[d][0]
          const ny = ghost.y + dirs[d][1]
          const dist = Math.abs(nx - state.pacman.x) + Math.abs(ny - state.pacman.y)
          if (dist < minDist) {
            minDist = dist
            chosenDir = d
          }
        }
      } else if (index === 1) {
        // Cyan ghost (Inky) - aim ahead of Pac-Man
        const targetX = state.pacman.x + dirs[state.pacman.dir][0] * 4
        const targetY = state.pacman.y + dirs[state.pacman.dir][1] * 4
        let minDist = Infinity
        for (const d of moves) {
          const nx = ghost.x + dirs[d][0]
          const ny = ghost.y + dirs[d][1]
          const dist = Math.abs(nx - targetX) + Math.abs(ny - targetY)
          if (dist < minDist) {
            minDist = dist
            chosenDir = d
          }
        }
      } else if (index === 2) {
        // Pink ghost (Pinky) - random with bias toward Pac-Man
        if (Math.random() < 0.7) {
          let minDist = Infinity
          for (const d of moves) {
            const nx = ghost.x + dirs[d][0]
            const ny = ghost.y + dirs[d][1]
            const dist = Math.abs(nx - state.pacman.x) + Math.abs(ny - state.pacman.y)
            if (dist < minDist) {
              minDist = dist
              chosenDir = d
            }
          }
        } else {
          chosenDir = moves[Math.floor(Math.random() * moves.length)]
        }
      } else {
        // Orange ghost (Clyde) - random movement
        chosenDir = moves[Math.floor(Math.random() * moves.length)]
      }
      
      ghost.dir = chosenDir
      ghost.x += dirs[chosenDir][0]
      ghost.y += dirs[chosenDir][1]
    }

    const checkCollision = () => {
      for (const ghost of state.ghosts) {
        if (ghost.x === state.pacman.x && ghost.y === state.pacman.y) {
          setGameOver(true)
          return true
        }
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
      if (timestamp - lastUpdate > 150) { // Game speed
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        drawMap()
        
        if (!gameOver && !gameWon) {
          movePacman()
          
          // Move ghosts
          state.ghosts.forEach((ghost, index) => {
            moveGhost(ghost, index)
          })
          
          state.frameCount++
          
          if (checkCollision() || checkWin()) {
            drawPacman()
            state.ghosts.forEach(ghost => drawGhost(ghost))
            return
          }
        }
        
        drawPacman()
        state.ghosts.forEach(ghost => drawGhost(ghost))
        lastUpdate = timestamp
      }
      
      state.animationId = requestAnimationFrame(gameLoop)
    }

    state.animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(state.animationId)
    }
  }, [SIZE, gameOver, gameWon, onScoreChange])

  // Keyboard controls
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
    <div 
      ref={containerRef}
      className="flex flex-col items-center touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={COLS * SIZE}
          height={ROWS * SIZE}
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
      
      {/* Swipe hint for mobile */}
      <p className="text-yellow-400/60 text-xs mt-2 md:hidden">Swipe to move Pac-Man</p>
    </div>
  )
}
