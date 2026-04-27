"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, HelpCircle, RefreshCw, CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface GridCell {
  value: "empty" | "x" | "o"
}

interface Puzzle {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  categories: {
    name: string
    items: string[]
  }[]
  clues: string[]
  solution: Record<string, string> // e.g., { "Alice": "Red", "Bob": "Blue" }
}

// Generate different puzzle types
const puzzles: Puzzle[] = [
  {
    id: "pets-1",
    title: "Pet Owners",
    difficulty: "Easy",
    categories: [
      { name: "Person", items: ["Alice", "Bob", "Carol"] },
      { name: "Pet", items: ["Dog", "Cat", "Fish"] }
    ],
    clues: [
      "Alice does not have a dog.",
      "The person with the cat is not Bob.",
      "Carol has a fish."
    ],
    solution: { "Alice": "Cat", "Bob": "Dog", "Carol": "Fish" }
  },
  {
    id: "colors-1",
    title: "Favorite Colors",
    difficulty: "Easy",
    categories: [
      { name: "Person", items: ["Emma", "Jack", "Lily"] },
      { name: "Color", items: ["Red", "Blue", "Green"] }
    ],
    clues: [
      "Emma's favorite color is not blue.",
      "Jack loves red.",
      "Lily does not like red or blue."
    ],
    solution: { "Emma": "Blue", "Jack": "Red", "Lily": "Green" }
  },
  {
    id: "jobs-1",
    title: "Career Day",
    difficulty: "Medium",
    categories: [
      { name: "Person", items: ["Dan", "Eve", "Frank", "Grace"] },
      { name: "Job", items: ["Doctor", "Teacher", "Artist", "Chef"] }
    ],
    clues: [
      "Dan is not the teacher or the chef.",
      "Eve works in a hospital.",
      "The artist's name starts with G.",
      "Frank prepares meals for a living."
    ],
    solution: { "Dan": "Teacher", "Eve": "Doctor", "Frank": "Chef", "Grace": "Artist" }
  },
  {
    id: "houses-1",
    title: "Neighborhood",
    difficulty: "Medium",
    categories: [
      { name: "Person", items: ["Amy", "Ben", "Cara"] },
      { name: "House Color", items: ["White", "Yellow", "Blue"] }
    ],
    clues: [
      "Amy does not live in the yellow house.",
      "Ben's house is not white.",
      "Cara lives in the blue house."
    ],
    solution: { "Amy": "White", "Ben": "Yellow", "Cara": "Blue" }
  },
  {
    id: "sports-1",
    title: "Sports Day",
    difficulty: "Easy",
    categories: [
      { name: "Person", items: ["Mike", "Nina", "Oscar"] },
      { name: "Sport", items: ["Soccer", "Tennis", "Swimming"] }
    ],
    clues: [
      "Mike plays a sport with a ball.",
      "Nina does not play soccer.",
      "Oscar is always in the pool."
    ],
    solution: { "Mike": "Soccer", "Nina": "Tennis", "Oscar": "Swimming" }
  },
  {
    id: "food-1",
    title: "Lunch Orders",
    difficulty: "Easy",
    categories: [
      { name: "Person", items: ["Pat", "Quinn", "Rose"] },
      { name: "Food", items: ["Pizza", "Salad", "Burger"] }
    ],
    clues: [
      "Pat ordered something vegetarian.",
      "Quinn did not order pizza.",
      "Rose loves pizza."
    ],
    solution: { "Pat": "Salad", "Quinn": "Burger", "Rose": "Pizza" }
  }
]

interface LogicGridPuzzleProps {
  onScoreChange?: (score: number) => void
}

export function LogicGridPuzzle({ onScoreChange }: LogicGridPuzzleProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [showInstructions, setShowInstructions] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [puzzleComplete, setPuzzleComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showPuzzleSelect, setShowPuzzleSelect] = useState(true)

  const initializeGrid = (puzzle: Puzzle) => {
    const size = puzzle.categories[0].items.length
    const newGrid: GridCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ value: "empty" as const }))
    )
    setGrid(newGrid)
    setPuzzleComplete(false)
    setIsCorrect(false)
    setHintIndex(0)
    setShowHint(false)
  }

  const selectPuzzle = (puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle)
    initializeGrid(puzzle)
    setShowPuzzleSelect(false)
  }

  const cycleCell = (row: number, col: number) => {
    if (puzzleComplete) return
    
    const newGrid = [...grid]
    const currentValue = newGrid[row][col].value
    const nextValue = currentValue === "empty" ? "x" : currentValue === "x" ? "o" : "empty"
    newGrid[row][col] = { value: nextValue }
    setGrid(newGrid)
  }

  const checkSolution = () => {
    if (!currentPuzzle) return
    
    const size = currentPuzzle.categories[0].items.length
    const category1 = currentPuzzle.categories[0].items
    const category2 = currentPuzzle.categories[1].items
    
    // Check if each row has exactly one O
    for (let row = 0; row < size; row++) {
      const oCount = grid[row].filter(cell => cell.value === "o").length
      if (oCount !== 1) {
        setPuzzleComplete(true)
        setIsCorrect(false)
        return
      }
    }
    
    // Check if each column has exactly one O
    for (let col = 0; col < size; col++) {
      let oCount = 0
      for (let row = 0; row < size; row++) {
        if (grid[row][col].value === "o") oCount++
      }
      if (oCount !== 1) {
        setPuzzleComplete(true)
        setIsCorrect(false)
        return
      }
    }
    
    // Check against solution
    let correct = true
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col].value === "o") {
          const person = category1[row]
          const item = category2[col]
          if (currentPuzzle.solution[person] !== item) {
            correct = false
            break
          }
        }
      }
      if (!correct) break
    }
    
    setPuzzleComplete(true)
    setIsCorrect(correct)
    
    if (correct) {
      const newScore = score + 1
      setScore(newScore)
      onScoreChange?.(newScore)
    }
  }

  const resetPuzzle = () => {
    if (currentPuzzle) {
      initializeGrid(currentPuzzle)
    }
  }

  const nextHint = () => {
    if (currentPuzzle && hintIndex < currentPuzzle.clues.length - 1) {
      setHintIndex(prev => prev + 1)
    }
    setShowHint(true)
  }

  const backToSelect = () => {
    setShowPuzzleSelect(true)
    setCurrentPuzzle(null)
    setPuzzleComplete(false)
  }

  // Puzzle Selection Screen
  if (showPuzzleSelect) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-pink-400 font-bold text-xl tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            LOGIC PUZZLES
          </h2>
          <p className="text-pink-300/60 text-xs mt-1">Grid deduction puzzles</p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 bg-pink-950/50 rounded-xl px-4 py-2 border border-pink-500/20">
          <div className="text-center">
            <p className="text-pink-300/60 text-[10px]">Puzzles Solved</p>
            <p className="text-pink-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{score}</p>
          </div>
        </div>

        {/* Puzzle List */}
        <div className="grid grid-cols-1 gap-3 w-full">
          {puzzles.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => selectPuzzle(puzzle)}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-950/80 to-pink-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                <span className="text-pink-400 font-bold text-sm">
                  {puzzle.categories[0].items.length}x{puzzle.categories[0].items.length}
                </span>
              </div>
              <div className="text-left flex-1">
                <p className="text-pink-300 font-semibold text-sm">{puzzle.title}</p>
                <p className="text-pink-400/50 text-xs">{puzzle.difficulty} - {puzzle.clues.length} clues</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-pink-400/50 rotate-180" />
            </button>
          ))}
        </div>

        {/* Instructions Button */}
        <button
          onClick={() => setShowInstructions(true)}
          className="flex items-center gap-2 text-pink-400/60 text-xs hover:text-pink-400 transition-colors mt-2"
        >
          <HelpCircle className="w-4 h-4" />
          How to Play
        </button>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-sm w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <h3 className="text-pink-400 font-bold text-lg mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">How to Play</h3>
              <div className="space-y-3 text-pink-300/80 text-sm">
                <p><strong>Goal:</strong> Match items from two categories using clues.</p>
                <p><strong>Tap once:</strong> Mark X (not a match)</p>
                <p><strong>Tap twice:</strong> Mark O (confirmed match)</p>
                <p><strong>Tap again:</strong> Clear the cell</p>
                <p className="pt-2 border-t border-pink-500/20">Each row and column must have exactly ONE O mark. Use the clues to eliminate possibilities!</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.5)]"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Puzzle Grid Screen
  if (!currentPuzzle) return null

  const size = currentPuzzle.categories[0].items.length
  const category1 = currentPuzzle.categories[0]
  const category2 = currentPuzzle.categories[1]

  return (
    <div className="flex flex-col items-center gap-3 p-4 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={backToSelect}
          className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <span className="text-pink-400 font-semibold text-sm">{currentPuzzle.title}</span>
        <button
          onClick={() => setShowInstructions(true)}
          className="text-pink-400/60 hover:text-pink-400 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="bg-pink-950/50 rounded-xl p-3 border border-pink-500/30">
        {/* Column Headers */}
        <div className="flex">
          <div className="w-16 h-8" /> {/* Empty corner */}
          {category2.items.map((item, idx) => (
            <div
              key={idx}
              className="w-10 h-8 flex items-center justify-center text-[10px] text-pink-300 font-medium px-1 text-center leading-tight"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {category1.items.map((rowItem, rowIdx) => (
          <div key={rowIdx} className="flex">
            {/* Row Header */}
            <div className="w-16 h-10 flex items-center text-[10px] text-pink-300 font-medium pr-2">
              {rowItem}
            </div>
            {/* Cells */}
            {category2.items.map((_, colIdx) => (
              <button
                key={colIdx}
                onClick={() => cycleCell(rowIdx, colIdx)}
                disabled={puzzleComplete}
                className={`
                  w-10 h-10 border border-pink-500/30 flex items-center justify-center
                  transition-all hover:bg-pink-500/20
                  ${grid[rowIdx]?.[colIdx]?.value === "x" ? "bg-red-900/30" : ""}
                  ${grid[rowIdx]?.[colIdx]?.value === "o" ? "bg-green-900/30" : ""}
                  ${puzzleComplete ? "opacity-70" : ""}
                `}
              >
                {grid[rowIdx]?.[colIdx]?.value === "x" && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                {grid[rowIdx]?.[colIdx]?.value === "o" && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Clues */}
      <div className="w-full bg-pink-950/30 rounded-xl p-3 border border-pink-500/20">
        <p className="text-pink-400 font-semibold text-xs mb-2">Clues:</p>
        <ul className="space-y-1">
          {currentPuzzle.clues.map((clue, idx) => (
            <li key={idx} className="text-pink-300/80 text-xs flex gap-2">
              <span className="text-pink-500">{idx + 1}.</span>
              {clue}
            </li>
          ))}
        </ul>
      </div>

      {/* Result Message */}
      {puzzleComplete && (
        <div className={`w-full p-4 rounded-xl ${isCorrect ? 'bg-green-950/50 border border-green-500/30' : 'bg-red-950/50 border border-red-500/30'}`}>
          <p className={`text-sm font-semibold text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={resetPuzzle}
          className="flex-1 py-3 bg-pink-900/50 text-pink-300 font-semibold rounded-xl hover:bg-pink-800/50 transition-colors flex items-center justify-center gap-2 border border-pink-500/30"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={checkSolution}
          disabled={puzzleComplete && isCorrect}
          className="flex-1 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.5)] disabled:opacity-50"
        >
          Check
        </button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-sm w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <h3 className="text-pink-400 font-bold text-lg mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">How to Play</h3>
            <div className="space-y-3 text-pink-300/80 text-sm">
              <p><strong>Goal:</strong> Match items from two categories using clues.</p>
              <p><strong>Tap once:</strong> Mark X (not a match)</p>
              <p><strong>Tap twice:</strong> Mark O (confirmed match)</p>
              <p><strong>Tap again:</strong> Clear the cell</p>
              <p className="pt-2 border-t border-pink-500/20">Each row and column must have exactly ONE O mark. Use the clues to eliminate possibilities!</p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.5)]"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
