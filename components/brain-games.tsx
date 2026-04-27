"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, HelpCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react"

// ============ MIND PUZZLES SECTION ============
type PuzzleCategory = "sequence" | "pattern" | "logic" | "math" | "word"

interface MindPuzzle {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const generateSequencePuzzle = (): MindPuzzle => {
  const sequences = [
    { seq: [2, 4, 6, 8], answer: 10, explanation: "Each number increases by 2" },
    { seq: [1, 4, 9, 16], answer: 25, explanation: "These are square numbers: 1, 2, 3, 4, 5 squared" },
    { seq: [3, 6, 12, 24], answer: 48, explanation: "Each number doubles" },
    { seq: [1, 1, 2, 3, 5], answer: 8, explanation: "Fibonacci sequence: each number is the sum of the two before it" },
    { seq: [5, 10, 20, 40], answer: 80, explanation: "Each number doubles" },
    { seq: [100, 90, 80, 70], answer: 60, explanation: "Each number decreases by 10" },
    { seq: [2, 6, 18, 54], answer: 162, explanation: "Each number is multiplied by 3" },
    { seq: [1, 3, 6, 10], answer: 15, explanation: "Triangle numbers: +2, +3, +4, +5" },
  ]
  const chosen = sequences[Math.floor(Math.random() * sequences.length)]
  const wrongAnswers = [chosen.answer + 2, chosen.answer - 3, chosen.answer + 7].filter(n => n !== chosen.answer)
  const options = [chosen.answer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5)
  
  return {
    id: `seq-${Date.now()}`,
    question: `What comes next? ${chosen.seq.join(", ")}, ?`,
    options: options.map(String),
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const generatePatternPuzzle = (): MindPuzzle => {
  const patterns = [
    { pattern: "Red Blue Red Blue Red", answer: "Blue", wrong: ["Red", "Green", "Yellow"], explanation: "The pattern alternates red, blue" },
    { pattern: "AAB AAB AAB", answer: "A", wrong: ["B", "C", "D"], explanation: "Pattern is AAB repeating, next starts with A" },
    { pattern: "1 2 3 1 2 3 1 2 3", answer: "1", wrong: ["2", "3", "4"], explanation: "Pattern is 123 repeating" },
    { pattern: "Up Up Down Up Up Down Up Up", answer: "Down", wrong: ["Up", "Left", "Right"], explanation: "Two ups followed by one down" },
    { pattern: "X O X O X O X", answer: "O", wrong: ["X", "Z", "Y"], explanation: "Alternating X and O pattern" },
  ]
  const chosen = patterns[Math.floor(Math.random() * patterns.length)]
  const options = [chosen.answer, ...chosen.wrong].sort(() => Math.random() - 0.5)
  
  return {
    id: `pat-${Date.now()}`,
    question: `Complete the pattern: ${chosen.pattern} ?`,
    options,
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const generateLogicPuzzle = (): MindPuzzle => {
  const puzzles = [
    {
      question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. True or False?",
      answer: "True",
      wrong: ["False", "Maybe", "Cannot determine"],
      explanation: "This is a syllogism. If A is in B and B is in C, then A is in C"
    },
    {
      question: "A is taller than B. C is shorter than B. Who is the tallest?",
      answer: "A",
      wrong: ["B", "C", "Cannot determine"],
      explanation: "A > B > C, so A is tallest"
    },
    {
      question: "If it rains, the ground gets wet. The ground is wet. Did it rain?",
      answer: "Not necessarily",
      wrong: ["Yes", "No", "Always"],
      explanation: "The ground could be wet for other reasons (sprinkler, spill, etc.)"
    },
    {
      question: "In a race, you pass the person in 2nd place. What position are you now in?",
      answer: "2nd",
      wrong: ["1st", "3rd", "4th"],
      explanation: "You took their position, not moved ahead of them"
    },
  ]
  const chosen = puzzles[Math.floor(Math.random() * puzzles.length)]
  const options = [chosen.answer, ...chosen.wrong].sort(() => Math.random() - 0.5)
  
  return {
    id: `log-${Date.now()}`,
    question: chosen.question,
    options,
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const generateMathPuzzle = (): MindPuzzle => {
  const puzzles = [
    {
      question: "If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
      answer: "3",
      wrong: ["100", "33", "9"],
      explanation: "Each cat catches 1 mouse per 3 minutes. In 100 minutes, each cat catches about 33 mice. 3 cats catch 99-100 mice."
    },
    {
      question: "A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?",
      answer: "$0.05",
      wrong: ["$0.10", "$0.15", "$0.01"],
      explanation: "If ball = x, bat = x + 1. So x + (x+1) = 1.10, 2x = 0.10, x = 0.05"
    },
    {
      question: "What is half of 2 + 2?",
      answer: "3",
      wrong: ["2", "1", "4"],
      explanation: "Half of 2 is 1, plus 2 equals 3 (order of operations)"
    },
    {
      question: "How many times can you subtract 5 from 25?",
      answer: "Once",
      wrong: ["5", "4", "Infinite"],
      explanation: "After subtracting once, it is no longer 25"
    },
  ]
  const chosen = puzzles[Math.floor(Math.random() * puzzles.length)]
  const options = [chosen.answer, ...chosen.wrong].sort(() => Math.random() - 0.5)
  
  return {
    id: `math-${Date.now()}`,
    question: chosen.question,
    options,
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const generateWordPuzzle = (): MindPuzzle => {
  const puzzles = [
    {
      question: "What word becomes shorter when you add two letters to it?",
      answer: "Short",
      wrong: ["Long", "Small", "Brief"],
      explanation: "Short + er = Shorter"
    },
    {
      question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
      answer: "An echo",
      wrong: ["A ghost", "A whisper", "A shadow"],
      explanation: "An echo has no physical form but 'speaks' and 'hears'"
    },
    {
      question: "What 5-letter word typed in all capitals can be read the same upside down?",
      answer: "SWIMS",
      wrong: ["HELLO", "WORLD", "KAYAK"],
      explanation: "SWIMS looks the same when rotated 180 degrees"
    },
    {
      question: "Forward I am heavy, but backward I am not. What am I?",
      answer: "Ton",
      wrong: ["Car", "Rock", "Lead"],
      explanation: "Ton spelled backward is 'not'"
    },
  ]
  const chosen = puzzles[Math.floor(Math.random() * puzzles.length)]
  const options = [chosen.answer, ...chosen.wrong].sort(() => Math.random() - 0.5)
  
  return {
    id: `word-${Date.now()}`,
    question: chosen.question,
    options,
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const mindCategoryInfo: Record<PuzzleCategory, { name: string; icon: string; description: string }> = {
  sequence: { name: "Number Sequences", icon: "#", description: "Find the pattern in numbers" },
  pattern: { name: "Pattern Recognition", icon: "~", description: "Complete visual patterns" },
  logic: { name: "Logic Problems", icon: "?", description: "Solve logical riddles" },
  math: { name: "Math Puzzles", icon: "+", description: "Tricky math brain teasers" },
  word: { name: "Word Puzzles", icon: "A", description: "Riddles and wordplay" }
}

// ============ LOGIC GRID SECTION ============
interface GridCell { value: "empty" | "x" | "o" }

interface LogicPuzzle {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  categories: { name: string; items: string[] }[]
  clues: string[]
  solution: Record<string, string>
}

const logicPuzzles: LogicPuzzle[] = [
  {
    id: "pets-1",
    title: "Pet Owners",
    difficulty: "Easy",
    categories: [
      { name: "Person", items: ["Alice", "Bob", "Carol"] },
      { name: "Pet", items: ["Dog", "Cat", "Fish"] }
    ],
    clues: ["Alice does not have a dog.", "The person with the cat is not Bob.", "Carol has a fish."],
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
    clues: ["Emma's favorite color is not blue.", "Jack loves red.", "Lily does not like red or blue."],
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
    clues: ["Dan is not the teacher or the chef.", "Eve works in a hospital.", "The artist's name starts with G.", "Frank prepares meals for a living."],
    solution: { "Dan": "Teacher", "Eve": "Doctor", "Frank": "Chef", "Grace": "Artist" }
  },
  {
    id: "instruments-1",
    title: "Music Class",
    difficulty: "Medium",
    categories: [
      { name: "Student", items: ["Hana", "Ivan", "Julia", "Kyle"] },
      { name: "Instrument", items: ["Piano", "Guitar", "Violin", "Drums"] }
    ],
    clues: ["Hana plays a string instrument but not the guitar.", "Ivan is the loudest player in class.", "Julia does not play piano or drums.", "Kyle plays a keyboard instrument."],
    solution: { "Hana": "Violin", "Ivan": "Drums", "Julia": "Guitar", "Kyle": "Piano" }
  },
  {
    id: "vacation-1",
    title: "Vacation Plans",
    difficulty: "Hard",
    categories: [
      { name: "Person", items: ["Anna", "Brian", "Clara", "David", "Elena"] },
      { name: "Destination", items: ["Paris", "Tokyo", "Sydney", "Rome", "London"] }
    ],
    clues: ["Anna is not going to an Asian or Australian city.", "Brian wants to see the Eiffel Tower.", "Clara's destination is in Europe but not in France or Italy.", "David is visiting the largest city in Japan.", "Elena has never been to English-speaking countries.", "The person going to Rome has a name starting with A."],
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
    clues: ["Fiona only reads non-fiction books.", "George loves stories set in the future.", "Helen's favorite genre involves magic and mythical creatures.", "Ian enjoys solving puzzles in his books.", "Jenny is not interested in mystery or sci-fi.", "The romance reader's name has 5 letters."],
    solution: { "Fiona": "History", "George": "Sci-Fi", "Helen": "Fantasy", "Ian": "Mystery", "Jenny": "Romance" }
  }
]

// ============ MAIN COMPONENT ============
type GameMode = "menu" | "mind" | "logic"
type MindScreen = "category" | "puzzle"
type LogicScreen = "select" | "puzzle"

export interface BrainGamesState {
  gameMode: GameMode
  totalScore: number
  mindScreen: MindScreen
  selectedMindCategory: PuzzleCategory | null
  currentMindPuzzle: MindPuzzle | null
  selectedMindAnswer: number | null
  showMindResult: boolean
  mindStreak: number
  logicScreen: LogicScreen
  currentLogicPuzzleId: string | null
  logicGrid: GridCell[][]
  logicComplete: boolean
  logicCorrect: boolean
  filterDifficulty: "All" | "Easy" | "Medium" | "Hard"
}

export const initialBrainGamesState: BrainGamesState = {
  gameMode: "menu",
  totalScore: 0,
  mindScreen: "category",
  selectedMindCategory: null,
  currentMindPuzzle: null,
  selectedMindAnswer: null,
  showMindResult: false,
  mindStreak: 0,
  logicScreen: "select",
  currentLogicPuzzleId: null,
  logicGrid: [],
  logicComplete: false,
  logicCorrect: false,
  filterDifficulty: "All"
}

interface BrainGamesProps {
  onScoreChange?: (score: number) => void
  gameState?: BrainGamesState
  onGameStateChange?: (state: BrainGamesState) => void
}

export function BrainGames({ onScoreChange, gameState, onGameStateChange }: BrainGamesProps) {
  const [localState, setLocalState] = useState<BrainGamesState>(gameState || initialBrainGamesState)
  const [showInstructions, setShowInstructions] = useState(false)
  
  // Sync with external state
  useEffect(() => {
    if (gameState) {
      setLocalState(gameState)
    }
  }, [gameState])
  
  const updateState = useCallback((updates: Partial<BrainGamesState>) => {
    setLocalState(prev => {
      const newState = { ...prev, ...updates }
      onGameStateChange?.(newState)
      return newState
    })
  }, [onGameStateChange])
  
  // Destructure state for easier access
  const { 
    gameMode, totalScore, mindScreen, selectedMindCategory, currentMindPuzzle,
    selectedMindAnswer, showMindResult, mindStreak, logicScreen, currentLogicPuzzleId,
    logicGrid, logicComplete, logicCorrect, filterDifficulty 
  } = localState
  
  // Get current logic puzzle from ID
  const currentLogicPuzzle = currentLogicPuzzleId 
    ? logicPuzzles.find(p => p.id === currentLogicPuzzleId) || null 
    : null

  const updateScore = (points: number) => {
    const newScore = totalScore + points
    setTotalScore(newScore)
    onScoreChange?.(newScore)
  }

  // Mind Puzzles functions
  const generateMindPuzzle = (category: PuzzleCategory): MindPuzzle => {
    switch (category) {
      case "sequence": return generateSequencePuzzle()
      case "pattern": return generatePatternPuzzle()
      case "logic": return generateLogicPuzzle()
      case "math": return generateMathPuzzle()
      case "word": return generateWordPuzzle()
    }
  }

  const selectMindCategory = (category: PuzzleCategory) => {
    setSelectedMindCategory(category)
    setCurrentMindPuzzle(generateMindPuzzle(category))
    setSelectedMindAnswer(null)
    setShowMindResult(false)
    setMindScreen("puzzle")
  }

  const handleMindAnswer = (index: number) => {
    if (showMindResult) return
    setSelectedMindAnswer(index)
    setShowMindResult(true)
    
    if (currentMindPuzzle && index === currentMindPuzzle.correctAnswer) {
      updateScore(1)
      setMindStreak(prev => prev + 1)
    } else {
      setMindStreak(0)
    }
  }

  const nextMindPuzzle = () => {
    if (selectedMindCategory) {
      setCurrentMindPuzzle(generateMindPuzzle(selectedMindCategory))
      setSelectedMindAnswer(null)
      setShowMindResult(false)
    }
  }

  // Logic Grid functions
  const filteredLogicPuzzles = filterDifficulty === "All" 
    ? logicPuzzles 
    : logicPuzzles.filter(p => p.difficulty === filterDifficulty)

  const initializeLogicGrid = (puzzle: LogicPuzzle) => {
    const size = puzzle.categories[0].items.length
    const newGrid: GridCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ value: "empty" as const }))
    )
    setLogicGrid(newGrid)
    setLogicComplete(false)
    setLogicCorrect(false)
  }

  const selectLogicPuzzle = (puzzle: LogicPuzzle) => {
    setCurrentLogicPuzzle(puzzle)
    initializeLogicGrid(puzzle)
    setLogicScreen("puzzle")
  }

  const cycleLogicCell = (row: number, col: number) => {
    if (logicComplete) return
    const newGrid = [...logicGrid]
    const currentValue = newGrid[row][col].value
    const nextValue = currentValue === "empty" ? "x" : currentValue === "x" ? "o" : "empty"
    newGrid[row][col] = { value: nextValue }
    setLogicGrid(newGrid)
  }

  const checkLogicSolution = () => {
    if (!currentLogicPuzzle) return
    
    const size = currentLogicPuzzle.categories[0].items.length
    const category1 = currentLogicPuzzle.categories[0].items
    const category2 = currentLogicPuzzle.categories[1].items
    
    for (let row = 0; row < size; row++) {
      const oCount = logicGrid[row].filter(cell => cell.value === "o").length
      if (oCount !== 1) { setLogicComplete(true); setLogicCorrect(false); return }
    }
    
    for (let col = 0; col < size; col++) {
      let oCount = 0
      for (let row = 0; row < size; row++) {
        if (logicGrid[row][col].value === "o") oCount++
      }
      if (oCount !== 1) { setLogicComplete(true); setLogicCorrect(false); return }
    }
    
    let correct = true
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (logicGrid[row][col].value === "o") {
          const person = category1[row]
          const item = category2[col]
          if (currentLogicPuzzle.solution[person] !== item) { correct = false; break }
        }
      }
      if (!correct) break
    }
    
    setLogicComplete(true)
    setLogicCorrect(correct)
    
    if (correct) {
      const points = currentLogicPuzzle.difficulty === "Hard" ? 3 : currentLogicPuzzle.difficulty === "Medium" ? 2 : 1
      updateScore(points)
    }
  }

  const backToMenu = () => {
    setGameMode("menu")
    setMindScreen("category")
    setLogicScreen("select")
    setSelectedMindCategory(null)
    setCurrentMindPuzzle(null)
    setCurrentLogicPuzzle(null)
  }

  // ============ RENDER ============
  
  // Main Menu
  if (gameMode === "menu") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="text-center mt-2">
          <h2 className="text-pink-400 font-bold text-2xl md:text-3xl tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            BRAIN GAMES
          </h2>
          <p className="text-pink-300/60 text-sm mt-1">Challenge your mind</p>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-6 bg-pink-950/50 rounded-xl px-6 py-3 border border-pink-500/20">
          <div className="text-center">
            <p className="text-pink-300/60 text-xs">Total Score</p>
            <p className="text-pink-400 font-bold text-2xl drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{totalScore}</p>
          </div>
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <button
            onClick={() => setGameMode("mind")}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-pink-950/80 to-pink-900/50 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
              <style>{`
                @keyframes hourglassDrop { 0% { transform: translateY(-10px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(10px); opacity: 0; } }
                .hg-drop { animation: hourglassDrop 1.5s infinite linear; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#9d174d"/>
              <path d="M35 25 Q50 50 35 75 H65 Q50 50 65 25 Z" fill="none" stroke="white" strokeWidth="3"/>
              <path d="M38 28 Q50 45 62 28 Z" fill="#f472b6"/>
              <path d="M42 65 Q50 58 58 65 L62 72 H38 Z" fill="#fce7f3"/>
              <circle className="hg-drop" cx="50" cy="48" r="2" fill="#fce7f3"/>
              <path d="M32 25 H68" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <path d="M32 75 H68" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <div className="text-center">
              <p className="text-pink-300 font-bold text-lg">Mind Puzzles</p>
              <p className="text-pink-400/50 text-sm">Trivia, riddles, sequences</p>
            </div>
          </button>

          <button
            onClick={() => setGameMode("logic")}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-fuchsia-950/80 to-pink-900/50 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
              <style>{`
                @keyframes gridPulse1 { 0%, 100% { filter: drop-shadow(0 0 2px #f472b6); } 50% { filter: drop-shadow(0 0 10px #f472b6); } }
                @keyframes gridPulse2 { 0%, 100% { filter: drop-shadow(0 0 2px #a855f7); } 50% { filter: drop-shadow(0 0 10px #a855f7); } }
                .grid-line1 { animation: gridPulse1 2s infinite ease-in-out; }
                .grid-line2 { animation: gridPulse2 2s infinite ease-in-out 0.5s; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#020617"/>
              <g strokeWidth="4" fill="none" strokeLinecap="round">
                <path d="M20 30 H80" stroke="#f472b6" className="grid-line1"/>
                <path d="M30 50 H70" stroke="#a855f7" className="grid-line2"/>
                <path d="M40 70 H60" stroke="#06b6d4" className="grid-line1"/>
              </g>
            </svg>
            <div className="text-center">
              <p className="text-pink-300 font-bold text-lg">Logic Grids</p>
              <p className="text-pink-400/50 text-sm">Deduction puzzles</p>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowInstructions(true)}
          className="flex items-center gap-2 text-pink-400/60 text-sm hover:text-pink-400 transition-colors mt-4"
        >
          <HelpCircle className="w-4 h-4" />
          How to Play
        </button>

        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-md w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <h3 className="text-pink-400 font-bold text-lg mb-4">Brain Games</h3>
              <div className="space-y-4 text-pink-300/80 text-sm">
                <div>
                  <p className="text-pink-300 font-semibold">Mind Puzzles</p>
                  <p>Choose a category and solve trivia, riddles, and pattern puzzles. Build streaks for bonus points!</p>
                </div>
                <div>
                  <p className="text-pink-300 font-semibold">Logic Grids</p>
                  <p>Use clues to match items. Click cells to mark X (not a match) or O (confirmed match).</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Mind Puzzles - Category Selection
  if (gameMode === "mind" && mindScreen === "category") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <span className="text-pink-400 font-bold">Mind Puzzles</span>
          <span className="text-pink-400/60 text-sm">Score: {totalScore}</span>
        </div>

        <div className="flex items-center gap-4 bg-pink-950/50 rounded-xl px-4 py-2 border border-pink-500/20">
          <span className="text-pink-300/60 text-sm">Streak: <span className="text-pink-400 font-bold">{mindStreak}</span></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {(Object.keys(mindCategoryInfo) as PuzzleCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => selectMindCategory(category)}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-950/80 to-pink-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xl">
                {mindCategoryInfo[category].icon}
              </div>
              <div className="text-left flex-1">
                <p className="text-pink-300 font-semibold">{mindCategoryInfo[category].name}</p>
                <p className="text-pink-400/50 text-xs">{mindCategoryInfo[category].description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Mind Puzzles - Puzzle Screen
  if (gameMode === "mind" && mindScreen === "puzzle" && currentMindPuzzle) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => setMindScreen("category")} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <span className="text-pink-400 font-semibold">{selectedMindCategory && mindCategoryInfo[selectedMindCategory].name}</span>
          <span className="text-pink-400/60 text-sm">Streak: {mindStreak}</span>
        </div>

        <div className="w-full bg-gradient-to-b from-pink-950/80 to-pink-900/30 rounded-2xl p-5 md:p-8 border border-pink-500/30">
          <p className="text-pink-100 text-base md:text-lg leading-relaxed mb-6 text-center">
            {currentMindPuzzle.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentMindPuzzle.options.map((option, index) => {
              const isSelected = selectedMindAnswer === index
              const isCorrect = index === currentMindPuzzle.correctAnswer
              const showCorrectHighlight = showMindResult && isCorrect
              const showWrongHighlight = showMindResult && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleMindAnswer(index)}
                  disabled={showMindResult}
                  className={`
                    relative p-4 rounded-xl font-medium text-sm transition-all
                    ${!showMindResult ? 'bg-pink-900/50 border border-pink-500/30 text-pink-200 hover:bg-pink-800/50' : ''}
                    ${showCorrectHighlight ? 'bg-green-900/50 border-2 border-green-400 text-green-200' : ''}
                    ${showWrongHighlight ? 'bg-red-900/50 border-2 border-red-400 text-red-200' : ''}
                    ${showMindResult && !isSelected && !isCorrect ? 'opacity-50' : ''}
                  `}
                >
                  {option}
                  {showCorrectHighlight && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
                  {showWrongHighlight && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />}
                </button>
              )
            })}
          </div>

          {showMindResult && (
            <>
              <div className={`mt-4 p-4 rounded-xl ${selectedMindAnswer === currentMindPuzzle.correctAnswer ? 'bg-green-950/50 border border-green-500/30' : 'bg-pink-950/50 border border-pink-500/30'}`}>
                <p className={`text-sm ${selectedMindAnswer === currentMindPuzzle.correctAnswer ? 'text-green-300' : 'text-pink-300'}`}>
                  {selectedMindAnswer === currentMindPuzzle.correctAnswer ? 'Correct! ' : 'Not quite. '}
                  {currentMindPuzzle.explanation}
                </p>
              </div>
              <button
                onClick={nextMindPuzzle}
                className="w-full mt-4 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Next Puzzle
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Logic Grid - Puzzle Selection
  if (gameMode === "logic" && logicScreen === "select") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <span className="text-pink-400 font-bold">Logic Grids</span>
          <span className="text-pink-400/60 text-sm">Score: {totalScore}</span>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterDifficulty === diff
                  ? "bg-pink-500 text-white"
                  : "bg-pink-950/50 text-pink-300 border border-pink-500/30"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {filteredLogicPuzzles.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => selectLogicPuzzle(puzzle)}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-950/80 to-pink-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                puzzle.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
                puzzle.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-green-500/20 text-green-400"
              }`}>
                {puzzle.categories[0].items.length}x{puzzle.categories[0].items.length}
              </div>
              <div className="text-left flex-1">
                <p className="text-pink-300 font-semibold text-sm">{puzzle.title}</p>
                <p className={`text-xs ${
                  puzzle.difficulty === "Hard" ? "text-red-400/70" :
                  puzzle.difficulty === "Medium" ? "text-yellow-400/70" :
                  "text-green-400/70"
                }`}>{puzzle.difficulty}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Logic Grid - Puzzle Screen
  if (gameMode === "logic" && logicScreen === "puzzle" && currentLogicPuzzle) {
    const size = currentLogicPuzzle.categories[0].items.length
    const category1 = currentLogicPuzzle.categories[0]
    const category2 = currentLogicPuzzle.categories[1]
    const cellSize = size >= 5 ? "w-8 h-8 md:w-10 md:h-10" : "w-10 h-10 md:w-12 md:h-12"
    const headerWidth = size >= 5 ? "w-14 md:w-20" : "w-16 md:w-24"
    const fontSize = size >= 5 ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-xs"

    return (
      <div className="flex flex-col items-center gap-3 p-3 md:p-6 w-full max-w-3xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => { setLogicScreen("select"); setCurrentLogicPuzzle(null); setLogicComplete(false); }} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="text-center">
            <span className="text-pink-400 font-semibold">{currentLogicPuzzle.title}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
              currentLogicPuzzle.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
              currentLogicPuzzle.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-green-500/20 text-green-400"
            }`}>{currentLogicPuzzle.difficulty}</span>
          </div>
          <span className="text-pink-400/60 text-sm">Score: {totalScore}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
          <div className="bg-pink-950/50 rounded-xl p-2 md:p-4 border border-pink-500/30 overflow-x-auto">
            <div className="flex">
              <div className={`${headerWidth} h-6 md:h-8`} />
              {category2.items.map((item, idx) => (
                <div key={idx} className={`${cellSize} flex items-center justify-center ${fontSize} text-pink-300 font-medium text-center`}>
                  {item}
                </div>
              ))}
            </div>

            {category1.items.map((rowItem, rowIdx) => (
              <div key={rowIdx} className="flex">
                <div className={`${headerWidth} ${cellSize} flex items-center ${fontSize} text-pink-300 font-medium`}>
                  {rowItem}
                </div>
                {category2.items.map((_, colIdx) => (
                  <button
                    key={colIdx}
                    onClick={() => cycleLogicCell(rowIdx, colIdx)}
                    disabled={logicComplete}
                    className={`${cellSize} border border-pink-500/30 flex items-center justify-center transition-all hover:bg-pink-500/20
                      ${logicGrid[rowIdx]?.[colIdx]?.value === "x" ? "bg-red-900/30" : ""}
                      ${logicGrid[rowIdx]?.[colIdx]?.value === "o" ? "bg-green-900/30" : ""}
                    `}
                  >
                    {logicGrid[rowIdx]?.[colIdx]?.value === "x" && <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />}
                    {logicGrid[rowIdx]?.[colIdx]?.value === "o" && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="flex-1 space-y-3">
            <div className="bg-pink-950/50 rounded-xl p-4 border border-pink-500/30">
              <h4 className="text-pink-400 font-semibold text-sm mb-2">Clues:</h4>
              <ul className="space-y-2">
                {currentLogicPuzzle.clues.map((clue, idx) => (
                  <li key={idx} className="text-pink-300/80 text-xs md:text-sm flex gap-2">
                    <span className="text-pink-500">{idx + 1}.</span> {clue}
                  </li>
                ))}
              </ul>
            </div>

            {!logicComplete ? (
              <button
                onClick={checkLogicSolution}
                className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors"
              >
                Check Solution
              </button>
            ) : (
              <div className={`p-4 rounded-xl ${logicCorrect ? 'bg-green-950/50 border border-green-500/30' : 'bg-red-950/50 border border-red-500/30'}`}>
                <p className={`font-semibold ${logicCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {logicCorrect ? 'Correct! +' + (currentLogicPuzzle.difficulty === "Hard" ? 3 : currentLogicPuzzle.difficulty === "Medium" ? 2 : 1) + ' points' : 'Not quite right. Try again!'}
                </p>
                <button
                  onClick={() => { initializeLogicGrid(currentLogicPuzzle); }}
                  className="w-full mt-3 py-2 bg-pink-500/50 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" /> Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
