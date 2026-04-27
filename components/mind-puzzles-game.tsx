"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, HelpCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react"

type PuzzleCategory = "sequence" | "pattern" | "logic" | "math" | "word"

interface Puzzle {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

// Generate random puzzles for each category
const generateSequencePuzzle = (): Puzzle => {
  const sequences = [
    { seq: [2, 4, 6, 8], answer: 10, explanation: "Each number increases by 2" },
    { seq: [1, 4, 9, 16], answer: 25, explanation: "These are square numbers: 1², 2², 3², 4², 5²" },
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

const generatePatternPuzzle = (): Puzzle => {
  const patterns = [
    { pattern: "🔴🔵🔴🔵🔴", answer: "🔵", wrong: ["🔴", "🟢", "🟡"], explanation: "The pattern alternates red, blue" },
    { pattern: "⭐⭐🌙⭐⭐🌙⭐⭐", answer: "🌙", wrong: ["⭐", "☀️", "🌟"], explanation: "Two stars followed by one moon" },
    { pattern: "🔺🔺🔻🔺🔺🔻🔺🔺", answer: "🔻", wrong: ["🔺", "◆", "○"], explanation: "Two up triangles, one down triangle" },
    { pattern: "AABAABAAB", answer: "A", wrong: ["B", "C", "D"], explanation: "Pattern is AAB repeating" },
    { pattern: "123123123", answer: "1", wrong: ["2", "3", "4"], explanation: "Pattern is 123 repeating" },
  ]
  const chosen = patterns[Math.floor(Math.random() * patterns.length)]
  const options = [chosen.answer, ...chosen.wrong].sort(() => Math.random() - 0.5)
  
  return {
    id: `pat-${Date.now()}`,
    question: `Complete the pattern: ${chosen.pattern}?`,
    options,
    correctAnswer: options.indexOf(chosen.answer),
    explanation: chosen.explanation
  }
}

const generateLogicPuzzle = (): Puzzle => {
  const puzzles = [
    {
      question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. True or False?",
      answer: "True",
      wrong: ["False", "Maybe", "Cannot determine"],
      explanation: "This is a syllogism. If A⊂B and B⊂C, then A⊂C"
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
      question: "Tom is twice as old as Jerry was when Tom was as old as Jerry is now. If Jerry is 20, how old is Tom?",
      answer: "30",
      wrong: ["40", "25", "35"],
      explanation: "Let x be the age difference. Jerry is 20, Tom is 20+x. When Tom was 20, Jerry was 20-x. So 20+x = 2(20-x), giving x=10, Tom=30"
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

const generateMathPuzzle = (): Puzzle => {
  const puzzles = [
    {
      question: "If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
      answer: "3",
      wrong: ["100", "33", "9"],
      explanation: "Each cat catches 1 mouse per 3 minutes. In 100 minutes, each cat catches ~33 mice. 3 cats catch 99-100 mice."
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
      explanation: "After subtracting once, it's no longer 25"
    },
    {
      question: "If you have 3 apples and take away 2, how many do you have?",
      answer: "2",
      wrong: ["1", "3", "0"],
      explanation: "You took 2 apples, so you have 2"
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

const generateWordPuzzle = (): Puzzle => {
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
      explanation: "SWIMS looks the same when rotated 180°"
    },
    {
      question: "What word in the English language does the following: the first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire word signifies a great woman?",
      answer: "Heroine",
      wrong: ["History", "Heritage", "Harmony"],
      explanation: "He, Her, Hero, Heroine"
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

const categoryInfo: Record<PuzzleCategory, { name: string; icon: string; description: string; instructions: string }> = {
  sequence: {
    name: "Number Sequences",
    icon: "🔢",
    description: "Find the pattern in numbers",
    instructions: "Look at the sequence of numbers and identify the pattern. Select the number that comes next in the sequence."
  },
  pattern: {
    name: "Pattern Recognition",
    icon: "🎨",
    description: "Complete visual patterns",
    instructions: "Study the pattern of symbols or shapes. Identify what comes next to complete the repeating pattern."
  },
  logic: {
    name: "Logic Problems",
    icon: "🧠",
    description: "Solve logical riddles",
    instructions: "Read the statement carefully. Use deductive reasoning to determine the correct answer. Watch out for trick questions!"
  },
  math: {
    name: "Math Puzzles",
    icon: "➕",
    description: "Tricky math brain teasers",
    instructions: "These puzzles test your mathematical thinking. Read carefully - the obvious answer is often wrong!"
  },
  word: {
    name: "Word Puzzles",
    icon: "📝",
    description: "Riddles and wordplay",
    instructions: "Think creatively about language. These puzzles often involve puns, wordplay, or lateral thinking."
  }
}

interface MindPuzzlesGameProps {
  onScoreChange?: (score: number) => void
}

export function MindPuzzlesGame({ onScoreChange }: MindPuzzlesGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [streak, setStreak] = useState(0)

  const generatePuzzle = (category: PuzzleCategory): Puzzle => {
    switch (category) {
      case "sequence": return generateSequencePuzzle()
      case "pattern": return generatePatternPuzzle()
      case "logic": return generateLogicPuzzle()
      case "math": return generateMathPuzzle()
      case "word": return generateWordPuzzle()
    }
  }

  const selectCategory = (category: PuzzleCategory) => {
    setSelectedCategory(category)
    setCurrentPuzzle(generatePuzzle(category))
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    setTotalAttempts(prev => prev + 1)
    
    if (currentPuzzle && index === currentPuzzle.correctAnswer) {
      const newScore = score + 1
      setScore(newScore)
      setStreak(prev => prev + 1)
      onScoreChange?.(newScore)
    } else {
      setStreak(0)
    }
  }

  const nextPuzzle = () => {
    if (selectedCategory) {
      setCurrentPuzzle(generatePuzzle(selectedCategory))
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const backToCategories = () => {
    setSelectedCategory(null)
    setCurrentPuzzle(null)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        {/* Animated Hourglass Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <style>{`
              @keyframes drop {
                0% { transform: translateY(-25px); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translateY(20px); opacity: 0; }
              }
              @keyframes fill {
                0%, 100% { transform: scaleY(0.8); }
                50% { transform: scaleY(1.2); }
              }
              @keyframes flip {
                0%, 85% { transform: rotate(0deg); }
                95%, 100% { transform: rotate(180deg); }
              }
              @keyframes drain {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.5); }
              }
              .sand-drop { animation: drop 1.5s infinite linear; }
              .sand-bottom { animation: fill 3s infinite ease-in-out; transform-origin: bottom; }
              .sand-top { animation: drain 3s infinite ease-in-out; transform-origin: top; }
              .hourglass-body { animation: flip 6s infinite ease-in-out; transform-origin: center; }
            `}</style>
            <rect width="100" height="100" rx="24" fill="#9d174d"/>
            <g className="hourglass-body">
              <path d="M35 25 Q50 50 35 75 H65 Q50 50 65 25 Z" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path className="sand-top" d="M38 28 Q50 48 62 28 Z" fill="#f472b6"/>
              <path className="sand-bottom" d="M42 65 Q50 58 58 65 L62 72 H38 Z" fill="#fce7f3"/>
              <circle className="sand-drop" cx="50" cy="48" r="1.5" fill="#fce7f3"/>
              <circle className="sand-drop" cx="50" cy="48" r="1.5" fill="#fce7f3" style={{animationDelay: '0.5s'}}/>
              <circle className="sand-drop" cx="50" cy="48" r="1.5" fill="#fce7f3" style={{animationDelay: '1s'}}/>
            </g>
            <path d="M32 25 H68" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            <path d="M32 75 H68" stroke="white" strokeWidth="5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-pink-400 font-bold text-xl md:text-2xl tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            MIND PUZZLES
          </h2>
          <p className="text-pink-300/60 text-xs md:text-sm mt-1">Choose a category</p>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-4 md:gap-6 bg-pink-950/50 rounded-xl px-4 md:px-6 py-2 md:py-3 border border-pink-500/20">
          <div className="text-center">
            <p className="text-pink-300/60 text-[10px] md:text-xs">Score</p>
            <p className="text-pink-400 font-bold text-lg md:text-xl drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{score}</p>
          </div>
          <div className="w-px h-8 bg-pink-500/20" />
          <div className="text-center">
            <p className="text-pink-300/60 text-[10px] md:text-xs">Streak</p>
            <p className="text-pink-400 font-bold text-lg md:text-xl drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{streak}</p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {(Object.keys(categoryInfo) as PuzzleCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => selectCategory(category)}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-950/80 to-pink-900/50 rounded-xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
            >
              <span className="text-3xl md:text-4xl">{categoryInfo[category].icon}</span>
              <div className="text-left flex-1">
                <p className="text-pink-300 font-semibold text-sm md:text-base">{categoryInfo[category].name}</p>
                <p className="text-pink-400/50 text-xs md:text-sm">{categoryInfo[category].description}</p>
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
                <p>1. Choose a puzzle category from the menu</p>
                <p>2. Read the puzzle question carefully</p>
                <p>3. Select your answer from the options</p>
                <p>4. Learn from the explanation if you get it wrong</p>
                <p>5. Build your streak for bonus points!</p>
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

  // Puzzle Screen
  return (
    <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={backToCategories}
          className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryInfo[selectedCategory].icon}</span>
          <span className="text-pink-400 font-semibold text-sm">{categoryInfo[selectedCategory].name}</span>
        </div>
        <button
          onClick={() => setShowInstructions(true)}
          className="text-pink-400/60 hover:text-pink-400 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Score Bar */}
      <div className="flex items-center gap-4 md:gap-6 bg-pink-950/50 rounded-lg px-4 md:px-6 py-2 md:py-3 w-full justify-center border border-pink-500/20">
        <span className="text-pink-300/60 text-xs md:text-sm">Score: <span className="text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{score}</span></span>
        <span className="text-pink-500/30">|</span>
        <span className="text-pink-300/60 text-xs md:text-sm">Streak: <span className="text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{streak}</span></span>
      </div>

      {/* Puzzle Card */}
      {currentPuzzle && (
        <div className="w-full bg-gradient-to-b from-pink-950/80 to-pink-900/30 rounded-2xl p-5 md:p-8 border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
          {/* Question */}
          <p className="text-pink-100 text-base md:text-lg leading-relaxed mb-6 text-center">
            {currentPuzzle.question}
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPuzzle.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentPuzzle.correctAnswer
              const showCorrectHighlight = showResult && isCorrect
              const showWrongHighlight = showResult && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`
                    relative p-4 md:p-5 rounded-xl font-medium text-sm md:text-base transition-all
                    ${!showResult ? 'bg-pink-900/50 border border-pink-500/30 text-pink-200 hover:bg-pink-800/50 hover:border-pink-400/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] active:scale-[0.98]' : ''}
                    ${showCorrectHighlight ? 'bg-green-900/50 border-2 border-green-400 text-green-200 shadow-[0_0_15px_rgba(74,222,128,0.4)]' : ''}
                    ${showWrongHighlight ? 'bg-red-900/50 border-2 border-red-400 text-red-200 shadow-[0_0_15px_rgba(248,113,113,0.4)]' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'opacity-50' : ''}
                  `}
                >
                  <span>{option}</span>
                  {showCorrectHighlight && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                  {showWrongHighlight && (
                    <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={`mt-4 p-4 md:p-5 rounded-xl ${selectedAnswer === currentPuzzle.correctAnswer ? 'bg-green-950/50 border border-green-500/30' : 'bg-pink-950/50 border border-pink-500/30'}`}>
              <p className={`text-sm md:text-base ${selectedAnswer === currentPuzzle.correctAnswer ? 'text-green-300' : 'text-pink-300'}`}>
                <span className="font-semibold">{selectedAnswer === currentPuzzle.correctAnswer ? 'Correct!' : 'Not quite.'}</span>
                {' '}{currentPuzzle.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <button
              onClick={nextPuzzle}
              className="w-full md:w-auto md:min-w-[200px] md:mx-auto md:block mt-4 py-3 px-6 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Next Puzzle
            </button>
          )}
        </div>
      )}

      {/* Category Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-pink-950 to-black rounded-2xl p-6 max-w-md w-full border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{categoryInfo[selectedCategory].icon}</span>
              <h3 className="text-pink-400 font-bold text-lg drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">{categoryInfo[selectedCategory].name}</h3>
            </div>
            <p className="text-pink-300/80 text-sm leading-relaxed">
              {categoryInfo[selectedCategory].instructions}
            </p>
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
