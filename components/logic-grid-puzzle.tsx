"use client"

import { useState } from "react"
import { ChevronLeft, HelpCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react"

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
  solution: Record<string, string>
}

const puzzles: Puzzle[] = [
  // EASY PUZZLES (3x3)
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
  },
  // MEDIUM PUZZLES (4x4)
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
      { name: "Person", items: ["Amy", "Ben", "Cara", "Derek"] },
      { name: "House", items: ["White", "Yellow", "Blue", "Red"] }
    ],
    clues: [
      "Amy does not live in the yellow or red house.",
      "Ben's house is not white or blue.",
      "Cara lives in the blue house.",
      "Derek's house is red."
    ],
    solution: { "Amy": "White", "Ben": "Yellow", "Cara": "Blue", "Derek": "Red" }
  },
  {
    id: "instruments-1",
    title: "Music Class",
    difficulty: "Medium",
    categories: [
      { name: "Student", items: ["Hana", "Ivan", "Julia", "Kyle"] },
      { name: "Instrument", items: ["Piano", "Guitar", "Violin", "Drums"] }
    ],
    clues: [
      "Hana plays a string instrument but not the guitar.",
      "Ivan is the loudest player in class.",
      "Julia does not play piano or drums.",
      "Kyle plays a keyboard instrument."
    ],
    solution: { "Hana": "Violin", "Ivan": "Drums", "Julia": "Guitar", "Kyle": "Piano" }
  },
  // HARD PUZZLES (5x5)
  {
    id: "vacation-1",
    title: "Vacation Plans",
    difficulty: "Hard",
    categories: [
      { name: "Person", items: ["Anna", "Brian", "Clara", "David", "Elena"] },
      { name: "Destination", items: ["Paris", "Tokyo", "Sydney", "Rome", "London"] }
    ],
    clues: [
      "Anna is not going to an Asian or Australian city.",
      "Brian wants to see the Eiffel Tower.",
      "Clara's destination is in Europe but not in France or Italy.",
      "David is visiting the largest city in Japan.",
      "Elena has never been to English-speaking countries.",
      "The person going to Rome has a name starting with A."
    ],
    solution: { "Anna": "Rome", "Brian": "Paris", "Clara": "London", "David": "Tokyo", "Elena": "Sydney" }
  },
  {
    id: "books-1",
    title: "Book Club",
    difficulty: "Hard",
    categories: [
      { name: "Reader", items: ["Fiona", "George", "Helen", "Ian", "Jenny"] },
      { name: "Genre", items: ["Mystery", "Romance", "Sci-Fi", "Fantasy", "History"] }
    ],
    clues: [
      "Fiona only reads non-fiction books.",
      "George loves stories set in the future.",
      "Helen's favorite genre involves magic and mythical creatures.",
      "Ian enjoys solving puzzles in his books.",
      "Jenny is not interested in mystery or sci-fi.",
      "The romance reader's name has 5 letters."
    ],
    solution: { "Fiona": "History", "George": "Sci-Fi", "Helen": "Fantasy", "Ian": "Mystery", "Jenny": "Romance" }
  },
  {
    id: "coffee-1",
    title: "Coffee Orders",
    difficulty: "Hard",
    categories: [
      { name: "Customer", items: ["Kate", "Leo", "Maya", "Noah", "Olivia"] },
      { name: "Drink", items: ["Latte", "Espresso", "Mocha", "Cappuccino", "Americano"] }
    ],
    clues: [
      "Kate orders something with chocolate.",
      "Leo prefers his coffee black without milk.",
      "Maya's drink has the most milk foam.",
      "Noah does not drink latte, mocha, or cappuccino.",
      "Olivia's drink name starts with the same letter as hers.",
      "The espresso drinker's name has 3 letters."
    ],
    solution: { "Kate": "Mocha", "Leo": "Espresso", "Maya": "Cappuccino", "Noah": "Americano", "Olivia": "Latte" }
  },
  {
    id: "pets-hard-1",
    title: "Animal Shelter",
    difficulty: "Hard",
    categories: [
      { name: "Adopter", items: ["Paula", "Quinn", "Ryan", "Sarah", "Tom"] },
      { name: "Pet", items: ["Hamster", "Rabbit", "Parrot", "Turtle", "Guinea Pig"] }
    ],
    clues: [
      "Paula adopted a pet that can fly.",
      "Quinn's pet has a shell.",
      "Ryan is allergic to fur, so he got a bird or reptile.",
      "Sarah's pet has long ears.",
      "Tom did not adopt the parrot or turtle.",
      "The hamster was adopted by someone whose name starts with T.",
      "Ryan did not adopt the same type of pet as Paula."
    ],
    solution: { "Paula": "Parrot", "Quinn": "Turtle", "Ryan": "Turtle", "Sarah": "Rabbit", "Tom": "Hamster" }
  },
  // EXTRA HARD (5x5 with more complex clues)
  {
    id: "office-1",
    title: "Office Floors",
    difficulty: "Hard",
    categories: [
      { name: "Employee", items: ["Alice", "Bob", "Carla", "Doug", "Eva"] },
      { name: "Floor", items: ["1st", "2nd", "3rd", "4th", "5th"] }
    ],
    clues: [
      "Alice works on a higher floor than Bob.",
      "Carla is on the middle floor.",
      "Doug works exactly two floors below Eva.",
      "Bob is not on the 1st or 5th floor.",
      "Eva works on an even-numbered floor.",
      "Alice is not on the top floor."
    ],
    solution: { "Alice": "4th", "Bob": "2nd", "Carla": "3rd", "Doug": "2nd", "Eva": "4th" }
  }
]

interface LogicGridPuzzleProps {
  onScoreChange?: (score: number) => void
}

export function LogicGridPuzzle({ onScoreChange }: LogicGridPuzzleProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [showInstructions, setShowInstructions] = useState(false)
  const [score, setScore] = useState(0)
  const [puzzleComplete, setPuzzleComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showPuzzleSelect, setShowPuzzleSelect] = useState(true)
  const [filterDifficulty, setFilterDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All")

  const filteredPuzzles = filterDifficulty === "All" 
    ? puzzles 
    : puzzles.filter(p => p.difficulty === filterDifficulty)

  const initializeGrid = (puzzle: Puzzle) => {
    const size = puzzle.categories[0].items.length
    const newGrid: GridCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ value: "empty" as const }))
    )
    setGrid(newGrid)
    setPuzzleComplete(false)
    setIsCorrect(false)
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
    
    for (let row = 0; row < size; row++) {
      const oCount = grid[row].filter(cell => cell.value === "o").length
      if (oCount !== 1) {
        setPuzzleComplete(true)
        setIsCorrect(false)
        return
      }
    }
    
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
      const newScore = score + (currentPuzzle.difficulty === "Hard" ? 3 : currentPuzzle.difficulty === "Medium" ? 2 : 1)
      setScore(newScore)
      onScoreChange?.(newScore)
    }
  }

  const resetPuzzle = () => {
    if (currentPuzzle) {
      initializeGrid(currentPuzzle)
    }
  }

  const backToSelect = () => {
    setShowPuzzleSelect(true)
    setCurrentPuzzle(null)
    setPuzzleComplete(false)
  }

  // Puzzle Selection Screen
  if (showPuzzleSelect) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-pink-400 font-bold text-xl md:text-2xl tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            LOGIC PUZZLES
          </h2>
          <p className="text-pink-300/60 text-xs md:text-sm mt-1">Grid deduction puzzles</p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 bg-pink-950/50 rounded-xl px-4 py-2 border border-pink-500/20">
          <div className="text-center">
            <p className="text-pink-300/60 text-[10px] md:text-xs">Total Score</p>
            <p className="text-pink-400 font-bold text-lg md:text-xl drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{score}</p>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                filterDifficulty === diff
                  ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  : "bg-pink-950/50 text-pink-300 border border-pink-500/30 hover:border-pink-400/50"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Puzzle List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {filteredPuzzles.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => selectPuzzle(puzzle)}
              className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-pink-950/80 to-pink-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center border ${
                puzzle.difficulty === "Hard" 
                  ? "bg-red-500/20 border-red-500/30" 
                  : puzzle.difficulty === "Medium"
                  ? "bg-yellow-500/20 border-yellow-500/30"
                  : "bg-green-500/20 border-green-500/30"
              }`}>
                <span className={`font-bold text-xs md:text-sm ${
                  puzzle.difficulty === "Hard" 
                    ? "text-red-400" 
                    : puzzle.difficulty === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}>
                  {puzzle.categories[0].items.length}x{puzzle.categories[0].items.length}
                </span>
              </div>
              <div className="text-left flex-1">
                <p className="text-pink-300 font-semibold text-sm md:text-base">{puzzle.title}</p>
                <p className={`text-xs ${
                  puzzle.difficulty === "Hard" 
                    ? "text-red-400/70" 
                    : puzzle.difficulty === "Medium"
                    ? "text-yellow-400/70"
                    : "text-green-400/70"
                }`}>
                  {puzzle.difficulty} - {puzzle.clues.length} clues
                </p>
              </div>
              <ChevronLeft className="w-5 h-5 text-pink-400/50 rotate-180" />
            </button>
          ))}
        </div>

        {/* Instructions Button */}
        <button
          onClick={() => setShowInstructions(true)}
          className="flex items-center gap-2 text-pink-400/60 text-xs md:text-sm hover:text-pink-400 transition-colors mt-2"
        >
          <HelpCircle className="w-4 h-4" />
          How to Play
        </button>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-md w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <h3 className="text-pink-400 font-bold text-lg mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">How to Play</h3>
              <div className="space-y-3 text-pink-300/80 text-sm">
                <p><strong className="text-pink-300">Goal:</strong> Match items from two categories using clues.</p>
                <p><strong className="text-pink-300">Click/Tap once:</strong> Mark X (not a match)</p>
                <p><strong className="text-pink-300">Click/Tap twice:</strong> Mark O (confirmed match)</p>
                <p><strong className="text-pink-300">Click/Tap again:</strong> Clear the cell</p>
                <div className="pt-3 border-t border-pink-500/20 space-y-2">
                  <p><strong className="text-pink-300">Scoring:</strong></p>
                  <p className="text-green-400/80">Easy (3x3): +1 point</p>
                  <p className="text-yellow-400/80">Medium (4x4): +2 points</p>
                  <p className="text-red-400/80">Hard (5x5): +3 points</p>
                </div>
                <p className="pt-2 text-pink-400/60 text-xs">Each row and column must have exactly ONE O mark. Use the clues to eliminate possibilities!</p>
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
  const isHard = size >= 5
  const cellSize = isHard ? "w-8 h-8 md:w-10 md:h-10" : "w-10 h-10 md:w-12 md:h-12"
  const headerWidth = isHard ? "w-14 md:w-20" : "w-16 md:w-24"
  const fontSize = isHard ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-xs"

  return (
    <div className="flex flex-col items-center gap-3 p-3 md:p-6 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={backToSelect}
          className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="text-center">
          <span className="text-pink-400 font-semibold text-sm md:text-base">{currentPuzzle.title}</span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
            currentPuzzle.difficulty === "Hard" 
              ? "bg-red-500/20 text-red-400" 
              : currentPuzzle.difficulty === "Medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}>
            {currentPuzzle.difficulty}
          </span>
        </div>
        <button
          onClick={() => setShowInstructions(true)}
          className="text-pink-400/60 hover:text-pink-400 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content - Side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Grid */}
        <div className="bg-pink-950/50 rounded-xl p-2 md:p-4 border border-pink-500/30 overflow-x-auto">
          {/* Column Headers */}
          <div className="flex">
            <div className={`${headerWidth} h-6 md:h-8`} />
            {category2.items.map((item, idx) => (
              <div
                key={idx}
                className={`${cellSize} flex items-center justify-center ${fontSize} text-pink-300 font-medium px-0.5 text-center leading-tight`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {category1.items.map((rowItem, rowIdx) => (
            <div key={rowIdx} className="flex">
              {/* Row Header */}
              <div className={`${headerWidth} ${cellSize} flex items-center ${fontSize} text-pink-300 font-medium pr-1 md:pr-2`}>
                {rowItem}
              </div>
              {/* Cells */}
              {category2.items.map((_, colIdx) => (
                <button
                  key={colIdx}
                  onClick={() => cycleCell(rowIdx, colIdx)}
                  disabled={puzzleComplete}
                  className={`
                    ${cellSize} border border-pink-500/30 flex items-center justify-center
                    transition-all hover:bg-pink-500/20
                    ${grid[rowIdx]?.[colIdx]?.value === "x" ? "bg-red-900/30" : ""}
                    ${grid[rowIdx]?.[colIdx]?.value === "o" ? "bg-green-900/30" : ""}
                    ${puzzleComplete ? "opacity-70" : ""}
                  `}
                >
                  {grid[rowIdx]?.[colIdx]?.value === "x" && (
                    <XCircle className={`${isHard ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-6 md:h-6"} text-red-400`} />
                  )}
                  {grid[rowIdx]?.[colIdx]?.value === "o" && (
                    <CheckCircle className={`${isHard ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-6 md:h-6"} text-green-400`} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Clues Panel */}
        <div className="flex-1 w-full lg:max-w-sm bg-pink-950/30 rounded-xl p-3 md:p-4 border border-pink-500/20">
          <p className="text-pink-400 font-semibold text-xs md:text-sm mb-2">Clues:</p>
          <ul className="space-y-2">
            {currentPuzzle.clues.map((clue, idx) => (
              <li key={idx} className="text-pink-300/80 text-xs md:text-sm flex gap-2">
                <span className="text-pink-500 font-bold">{idx + 1}.</span>
                <span>{clue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Result Message */}
      {puzzleComplete && (
        <div className={`w-full p-4 rounded-xl ${isCorrect ? 'bg-green-950/50 border border-green-500/30' : 'bg-red-950/50 border border-red-500/30'}`}>
          <p className={`text-sm font-semibold text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect 
              ? `Correct! +${currentPuzzle.difficulty === "Hard" ? 3 : currentPuzzle.difficulty === "Medium" ? 2 : 1} points!` 
              : 'Not quite right. Try again!'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 w-full max-w-md">
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
          <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-md w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <h3 className="text-pink-400 font-bold text-lg mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">How to Play</h3>
            <div className="space-y-3 text-pink-300/80 text-sm">
              <p><strong className="text-pink-300">Goal:</strong> Match items from two categories using clues.</p>
              <p><strong className="text-pink-300">Click/Tap once:</strong> Mark X (not a match)</p>
              <p><strong className="text-pink-300">Click/Tap twice:</strong> Mark O (confirmed match)</p>
              <p><strong className="text-pink-300">Click/Tap again:</strong> Clear the cell</p>
              <p className="pt-2 border-t border-pink-500/20 text-pink-400/60 text-xs">Each row and column must have exactly ONE O mark!</p>
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
