"use client"

import { useState, useCallback, useEffect } from "react"

type Player = "X" | "O" | null
type Board = Player[]

export interface TicTacToeState {
  board: Board
  isPlayerTurn: boolean
  playerScore: number
  aiScore: number
  gameStatus: "playing" | "playerWin" | "aiWin" | "draw"
  winningLine: number[] | null
}

export const initialTicTacToeState: TicTacToeState = {
  board: Array(9).fill(null),
  isPlayerTurn: true,
  playerScore: 0,
  aiScore: 0,
  gameStatus: "playing",
  winningLine: null
}

interface TicTacToeGameProps {
  onScoreChange?: (score: number) => void
  gameState?: TicTacToeState
  onGameStateChange?: (state: TicTacToeState) => void
}

// UX Design themed symbols
const UX_SYMBOLS = {
  X: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Cursor/Pointer icon for X */}
      <path
        d="M25 15 L25 75 L40 60 L55 85 L65 80 L50 55 L70 55 L25 15Z"
        fill="#ec4899"
        stroke="#be185d"
        strokeWidth="3"
      />
    </svg>
  ),
  O: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Wireframe/Component icon for O */}
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="8"
        fill="none"
        stroke="#ec4899"
        strokeWidth="4"
        strokeDasharray="8 4"
      />
      <circle cx="50" cy="50" r="15" fill="#fce7f3" stroke="#ec4899" strokeWidth="3" />
    </svg>
  ),
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
]

export function TicTacToeGame({ onScoreChange, gameState, onGameStateChange }: TicTacToeGameProps) {
  const [localState, setLocalState] = useState<TicTacToeState>(gameState || initialTicTacToeState)
  
  // Sync with external state
  useEffect(() => {
    if (gameState) {
      setLocalState(gameState)
    }
  }, [gameState])
  
  const updateState = useCallback((updates: Partial<TicTacToeState>) => {
    setLocalState(prev => {
      const newState = { ...prev, ...updates }
      onGameStateChange?.(newState)
      return newState
    })
  }, [onGameStateChange])
  
  const { board, isPlayerTurn, playerScore, aiScore, gameStatus, winningLine } = localState

  const checkWinner = useCallback((squares: Board): { winner: Player; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo }
      }
    }
    return { winner: null, line: null }
  }, [])

  const isDraw = useCallback((squares: Board): boolean => {
    return squares.every((square) => square !== null)
  }, [])

  const getAiMove = useCallback((squares: Board): number => {
    // Simple AI: try to win, block, or pick random
    const emptySquares = squares.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1)

    // Try to win
    for (const i of emptySquares) {
      const testBoard = [...squares]
      testBoard[i] = "O"
      if (checkWinner(testBoard).winner === "O") return i
    }

    // Block player
    for (const i of emptySquares) {
      const testBoard = [...squares]
      testBoard[i] = "X"
      if (checkWinner(testBoard).winner === "X") return i
    }

    // Take center if available
    if (squares[4] === null) return 4

    // Take a corner
    const corners = [0, 2, 6, 8].filter((i) => squares[i] === null)
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]

    // Take any available
    return emptySquares[Math.floor(Math.random() * emptySquares.length)]
  }, [checkWinner])

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || gameStatus !== "playing" || !isPlayerTurn) return

      const newBoard = [...board]
      newBoard[index] = "X"

      const { winner, line } = checkWinner(newBoard)
      if (winner === "X") {
        const newScore = playerScore + 1
        updateState({ board: newBoard, playerScore: newScore, gameStatus: "playerWin", winningLine: line })
        onScoreChange?.(newScore)
        return
      }

      if (isDraw(newBoard)) {
        updateState({ board: newBoard, gameStatus: "draw" })
        return
      }

      updateState({ board: newBoard, isPlayerTurn: false })

      // AI move after delay
      setTimeout(() => {
        const aiMove = getAiMove(newBoard)
        const aiBoard = [...newBoard]
        aiBoard[aiMove] = "O"

        const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard)
        if (aiWinner === "O") {
          updateState({ board: aiBoard, aiScore: aiScore + 1, gameStatus: "aiWin", winningLine: aiLine })
          return
        }

        if (isDraw(aiBoard)) {
          updateState({ board: aiBoard, gameStatus: "draw" })
          return
        }

        updateState({ board: aiBoard, isPlayerTurn: true })
      }, 500)
    },
    [board, gameStatus, isPlayerTurn, playerScore, aiScore, checkWinner, isDraw, getAiMove, onScoreChange, updateState]
  )

  const resetGame = useCallback(() => {
    updateState({
      board: Array(9).fill(null),
      isPlayerTurn: true,
      gameStatus: "playing",
      winningLine: null
    })
  }, [updateState])

  const resetAll = useCallback(() => {
    updateState({
      ...initialTicTacToeState
    })
    onScoreChange?.(0)
  }, [updateState, onScoreChange])

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-pink-400 font-bold text-lg tracking-wide">YOU VS CHARITY</h2>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center gap-6 bg-pink-950/50 rounded-xl px-6 py-3">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1">{UX_SYMBOLS.X}</div>
          <p className="text-pink-300 text-xs">You</p>
          <p className="text-pink-400 font-bold text-xl">{playerScore}</p>
        </div>
        <div className="text-pink-500/30 text-2xl font-light">vs</div>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-1">{UX_SYMBOLS.O}</div>
          <p className="text-pink-300 text-xs">Charity</p>
          <p className="text-pink-400 font-bold text-xl">{aiScore}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-2 bg-pink-900/30 p-3 rounded-2xl border border-pink-500/30">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || gameStatus !== "playing" || !isPlayerTurn}
              className={`
                w-20 h-20 rounded-xl flex items-center justify-center p-3
                transition-all duration-200
                ${
                  cell
                    ? "bg-pink-950/80"
                    : "bg-pink-950/50 hover:bg-pink-900/50 hover:scale-105 cursor-pointer"
                }
                ${winningLine?.includes(index) ? "ring-2 ring-pink-400 bg-pink-900/80" : ""}
                ${!isPlayerTurn && !cell ? "cursor-not-allowed" : ""}
                border border-pink-500/20
              `}
            >
              {cell && (
                <div className="w-full h-full animate-in zoom-in-50 duration-200">
                  {UX_SYMBOLS[cell]}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Game Over Overlay */}
        {gameStatus !== "playing" && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
            <p
              className={`text-2xl font-bold ${
                gameStatus === "playerWin"
                  ? "text-pink-400"
                  : gameStatus === "aiWin"
                  ? "text-pink-300"
                  : "text-pink-400/70"
              }`}
            >
              {gameStatus === "playerWin" && "You Win!"}
              {gameStatus === "aiWin" && "Charity Wins!"}
              {gameStatus === "draw" && "Draw!"}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-400 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <p className="text-pink-300/60 text-sm">
        {gameStatus === "playing" && (isPlayerTurn ? "Your turn" : "Charity is thinking...")}
      </p>

      {/* Reset Button */}
      <button
        onClick={resetAll}
        className="text-pink-400/50 text-xs hover:text-pink-400 transition-colors"
      >
        Reset Scores
      </button>
    </div>
  )
}
