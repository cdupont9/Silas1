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

// ============ USER PERSONA SECTION ============
interface PersonaQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: "hobby" | "music" | "goals" | "traits" | "wishlist" | "painpoints"
}

const personaQuestions: PersonaQuestion[] = [
  // Hobby
  { id: "p1", question: "What is Charity's favorite hobby outside of work?", options: ["Reading books", "Visiting museums or historical sites", "Playing video games", "Cooking"], correctAnswer: 1, category: "hobby" },
  // Music
  { id: "p2", question: "Who is Charity's favorite singer?", options: ["Taylor Swift", "Beyonce", "Hilary Duff", "Adele"], correctAnswer: 2, category: "music" },
  // Sports
  { id: "p3", question: "What sport does Charity enjoy?", options: ["Basketball", "Swimming", "Rollerskating", "Yoga"], correctAnswer: 2, category: "hobby" },
  // Books
  { id: "p4", question: "What type of books does Charity enjoy reading?", options: ["Mystery/Thriller", "Self-improvement", "Romance", "Science Fiction"], correctAnswer: 2, category: "hobby" },
  // Pain Points
  { id: "p5", question: "What is one of Charity's biggest pet peeves as a UX designer?", options: ["Too many meetings", "Scope creep", "Slow internet", "Open office plans"], correctAnswer: 1, category: "painpoints" },
  // Goals
  { id: "p6", question: "Which of these is one of Charity's top career goals?", options: ["Become a CEO", "Making meaningful impact", "Retire early", "Work from the beach"], correctAnswer: 1, category: "goals" },
  { id: "p7", question: "What does Charity value in her career?", options: ["High salary only", "Work-life balance", "Corner office", "Company car"], correctAnswer: 1, category: "goals" },
  { id: "p8", question: "Charity believes in continuous learning. True or False?", options: ["True", "False", "Only on weekends", "Only for promotions"], correctAnswer: 0, category: "goals" },
  { id: "p9", question: "Is leadership growth important to Charity?", options: ["Not at all", "Only for the title", "Yes, growing into senior roles", "She prefers to stay junior"], correctAnswer: 2, category: "goals" },
  // Wish List
  { id: "p10", question: "What's on Charity's bucket list?", options: ["Climb Mount Everest", "Speak at conferences", "Become a chef", "Move to Mars"], correctAnswer: 1, category: "wishlist" },
  { id: "p11", question: "Which country does Charity want to travel to?", options: ["Japan", "Australia", "Greece", "Brazil"], correctAnswer: 2, category: "wishlist" },
  // Traits
  { id: "p12", question: "Which personality trait best describes Charity?", options: ["Impatient & rushed", "Creative & curious", "Disorganized", "Prefers working alone"], correctAnswer: 1, category: "traits" },
  { id: "p13", question: "Is Charity empathetic and caring?", options: ["No, very cold", "Yes, very much so", "Only at work", "Only with family"], correctAnswer: 1, category: "traits" },
  { id: "p14", question: "How would you describe Charity's demeanor?", options: ["Anxious & stressed", "Calm & patient", "Aggressive", "Indifferent"], correctAnswer: 1, category: "traits" },
  { id: "p15", question: "Is Charity detail-oriented?", options: ["Not at all", "Only sometimes", "Yes, very detail-oriented", "She overlooks everything"], correctAnswer: 2, category: "traits" },
  { id: "p16", question: "Which trait does Charity possess?", options: ["Lazy & unmotivated", "Ambitious & driven", "Easily distracted", "Gives up easily"], correctAnswer: 1, category: "traits" },
]

// ============ MAIN COMPONENT ============
type GameMode = "menu" | "mind" | "logic" | "persona"
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
  // Persona game state
  currentPersonaQuestion: PersonaQuestion | null
  selectedPersonaAnswer: number | null
  showPersonaResult: boolean
  personaStreak: number
  personaQuestionsAnswered: string[]
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
  filterDifficulty: "All",
  // Persona game state
  currentPersonaQuestion: null,
  selectedPersonaAnswer: null,
  showPersonaResult: false,
  personaStreak: 0,
  personaQuestionsAnswered: []
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
    logicGrid, logicComplete, logicCorrect, filterDifficulty,
    currentPersonaQuestion, selectedPersonaAnswer, showPersonaResult, personaStreak, personaQuestionsAnswered
  } = localState
  
  // Get current logic puzzle from ID
  const currentLogicPuzzle = currentLogicPuzzleId 
    ? logicPuzzles.find(p => p.id === currentLogicPuzzleId) || null 
    : null

  const updateScore = (points: number) => {
    const newScore = totalScore + points
    updateState({ totalScore: newScore })
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
    updateState({
      selectedMindCategory: category,
      currentMindPuzzle: generateMindPuzzle(category),
      selectedMindAnswer: null,
      showMindResult: false,
      mindScreen: "puzzle"
    })
  }

  const handleMindAnswer = (index: number) => {
    if (showMindResult) return
    
    const isCorrect = currentMindPuzzle && index === currentMindPuzzle.correctAnswer
    if (isCorrect) {
      const newScore = totalScore + 1
      updateState({ 
        selectedMindAnswer: index, 
        showMindResult: true, 
        mindStreak: mindStreak + 1,
        totalScore: newScore
      })
      onScoreChange?.(newScore)
    } else {
      updateState({ selectedMindAnswer: index, showMindResult: true, mindStreak: 0 })
    }
  }

  const nextMindPuzzle = () => {
    if (selectedMindCategory) {
      updateState({
        currentMindPuzzle: generateMindPuzzle(selectedMindCategory),
        selectedMindAnswer: null,
        showMindResult: false
      })
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
    updateState({ logicGrid: newGrid, logicComplete: false, logicCorrect: false })
  }

  const selectLogicPuzzle = (puzzle: LogicPuzzle) => {
    const size = puzzle.categories[0].items.length
    const newGrid: GridCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ value: "empty" as const }))
    )
    updateState({ 
      currentLogicPuzzleId: puzzle.id, 
      logicGrid: newGrid, 
      logicComplete: false, 
      logicCorrect: false,
      logicScreen: "puzzle" 
    })
  }

  const cycleLogicCell = (row: number, col: number) => {
    if (logicComplete) return
    const newGrid = logicGrid.map(r => r.map(c => ({ ...c })))
    const currentValue = newGrid[row][col].value
    const nextValue = currentValue === "empty" ? "x" : currentValue === "x" ? "o" : "empty"
    newGrid[row][col] = { value: nextValue }
    updateState({ logicGrid: newGrid })
  }

  const checkLogicSolution = () => {
    if (!currentLogicPuzzle) return
    
    const size = currentLogicPuzzle.categories[0].items.length
    const category1 = currentLogicPuzzle.categories[0].items
    const category2 = currentLogicPuzzle.categories[1].items
    
    for (let row = 0; row < size; row++) {
      const oCount = logicGrid[row].filter(cell => cell.value === "o").length
      if (oCount !== 1) { updateState({ logicComplete: true, logicCorrect: false }); return }
    }
    
    for (let col = 0; col < size; col++) {
      let oCount = 0
      for (let row = 0; row < size; row++) {
        if (logicGrid[row][col].value === "o") oCount++
      }
      if (oCount !== 1) { updateState({ logicComplete: true, logicCorrect: false }); return }
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
    
    if (correct) {
      const points = currentLogicPuzzle.difficulty === "Hard" ? 3 : currentLogicPuzzle.difficulty === "Medium" ? 2 : 1
      const newScore = totalScore + points
      updateState({ logicComplete: true, logicCorrect: true, totalScore: newScore })
      onScoreChange?.(newScore)
    } else {
      updateState({ logicComplete: true, logicCorrect: false })
    }
  }

  const backToMenu = () => {
    updateState({ gameMode: "menu" })
  }

  // Persona game functions
  const getRandomPersonaQuestion = (): PersonaQuestion => {
    const unanswered = personaQuestions.filter(q => !personaQuestionsAnswered.includes(q.id))
    if (unanswered.length === 0) {
      // Reset if all questions answered
      return personaQuestions[Math.floor(Math.random() * personaQuestions.length)]
    }
    return unanswered[Math.floor(Math.random() * unanswered.length)]
  }

  const startPersonaGame = () => {
    const question = getRandomPersonaQuestion()
    updateState({
      gameMode: "persona",
      currentPersonaQuestion: question,
      selectedPersonaAnswer: null,
      showPersonaResult: false
    })
  }

  const handlePersonaAnswer = (index: number) => {
    if (showPersonaResult) return
    
    const isCorrect = currentPersonaQuestion && index === currentPersonaQuestion.correctAnswer
    if (isCorrect) {
      const newScore = totalScore + 1
      updateState({
        selectedPersonaAnswer: index,
        showPersonaResult: true,
        personaStreak: personaStreak + 1,
        totalScore: newScore,
        personaQuestionsAnswered: [...personaQuestionsAnswered, currentPersonaQuestion?.id || '']
      })
      onScoreChange?.(newScore)
    } else {
      updateState({
        selectedPersonaAnswer: index,
        showPersonaResult: true,
        personaStreak: 0,
        personaQuestionsAnswered: [...personaQuestionsAnswered, currentPersonaQuestion?.id || '']
      })
    }
  }

  const nextPersonaQuestion = () => {
    const question = getRandomPersonaQuestion()
    updateState({
      currentPersonaQuestion: question,
      selectedPersonaAnswer: null,
      showPersonaResult: false
    })
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <button
            onClick={() => startPersonaGame()}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-violet-950/80 to-pink-900/50 rounded-2xl border border-violet-500/30 hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
              <style>{`
                @keyframes personaPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px #8b5cf6); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 15px #8b5cf6); } }
                .persona-icon { animation: personaPulse 2s infinite ease-in-out; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#1e1b4b"/>
              <g className="persona-icon">
                <circle cx="50" cy="35" r="15" fill="#8b5cf6"/>
                <path d="M25 80 Q25 55 50 55 Q75 55 75 80" fill="#c4b5fd"/>
                <circle cx="45" cy="33" r="2" fill="white"/>
                <circle cx="55" cy="33" r="2" fill="white"/>
                <path d="M45 40 Q50 44 55 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </g>
            </svg>
            <div className="text-center">
              <p className="text-violet-300 font-bold text-lg">User Persona</p>
              <p className="text-violet-400/50 text-sm">How well do you know Charity?</p>
            </div>
          </button>

          <button
            onClick={() => updateState({ gameMode: "mind" })}
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
            onClick={() => updateState({ gameMode: "logic" })}
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
                  <p className="text-violet-300 font-semibold">User Persona</p>
                  <p>Test how well you know Charity! Answer questions about her hobbies, goals, traits, and more.</p>
                </div>
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
          <button onClick={() => updateState({ mindScreen: "category" })} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
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
              onClick={() => updateState({ filterDifficulty: diff })}
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
          <button onClick={() => updateState({ logicScreen: "select", logicComplete: false })} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
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

  // User Persona Game
  if (gameMode === "persona" && currentPersonaQuestion) {
    const categoryLabels: Record<string, string> = {
      hobby: "Hobbies & Interests",
      music: "Music",
      goals: "Career Goals",
      traits: "Personality Traits",
      wishlist: "Bucket List",
      painpoints: "Pain Points"
    }

    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-violet-400 text-sm hover:text-violet-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-violet-400/60 text-sm">Streak: {personaStreak}</span>
            <span className="text-violet-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>
        </div>

        {/* Persona Card */}
        <div className="w-full bg-gradient-to-br from-violet-950/80 to-indigo-900/50 rounded-2xl border border-violet-500/30 p-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              C
            </div>
            <div>
              <h3 className="text-violet-200 font-bold text-xl">Charity Dupont</h3>
              <p className="text-violet-400/60 text-sm">UX/UI Designer</p>
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {categoryLabels[currentPersonaQuestion.category]}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-violet-100 text-lg font-medium leading-relaxed">{currentPersonaQuestion.question}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentPersonaQuestion.options.map((option, idx) => {
              const isSelected = selectedPersonaAnswer === idx
              const isCorrect = idx === currentPersonaQuestion.correctAnswer
              const showResult = showPersonaResult

              return (
                <button
                  key={idx}
                  onClick={() => handlePersonaAnswer(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3
                    ${!showResult ? 'bg-violet-900/30 hover:bg-violet-800/40 border border-violet-500/20 hover:border-violet-400/40' : ''}
                    ${showResult && isCorrect ? 'bg-green-900/40 border border-green-500/50' : ''}
                    ${showResult && isSelected && !isCorrect ? 'bg-red-900/40 border border-red-500/50' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'bg-violet-900/20 border border-violet-500/10 opacity-50' : ''}
                  `}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${!showResult ? 'bg-violet-500/30 text-violet-300' : ''}
                    ${showResult && isCorrect ? 'bg-green-500 text-white' : ''}
                    ${showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'bg-violet-500/20 text-violet-400' : ''}
                  `}>
                    {showResult && isCorrect ? <CheckCircle className="w-5 h-5" /> : 
                     showResult && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                     String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`flex-1 ${showResult && isCorrect ? 'text-green-300' : showResult && isSelected && !isCorrect ? 'text-red-300' : 'text-violet-200'}`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Result & Next */}
          {showPersonaResult && (
            <div className="mt-6 pt-6 border-t border-violet-500/20">
              <div className={`text-center mb-4 ${selectedPersonaAnswer === currentPersonaQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                <p className="text-xl font-bold">
                  {selectedPersonaAnswer === currentPersonaQuestion.correctAnswer ? 'Correct!' : 'Not quite!'}
                </p>
                {selectedPersonaAnswer !== currentPersonaQuestion.correctAnswer && (
                  <p className="text-sm mt-1 text-violet-300/70">
                    The answer was: {currentPersonaQuestion.options[currentPersonaQuestion.correctAnswer]}
                  </p>
                )}
              </div>
              <button
                onClick={nextPersonaQuestion}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Next Question <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="text-center text-violet-400/60 text-sm">
          {personaQuestionsAnswered.length} of {personaQuestions.length} questions answered
        </div>
      </div>
    )
  }

  return null
}
