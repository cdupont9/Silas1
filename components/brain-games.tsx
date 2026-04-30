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

// ============ USER PERSONA SECTION (Card Sorting Game) ============
// Sort statements into the correct UX persona category
interface PersonaCard {
  id: string
  statement: string
  correctCategory: "need" | "painpoint" | "goal" | "behavior"
}

// Charity's User Persona Story
const charityPersonaStory = `Charity is a UX/UI Designer who transitioned from being a 4th-grade teacher. She brings empathy and patience from her teaching background into her design work. Growing up homeschooled by her grandmother in Chicago, she learned early on to be resourceful - even running a breakfast business as a kid. After moving to New Jersey with her mother (driving straight through with no breaks!), she pursued her passion for design at Columbia University. Now at Google, she focuses on AI-driven experiences while maintaining her core values of meaningful impact and work-life balance.`

// Cards to sort into categories
const personaCards: PersonaCard[] = [
  // Needs
  { id: "pc1", statement: "Peace and quiet in work environment", correctCategory: "need" },
  { id: "pc2", statement: "Making meaningful impact through work", correctCategory: "need" },
  { id: "pc3", statement: "Work-life balance", correctCategory: "need" },
  { id: "pc4", statement: "Continuous learning and growth", correctCategory: "need" },
  { id: "pc5", statement: "Creative freedom in projects", correctCategory: "need" },
  { id: "pc6", statement: "Clear communication from stakeholders", correctCategory: "need" },
  // Pain Points
  { id: "pc7", statement: "Scope creep on projects", correctCategory: "painpoint" },
  { id: "pc8", statement: "Vague feedback without reasoning", correctCategory: "painpoint" },
  { id: "pc9", statement: "Designs that don't help users learn", correctCategory: "painpoint" },
  { id: "pc10", statement: "Last-minute requirement changes", correctCategory: "painpoint" },
  { id: "pc11", statement: "Unclear project expectations", correctCategory: "painpoint" },
  { id: "pc12", statement: "Not enough time for user research", correctCategory: "painpoint" },
  // Goals
  { id: "pc13", statement: "Speak at design conferences", correctCategory: "goal" },
  { id: "pc14", statement: "Travel to Greece", correctCategory: "goal" },
  { id: "pc15", statement: "Experience bus travel adventure", correctCategory: "goal" },
  { id: "pc16", statement: "Grow into senior leadership roles", correctCategory: "goal" },
  { id: "pc17", statement: "Build a design portfolio brand", correctCategory: "goal" },
  { id: "pc18", statement: "Mentor junior designers", correctCategory: "goal" },
  // Behaviors
  { id: "pc19", statement: "Spontaneous, tries new things", correctCategory: "behavior" },
  { id: "pc20", statement: "Creative and curious problem-solver", correctCategory: "behavior" },
  { id: "pc21", statement: "Stays calm under pressure", correctCategory: "behavior" },
  { id: "pc22", statement: "Empathetic with users and teammates", correctCategory: "behavior" },
  { id: "pc23", statement: "Very detail-oriented", correctCategory: "behavior" },
  { id: "pc24", statement: "Patient when explaining concepts", correctCategory: "behavior" },
]

const categoryInfo = {
  need: { label: "Needs", color: "from-blue-600 to-blue-800", borderColor: "border-blue-500", bgColor: "bg-blue-950/50" },
  painpoint: { label: "Pain Points", color: "from-red-600 to-red-800", borderColor: "border-red-500", bgColor: "bg-red-950/50" },
  goal: { label: "Goals", color: "from-green-600 to-green-800", borderColor: "border-green-500", bgColor: "bg-green-950/50" },
  behavior: { label: "Behaviors", color: "from-purple-600 to-purple-800", borderColor: "border-purple-500", bgColor: "bg-purple-950/50" },
}

// ============ KNOW ME QUIZ - "THIS OR THAT" FORMAT ============
// Pick between two options - which one is true about Charity?
interface ThisOrThatQuestion {
  id: string
  category: "music" | "food" | "travel" | "background" | "starbucks" | "fashion"
  optionA: string
  optionB: string
  correctOption: "A" | "B" // Which one is true about Charity
}

const thisOrThatQuestions: ThisOrThatQuestion[] = [
  // Music
  { id: "tot1", category: "music", optionA: "Hilary Duff", optionB: "Britney Spears", correctOption: "A" }, // Favorite childhood artist
  { id: "tot2", category: "music", optionA: "Metamorphosis album", optionB: "Dignity album", correctOption: "A" }, // Still listens while driving
  { id: "tot3", category: "music", optionA: "Lizzie McGuire", optionB: "Hannah Montana", correctOption: "A" }, // Obsessed with
  { id: "tot4", category: "music", optionA: "VHS collection", optionB: "DVD collection", correctOption: "A" }, // Owns Lizzie McGuire on
  { id: "tot5", category: "music", optionA: "Mandy Moore", optionB: "Christina Aguilera", correctOption: "A" }, // Other fave artist
  { id: "tot6", category: "music", optionA: "Only Hope", optionB: "Walk Me Home", correctOption: "A" }, // Fave Mandy Moore song
  { id: "tot7", category: "music", optionA: "A Walk to Remember", optionB: "The Princess Diaries", correctOption: "A" }, // Fave movie (even tho ending makes her cry)
  { id: "tot8", category: "music", optionA: "So Yesterday", optionB: "With Love", correctOption: "A" }, // Fave Hilary song
  { id: "tot9", category: "music", optionA: "Come Clean", optionB: "Beat of My Heart", correctOption: "A" }, // Another fave
  { id: "tot10", category: "music", optionA: "Why Not", optionB: "Fly", correctOption: "A" }, // Driving playlist
  // Food & Drinks
  { id: "tot11", category: "food", optionA: "Apple juice", optionB: "Orange juice", correctOption: "A" }, // Preferred juice
  { id: "tot12", category: "food", optionA: "Lemonade + Ginger ale", optionB: "Lemonade + Sprite", correctOption: "A" }, // Fave drink combo
  { id: "tot13", category: "food", optionA: "Broadway Chicken", optionB: "Popeyes", correctOption: "A" }, // Fave takeout
  { id: "tot14", category: "food", optionA: "Hot and Honey Chicken", optionB: "Nashville Hot Chicken", correctOption: "A" }, // Go-to order
  { id: "tot15", category: "food", optionA: "Buttermilk battered", optionB: "Panko breaded", correctOption: "A" }, // Chicken batter
  { id: "tot16", category: "food", optionA: "Honey mustard + Honey", optionB: "BBQ + Ranch", correctOption: "A" }, // Sauces
  { id: "tot17", category: "food", optionA: "Sweet and sour shrimp", optionB: "General Tso's chicken", correctOption: "A" }, // Chinese order
  { id: "tot18", category: "food", optionA: "Westfield, NJ", optionB: "Hoboken, NJ", correctOption: "A" }, // Broadway Chicken location
  // Starbucks
  { id: "tot19", category: "starbucks", optionA: "Caramel Ribbon Crunch", optionB: "Mocha Frappuccino", correctOption: "A" }, // Fave Starbucks
  { id: "tot20", category: "starbucks", optionA: "Extra caramel, extra crunch", optionB: "Light ice, no whip", correctOption: "A" }, // How she orders it
  { id: "tot21", category: "starbucks", optionA: "Vanilla Bean Frapp + caramel", optionB: "Chai Tea Latte", correctOption: "A" }, // Other fave
  { id: "tot22", category: "starbucks", optionA: "As a little girl", optionB: "In college", correctOption: "A" }, // When she started loving VBF
  { id: "tot23", category: "starbucks", optionA: "Bank of America, Grand Central", optionB: "Chase Bank, Times Square", correctOption: "A" }, // Where mom worked
  // Background
  { id: "tot24", category: "background", optionA: "4th grade", optionB: "6th grade", correctOption: "A" }, // Homeschooled until
  { id: "tot25", category: "background", optionA: "Her grandmother", optionB: "Her mother", correctOption: "A" }, // Who homeschooled her
  { id: "tot26", category: "background", optionA: "Breakfast business", optionB: "Lemonade stand", correctOption: "A" }, // Childhood business
  { id: "tot27", category: "background", optionA: "Chicago to New Jersey", optionB: "LA to New Jersey", correctOption: "A" }, // Moved from
  { id: "tot28", category: "background", optionA: "Drove with no breaks", optionB: "Stopped at hotels", correctOption: "A" }, // How they traveled
  { id: "tot29", category: "background", optionA: "Ballet dancer", optionB: "Singer", correctOption: "A" }, // Childhood dream
  { id: "tot30", category: "background", optionA: "Cook", optionB: "Doctor", correctOption: "A" }, // Other childhood dream
  { id: "tot31", category: "background", optionA: "Front row", optionB: "Back row", correctOption: "A" }, // Roller coaster seat
  { id: "tot32", category: "background", optionA: "Horseback riding", optionB: "Ice skating", correctOption: "A" }, // Hasn't done in years
  { id: "tot33", category: "background", optionA: "Peace and quiet", optionB: "Loud and busy", correctOption: "A" }, // Values in environment
  // Travel
  { id: "tot34", category: "travel", optionA: "Has been to South Africa", optionB: "Has been to Australia", correctOption: "A" },
  { id: "tot35", category: "travel", optionA: "Has been to Paris", optionB: "Has been to Tokyo", correctOption: "A" },
  { id: "tot36", category: "travel", optionA: "Has been to Spain", optionB: "Has been to Portugal", correctOption: "A" },
  { id: "tot37", category: "travel", optionA: "Never taken Greyhound", optionB: "Never taken Amtrak", correctOption: "A" },
  { id: "tot38", category: "travel", optionA: "Bus travel bucket list", optionB: "Cruise ship bucket list", correctOption: "A" },
  { id: "tot39", category: "travel", optionA: "Greece bucket list", optionB: "Japan bucket list", correctOption: "A" },
  // Fashion & Personality
  { id: "tot40", category: "fashion", optionA: "80s and 90s fashion", optionB: "Modern streetwear", correctOption: "A" },
  { id: "tot41", category: "fashion", optionA: "Late 90s kid", optionB: "Early 80s kid", correctOption: "A" },
  { id: "tot42", category: "fashion", optionA: "Romance novels", optionB: "Horror novels", correctOption: "A" },
  { id: "tot43", category: "fashion", optionA: "Spontaneous", optionB: "Predictable", correctOption: "A" },
  { id: "tot44", category: "fashion", optionA: "Loves trying new things", optionB: "Sticks to routine", correctOption: "A" },
]

const thisOrThatCategoryInfo: Record<string, { label: string; icon: string; bgColor: string }> = {
  music: { label: "Music", icon: "🎵", bgColor: "from-pink-600 to-rose-700" },
  food: { label: "Food & Drinks", icon: "🍽️", bgColor: "from-orange-600 to-amber-700" },
  travel: { label: "Travel", icon: "✈️", bgColor: "from-blue-600 to-cyan-700" },
  background: { label: "Background", icon: "📚", bgColor: "from-amber-600 to-yellow-700" },
  starbucks: { label: "Starbucks", icon: "☕", bgColor: "from-green-600 to-emerald-700" },
  fashion: { label: "Style & Personality", icon: "👗", bgColor: "from-purple-600 to-violet-700" },
}

// ============ TWO TRUTHS AND A LIE SECTION ============
interface TwoTruthsRound {
  id: string
  statements: string[]
  lieIndex: number
  category: string // Added category for consistency
}

const twoTruthsRounds: TwoTruthsRound[] = [
  // Childhood & Background (same category per round)
  { id: "tt1", category: "childhood", statements: ["I was homeschooled until 4th grade", "My grandmother homeschooled me, my cousin, and other kids", "I was homeschooled by a private tutor in our basement"], lieIndex: 2 },
  { id: "tt2", category: "childhood", statements: ["I used to want to be a ballet dancer", "I used to want to be a cook", "I used to want to be a professional singer"], lieIndex: 2 },
  { id: "tt3", category: "childhood", statements: ["I had a breakfast business when homeschooled", "I ran a lemonade stand every summer", "My grandmother taught me entrepreneurship early"], lieIndex: 1 },
  { id: "tt4", category: "moving", statements: ["My mother and I drove from Chicago to New Jersey", "We drove straight through with no hotel stops", "We stopped at 5 different hotels along the way"], lieIndex: 2 },
  { id: "tt5", category: "moving", statements: ["I moved from Chicago to New Jersey", "We ate lots of snacks on our road trip", "I moved from Los Angeles to New Jersey"], lieIndex: 2 },
  // Hobbies (same category per round)
  { id: "tt6", category: "hobbies", statements: ["I love riding in the front of roller coasters", "I enjoy horseback riding but haven't done it since I was little", "I've been skydiving twice"], lieIndex: 2 },
  { id: "tt7", category: "hobbies", statements: ["I enjoy rollerskating", "I love visiting museums and historical sites", "I'm a professional ice skater"], lieIndex: 2 },
  { id: "tt8", category: "hobbies", statements: ["I love reading romance novels", "I value peace and quiet", "I hate trying new things"], lieIndex: 2 },
  // Hilary Duff (same category per round)
  { id: "tt9", category: "hilary", statements: ["Hilary Duff is my favorite childhood artist", "I still own the VHS of the Lizzie McGuire movie", "I've met Hilary Duff in person three times"], lieIndex: 2 },
  { id: "tt10", category: "hilary", statements: ["I was obsessed with Lizzie McGuire", "I still love Hilary Duff to this day", "I watched every episode of Hannah Montana before Lizzie McGuire"], lieIndex: 2 },
  { id: "tt11", category: "hilary", statements: ["'So Yesterday' is one of my favorite songs", "'Come Clean' is on my driving playlist", "I've never listened to the Metamorphosis album"], lieIndex: 2 },
  { id: "tt12", category: "hilary", statements: ["I still listen to Metamorphosis while driving", "'Why Not' is one of my favorites", "I think Hilary Duff's music is overrated"], lieIndex: 2 },
  // Mandy Moore (same category per round)
  { id: "tt13", category: "mandy", statements: ["I love Mandy Moore's song 'Only Hope'", "'Cry' by Mandy Moore is a favorite", "I've never heard any Mandy Moore songs"], lieIndex: 2 },
  { id: "tt14", category: "mandy", statements: ["'Candy' by Mandy Moore is one of my favorites", "I love 'A Walk to Remember' even though the ending makes me cry", "I think Mandy Moore is a terrible actress"], lieIndex: 2 },
  // Food & Drinks (same category per round)
  { id: "tt15", category: "drinks", statements: ["My favorite drink is lemonade mixed with ginger ale", "I prefer apple juice over orange juice", "I prefer orange juice over apple juice"], lieIndex: 2 },
  { id: "tt16", category: "food", statements: ["My favorite takeout is Broadway Hot and Honey Chicken", "I love buttermilk battered chicken", "I prefer grilled chicken over fried chicken"], lieIndex: 2 },
  { id: "tt17", category: "food", statements: ["I get honey mustard and honey on the side", "My favorite chicken place is in Westfield", "I've never been to Broadway Chicken"], lieIndex: 2 },
  { id: "tt18", category: "food", statements: ["My go-to Chinese order is sweet and sour shrimp", "I always order General Tso's chicken at Chinese restaurants", "I love Chinese takeout"], lieIndex: 1 },
  // Starbucks (same category per round)
  { id: "tt19", category: "starbucks", statements: ["My favorite Starbucks drink is Caramel Ribbon Crunch", "I order it with extra caramel and extra crunch", "I've never been to Starbucks"], lieIndex: 2 },
  { id: "tt20", category: "starbucks", statements: ["I love Vanilla Bean Frappuccino with caramel syrup", "I fell in love with it as a little girl", "I discovered Starbucks in college"], lieIndex: 2 },
  { id: "tt21", category: "starbucks", statements: ["My mom worked at Bank of America in Grand Central", "That's where I first tried Starbucks", "I prefer hot coffee over frappuccinos"], lieIndex: 2 },
  // Travel (same category per round)
  { id: "tt22", category: "travel", statements: ["I've been to Spain, Paris, and Italy", "I've visited South Africa", "I've taken a Greyhound bus across the country"], lieIndex: 2 },
  { id: "tt23", category: "travel", statements: ["I've never taken a Greyhound bus", "Bus travel is on my bucket list", "I've already done a cross-country bus trip"], lieIndex: 2 },
  { id: "tt24", category: "travel", statements: ["I've visited Ireland", "I've been to UK territory", "I've traveled to Australia"], lieIndex: 2 },
  // Fashion & Personality (same category per round)
  { id: "tt25", category: "fashion", statements: ["I love 80s and 90s fashion", "I grew up in the late 90s and early 2000s", "I think vintage fashion is ugly"], lieIndex: 2 },
  { id: "tt26", category: "personality", statements: ["I consider myself spontaneous", "I like trying things that are different", "I'm very predictable and hate change"], lieIndex: 2 },
  // Goals (same category per round)
  { id: "tt27", category: "goals", statements: ["I dream of traveling to Greece", "I want to speak at design conferences", "I've already given a TED talk"], lieIndex: 2 },
  { id: "tt28", category: "goals", statements: ["Work-life balance is important to me", "I want to grow into senior leadership roles", "I only care about salary, not impact"], lieIndex: 2 },
]

// ============ MAIN COMPONENT ============
type GameMode = "menu" | "mind" | "logic" | "persona" | "truths" | "trivia"
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
  // Persona game state (card sorting)
  currentPersonaCard: PersonaCard | null
  selectedCategory: "need" | "painpoint" | "goal" | "behavior" | null
  showPersonaResult: boolean
  personaStreak: number
  personaCardsAnswered: string[]
  // This or That game state (know me quiz)
  currentThisOrThat: ThisOrThatQuestion | null
  selectedOption: "A" | "B" | null
  showThisOrThatResult: boolean
  thisOrThatStreak: number
  thisOrThatAnswered: string[]
  // Two Truths game state
  currentTruthsRound: TwoTruthsRound | null
  selectedTruthsAnswer: number | null
  showTruthsResult: boolean
  truthsStreak: number
  truthsRoundsPlayed: string[]
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
  // Persona game state (card sorting)
  currentPersonaCard: null,
  selectedCategory: null,
  showPersonaResult: false,
  personaStreak: 0,
  personaCardsAnswered: [],
  // This or That game state (know me quiz)
  currentThisOrThat: null,
  selectedOption: null,
  showThisOrThatResult: false,
  thisOrThatStreak: 0,
  thisOrThatAnswered: [],
  // Two Truths game state
  currentTruthsRound: null,
  selectedTruthsAnswer: null,
  showTruthsResult: false,
  truthsStreak: 0,
  truthsRoundsPlayed: []
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
  
  // Destructure state for easier access with fallbacks
  const { 
    gameMode, totalScore, mindScreen, selectedMindCategory, currentMindPuzzle,
    selectedMindAnswer, showMindResult, mindStreak, logicScreen, currentLogicPuzzleId,
    logicGrid, logicComplete, logicCorrect, filterDifficulty,
    showPersonaResult, personaStreak,
    currentTruthsRound, selectedTruthsAnswer, showTruthsResult, truthsStreak
  } = localState
  
  // Get values with fallback (for backwards compatibility with saved state)
  const currentPersonaCard = localState.currentPersonaCard || null
  const selectedCategory = localState.selectedCategory || null
  const personaCardsAnswered = localState.personaCardsAnswered || []
  const currentThisOrThat = localState.currentThisOrThat || null
  const selectedOption = localState.selectedOption || null
  const showThisOrThatResult = localState.showThisOrThatResult || false
  const thisOrThatStreak = localState.thisOrThatStreak || 0
  const thisOrThatAnswered = localState.thisOrThatAnswered || []
  const truthsRoundsPlayed = localState.truthsRoundsPlayed || []
  
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

  // Persona game functions (needs & pain points)
  const getRandomPersonaQuestion = (): PersonaNeedQuestion => {
    const unanswered = personaNeedQuestions.filter(q => !personaQuestionsAnswered.includes(q.id))
    if (unanswered.length === 0) {
      return personaNeedQuestions[Math.floor(Math.random() * personaNeedQuestions.length)]
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

  // Trivia game functions (know me quiz)
  const getRandomTriviaQuestion = (): TriviaQuestion => {
    const unanswered = triviaQuestions.filter(q => !triviaQuestionsAnswered.includes(q.id))
    if (unanswered.length === 0) {
      return triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)]
    }
    return unanswered[Math.floor(Math.random() * unanswered.length)]
  }

  const startTriviaGame = () => {
    const question = getRandomTriviaQuestion()
    updateState({
      gameMode: "trivia",
      currentTriviaQuestion: question,
      selectedTriviaAnswer: null,
      showTriviaResult: false
    })
  }

  const handleTriviaAnswer = (index: number) => {
    if (showTriviaResult) return
    
    const isCorrect = currentTriviaQuestion && index === currentTriviaQuestion.correctAnswer
    if (isCorrect) {
      const newScore = totalScore + 1
      updateState({
        selectedTriviaAnswer: index,
        showTriviaResult: true,
        triviaStreak: triviaStreak + 1,
        totalScore: newScore,
        triviaQuestionsAnswered: [...triviaQuestionsAnswered, currentTriviaQuestion?.id || '']
      })
      onScoreChange?.(newScore)
    } else {
      updateState({
        selectedTriviaAnswer: index,
        showTriviaResult: true,
        triviaStreak: 0,
        triviaQuestionsAnswered: [...triviaQuestionsAnswered, currentTriviaQuestion?.id || '']
      })
    }
  }

  const nextTriviaQuestion = () => {
    const question = getRandomTriviaQuestion()
    updateState({
      currentTriviaQuestion: question,
      selectedTriviaAnswer: null,
      showTriviaResult: false
    })
  }

  // Two Truths game functions
  const getRandomTruthsRound = (): TwoTruthsRound => {
    const unplayed = twoTruthsRounds.filter(r => !truthsRoundsPlayed.includes(r.id))
    if (unplayed.length === 0) {
      return twoTruthsRounds[Math.floor(Math.random() * twoTruthsRounds.length)]
    }
    return unplayed[Math.floor(Math.random() * unplayed.length)]
  }

  const startTruthsGame = () => {
    const round = getRandomTruthsRound()
    updateState({
      gameMode: "truths",
      currentTruthsRound: round,
      selectedTruthsAnswer: null,
      showTruthsResult: false
    })
  }

  const handleTruthsAnswer = (index: number) => {
    if (showTruthsResult) return
    
    const isCorrect = currentTruthsRound && index === currentTruthsRound.lieIndex
    if (isCorrect) {
      const newScore = totalScore + 2 // 2 points for finding the lie
      updateState({
        selectedTruthsAnswer: index,
        showTruthsResult: true,
        truthsStreak: truthsStreak + 1,
        totalScore: newScore,
        truthsRoundsPlayed: [...truthsRoundsPlayed, currentTruthsRound?.id || '']
      })
      onScoreChange?.(newScore)
    } else {
      updateState({
        selectedTruthsAnswer: index,
        showTruthsResult: true,
        truthsStreak: 0,
        truthsRoundsPlayed: [...truthsRoundsPlayed, currentTruthsRound?.id || '']
      })
    }
  }

  const nextTruthsRound = () => {
    const round = getRandomTruthsRound()
    updateState({
      currentTruthsRound: round,
      selectedTruthsAnswer: null,
      showTruthsResult: false
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
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          {/* User Persona - UX focused with needs & pain points */}
          <button
            onClick={() => startPersonaGame()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-violet-950/80 to-indigo-900/50 rounded-2xl border border-violet-500/30 hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98]"
          >
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
                C
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-violet-300 font-bold text-sm md:text-lg">User Persona</p>
              <p className="text-violet-400/50 text-xs md:text-sm">Needs & Pain Points</p>
            </div>
          </button>

          {/* Know Me Quiz - Trivia about Charity */}
          <button
            onClick={() => startTriviaGame()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-pink-950/80 to-rose-900/50 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <style>{`
                @keyframes quizPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .quiz-icon { animation: quizPulse 2s infinite ease-in-out; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#831843"/>
              <g className="quiz-icon">
                <circle cx="50" cy="50" r="30" fill="#ec4899" />
                <text x="50" y="58" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">?</text>
              </g>
            </svg>
            <div className="text-center">
              <p className="text-pink-300 font-bold text-sm md:text-lg">Know Me Quiz</p>
              <p className="text-pink-400/50 text-xs md:text-sm">Music, Food & More</p>
            </div>
          </button>

          {/* Two Truths and a Lie */}
          <button
            onClick={() => startTruthsGame()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-emerald-950/80 to-teal-900/50 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <style>{`
                @keyframes truthsPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes lieGlow { 0%, 100% { filter: drop-shadow(0 0 3px #ef4444); } 50% { filter: drop-shadow(0 0 10px #ef4444); } }
                .truths-icon { animation: truthsPulse 2s infinite ease-in-out; }
                .lie-x { animation: lieGlow 1.5s infinite ease-in-out; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#064e3b"/>
              <g className="truths-icon">
                <circle cx="30" cy="35" r="12" fill="#10b981"/>
                <path d="M24 35 L28 39 L36 31" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="70" cy="35" r="12" fill="#10b981"/>
                <path d="M64 35 L68 39 L76 31" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="50" cy="70" r="12" fill="#ef4444" className="lie-x"/>
                <path d="M44 64 L56 76 M56 64 L44 76" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </g>
            </svg>
            <div className="text-center">
              <p className="text-emerald-300 font-bold text-sm md:text-lg">2 Truths 1 Lie</p>
              <p className="text-emerald-400/50 text-xs md:text-sm">Find the lie!</p>
            </div>
          </button>

          {/* Logic Grids - Charity's Favorite */}
          <button
            onClick={() => updateState({ gameMode: "logic" })}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-amber-950/80 to-orange-900/50 rounded-2xl border border-amber-500/30 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 rounded-full">
              <span className="text-[10px] font-bold text-amber-950">MY FAVE</span>
            </div>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <style>{`
                @keyframes gridPulse1 { 0%, 100% { filter: drop-shadow(0 0 2px #f59e0b); } 50% { filter: drop-shadow(0 0 10px #f59e0b); } }
                @keyframes gridPulse2 { 0%, 100% { filter: drop-shadow(0 0 2px #fbbf24); } 50% { filter: drop-shadow(0 0 10px #fbbf24); } }
                .grid-line1 { animation: gridPulse1 2s infinite ease-in-out; }
                .grid-line2 { animation: gridPulse2 2s infinite ease-in-out 0.5s; }
              `}</style>
              <rect width="100" height="100" rx="20" fill="#451a03"/>
              <g strokeWidth="4" fill="none" strokeLinecap="round">
                <path d="M20 30 H80" stroke="#f59e0b" className="grid-line1"/>
                <path d="M30 50 H70" stroke="#fbbf24" className="grid-line2"/>
                <path d="M40 70 H60" stroke="#fcd34d" className="grid-line1"/>
              </g>
            </svg>
            <div className="text-center">
              <p className="text-amber-300 font-bold text-sm md:text-lg">Logic Grids</p>
              <p className="text-amber-400/50 text-xs md:text-sm">Play my favorite!</p>
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
                  <p>Explore Charity as a UX user persona! Learn about her needs, pain points, goals, and behaviors.</p>
                </div>
                <div>
                  <p className="text-pink-300 font-semibold">Know Me Quiz</p>
                  <p>Test your knowledge about Charity! Questions about her favorite music, food, travel, and more.</p>
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold">Two Truths & a Lie</p>
                  <p>Find the lie! Two statements are true, one is false. Can you spot which one?</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold">Logic Grids (Charity&apos;s Favorite!)</p>
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

  // User Persona Game (Needs & Pain Points)
  if (gameMode === "persona" && currentPersonaQuestion) {
    const typeLabels: Record<string, { label: string; color: string }> = {
      need: { label: "User Need", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
      painpoint: { label: "Pain Point", color: "bg-red-500/20 text-red-300 border-red-500/30" },
      goal: { label: "Goal", color: "bg-green-500/20 text-green-300 border-green-500/30" },
      behavior: { label: "Behavior", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
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

        {/* UX Persona Card */}
        <div className="w-full bg-gradient-to-br from-violet-950/80 to-indigo-900/50 rounded-2xl border border-violet-500/30 overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.2)]">
          {/* Persona Header - Like a real UX Persona */}
          <div className="bg-gradient-to-r from-violet-600/30 to-purple-600/30 p-4 border-b border-violet-500/20">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-violet-300/30">
                C
              </div>
              <div className="flex-1">
                <h3 className="text-violet-100 font-bold text-xl">Charity Dupont</h3>
                <p className="text-violet-300 text-sm">UX/UI Designer at Google</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/30 text-violet-200">Former Teacher</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/30 text-violet-200">Columbia University</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/30 text-violet-200">AI/UX Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Story */}
          <div className="p-4 border-b border-violet-500/20 bg-violet-900/20">
            <p className="text-violet-300/80 text-xs leading-relaxed italic">
              &quot;{charityPersonaStory.slice(0, 150)}...&quot;
            </p>
          </div>

          {/* Question Section */}
          <div className="p-4 md:p-6">
            {/* Type Badge */}
            <div className="mb-4">
              <span className={`text-xs px-3 py-1 rounded-full border ${typeLabels[currentPersonaQuestion.type].color}`}>
                {typeLabels[currentPersonaQuestion.type].label}
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
        </div>

        {/* Progress */}
        <div className="text-center text-violet-400/60 text-sm">
          {personaQuestionsAnswered.length} of {personaNeedQuestions.length} questions answered
        </div>
      </div>
    )
  }

  // Know Me Quiz Game (Trivia)
  if (gameMode === "trivia" && currentTriviaQuestion) {
    const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
      music: { label: "Music", icon: "🎵", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
      food: { label: "Food & Drinks", icon: "🍽️", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
      travel: { label: "Travel", icon: "✈️", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
      background: { label: "Background", icon: "📚", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
      starbucks: { label: "Starbucks", icon: "☕", color: "bg-green-500/20 text-green-300 border-green-500/30" },
      fashion: { label: "Fashion & Style", icon: "👗", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
    }

    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-pink-400/60 text-sm">Streak: {triviaStreak}</span>
            <span className="text-pink-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="w-full bg-gradient-to-br from-pink-950/80 to-rose-900/50 rounded-2xl border border-pink-500/30 p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          {/* Category Badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{categoryLabels[currentTriviaQuestion.category].icon}</span>
            <span className={`text-xs px-3 py-1 rounded-full border ${categoryLabels[currentTriviaQuestion.category].color}`}>
              {categoryLabels[currentTriviaQuestion.category].label}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-pink-100 text-lg font-medium leading-relaxed">{currentTriviaQuestion.question}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentTriviaQuestion.options.map((option, idx) => {
              const isSelected = selectedTriviaAnswer === idx
              const isCorrect = idx === currentTriviaQuestion.correctAnswer
              const showResult = showTriviaResult

              return (
                <button
                  key={idx}
                  onClick={() => handleTriviaAnswer(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3
                    ${!showResult ? 'bg-pink-900/30 hover:bg-pink-800/40 border border-pink-500/20 hover:border-pink-400/40' : ''}
                    ${showResult && isCorrect ? 'bg-green-900/40 border border-green-500/50' : ''}
                    ${showResult && isSelected && !isCorrect ? 'bg-red-900/40 border border-red-500/50' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'bg-pink-900/20 border border-pink-500/10 opacity-50' : ''}
                  `}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${!showResult ? 'bg-pink-500/30 text-pink-300' : ''}
                    ${showResult && isCorrect ? 'bg-green-500 text-white' : ''}
                    ${showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                    ${showResult && !isSelected && !isCorrect ? 'bg-pink-500/20 text-pink-400' : ''}
                  `}>
                    {showResult && isCorrect ? <CheckCircle className="w-5 h-5" /> : 
                     showResult && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                     String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`flex-1 ${showResult && isCorrect ? 'text-green-300' : showResult && isSelected && !isCorrect ? 'text-red-300' : 'text-pink-200'}`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Result & Next */}
          {showTriviaResult && (
            <div className="mt-6 pt-6 border-t border-pink-500/20">
              <div className={`text-center mb-4 ${selectedTriviaAnswer === currentTriviaQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                <p className="text-xl font-bold">
                  {selectedTriviaAnswer === currentTriviaQuestion.correctAnswer ? 'You know me!' : 'Not quite!'}
                </p>
                {selectedTriviaAnswer !== currentTriviaQuestion.correctAnswer && (
                  <p className="text-sm mt-1 text-pink-300/70">
                    The answer was: {currentTriviaQuestion.options[currentTriviaQuestion.correctAnswer]}
                  </p>
                )}
              </div>
              <button
                onClick={nextTriviaQuestion}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Next Question <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="text-center text-pink-400/60 text-sm">
          {triviaQuestionsAnswered.length} of {triviaQuestions.length} questions answered
        </div>
      </div>
    )
  }

  // Two Truths and a Lie Game
  if (gameMode === "truths" && currentTruthsRound) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-emerald-400 text-sm hover:text-emerald-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400/60 text-sm">Streak: {truthsStreak}</span>
            <span className="text-emerald-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>
        </div>

        {/* Game Card */}
        <div className="w-full bg-gradient-to-br from-emerald-950/80 to-teal-900/50 rounded-2xl border border-emerald-500/30 p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-emerald-200 font-bold text-xl">Two Truths & a Lie</h3>
            <p className="text-emerald-400/60 text-sm mt-1">Which statement about Charity is FALSE?</p>
          </div>

          {/* Statements */}
          <div className="space-y-3">
            {currentTruthsRound.statements.map((statement, idx) => {
              const isSelected = selectedTruthsAnswer === idx
              const isLie = idx === currentTruthsRound.lieIndex
              const showResult = showTruthsResult

              return (
                <button
                  key={idx}
                  onClick={() => handleTruthsAnswer(idx)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-3
                    ${!showResult ? 'bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-500/20 hover:border-emerald-400/40' : ''}
                    ${showResult && isLie ? 'bg-red-900/40 border border-red-500/50' : ''}
                    ${showResult && isSelected && !isLie ? 'bg-amber-900/40 border border-amber-500/50' : ''}
                    ${showResult && !isSelected && !isLie ? 'bg-emerald-900/40 border border-emerald-500/50' : ''}
                  `}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${!showResult ? 'bg-emerald-500/30 text-emerald-300' : ''}
                    ${showResult && isLie ? 'bg-red-500 text-white' : ''}
                    ${showResult && isSelected && !isLie ? 'bg-amber-500 text-white' : ''}
                    ${showResult && !isSelected && !isLie ? 'bg-emerald-500 text-white' : ''}
                  `}>
                    {showResult && isLie ? <XCircle className="w-5 h-5" /> : 
                     showResult && !isLie ? <CheckCircle className="w-5 h-5" /> :
                     idx + 1}
                  </span>
                  <span className={`flex-1 leading-relaxed ${showResult && isLie ? 'text-red-300 line-through' : showResult && isSelected && !isLie ? 'text-amber-300' : showResult ? 'text-emerald-300' : 'text-emerald-200'}`}>
                    &ldquo;{statement}&rdquo;
                  </span>
                </button>
              )
            })}
          </div>

          {/* Result & Next */}
          {showTruthsResult && (
            <div className="mt-6 pt-6 border-t border-emerald-500/20">
              <div className={`text-center mb-4 ${selectedTruthsAnswer === currentTruthsRound.lieIndex ? 'text-green-400' : 'text-amber-400'}`}>
                <p className="text-xl font-bold">
                  {selectedTruthsAnswer === currentTruthsRound.lieIndex ? 'You found the lie!' : 'That was actually true!'}
                </p>
                <p className="text-sm mt-2 text-emerald-300/70">
                  The lie was: &ldquo;{currentTruthsRound.statements[currentTruthsRound.lieIndex]}&rdquo;
                </p>
              </div>
              <button
                onClick={nextTruthsRound}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Next Round <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="text-center text-emerald-400/60 text-sm">
          {truthsRoundsPlayed.length} of {twoTruthsRounds.length} rounds played
        </div>
      </div>
    )
  }

  return null
}
