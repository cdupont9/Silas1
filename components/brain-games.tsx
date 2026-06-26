"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, HelpCircle, RefreshCw, CheckCircle, XCircle, Trophy, Lock } from "lucide-react"

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

// ============ UNO QUIZ GAME ============
// Match the correct answer - each question has sensible wrong answers!
type UnoColor = "red" | "blue" | "green" | "yellow"

interface UnoCard {
  id: string
  color: UnoColor
  fact: string
  isCorrect: boolean
}

interface UnoRound {
  id: string
  prompt: string
  correctFact: string
  correctColor: UnoColor
  category: string
  distractors: string[] // Wrong answers that make sense for THIS question
}

const unoRounds: UnoRound[] = [
  // Music (Red cards)
  { id: "uno1", prompt: "Favorite childhood artist?", correctFact: "Hilary Duff", correctColor: "red", category: "Music", distractors: ["Britney Spears", "Christina Aguilera", "Jessica Simpson"] },
  { id: "uno2", prompt: "Album I still listen to while driving?", correctFact: "Metamorphosis", correctColor: "red", category: "Music", distractors: ["Dignity", "Most Wanted", "Breathe In Breathe Out"] },
  { id: "uno3", prompt: "Favorite Hilary Duff song?", correctFact: "So Yesterday", correctColor: "red", category: "Music", distractors: ["Come Clean", "Why Not", "Beat of My Heart"] },
  { id: "uno4", prompt: "Other favorite artist from childhood?", correctFact: "Mandy Moore", correctColor: "red", category: "Music", distractors: ["Ashlee Simpson", "Lindsay Lohan", "JoJo"] },
  { id: "uno5", prompt: "Favorite song from A Walk to Remember?", correctFact: "Only Hope", correctColor: "red", category: "Music", distractors: ["Cry", "Someday We'll Know", "It's Gonna Be Love"] },
  // Food (Yellow cards)
  { id: "uno6", prompt: "Favorite juice?", correctFact: "Apple Juice", correctColor: "yellow", category: "Food", distractors: ["Orange Juice", "Grape Juice", "Cranberry Juice"] },
  { id: "uno7", prompt: "Drink combo I love?", correctFact: "Lemonade + Ginger Ale", correctColor: "yellow", category: "Food", distractors: ["Sprite + Lemonade", "Coke + Lemonade", "Iced Tea + Lemonade"] },
  { id: "uno8", prompt: "Favorite fried chicken spot?", correctFact: "Broadway Chicken", correctColor: "yellow", category: "Food", distractors: ["Popeyes", "Chick-fil-A", "KFC"] },
  { id: "uno9", prompt: "How do I like my chicken?", correctFact: "Hot Honey + Buttermilk", correctColor: "yellow", category: "Food", distractors: ["Nashville Hot", "Original Recipe", "BBQ Glazed"] },
  { id: "uno10", prompt: "Favorite Starbucks drink?", correctFact: "Caramel Ribbon Crunch", correctColor: "yellow", category: "Food", distractors: ["Mocha Frappuccino", "Chai Latte", "Pink Drink"] },
  // Travel/Background (Blue cards)
  { id: "uno11", prompt: "Where did I move from?", correctFact: "Chicago", correctColor: "blue", category: "Background", distractors: ["Los Angeles", "Miami", "Houston"] },
  { id: "uno12", prompt: "Until what grade was I homeschooled?", correctFact: "4th Grade", correctColor: "blue", category: "Background", distractors: ["6th Grade", "2nd Grade", "8th Grade"] },
  { id: "uno13", prompt: "Who homeschooled me?", correctFact: "Grandmother", correctColor: "blue", category: "Background", distractors: ["Mother", "Private Tutor", "Aunt"] },
  { id: "uno14", prompt: "Bucket list destination?", correctFact: "Greece", correctColor: "blue", category: "Background", distractors: ["Japan", "Australia", "Iceland"] },
  { id: "uno15", prompt: "Country I've visited?", correctFact: "South Africa", correctColor: "blue", category: "Background", distractors: ["Australia", "Brazil", "Thailand"] },
  // Movies/Disney (Green cards)
  { id: "uno16", prompt: "Favorite Disney character?", correctFact: "Cinderella", correctColor: "green", category: "Movies", distractors: ["Belle", "Ariel", "Mulan"] },
  { id: "uno17", prompt: "Favorite Cinderella movie version?", correctFact: "Brandy + Whitney", correctColor: "green", category: "Movies", distractors: ["Animated 1950", "Lily James Live Action", "Drew Barrymore Ever After"] },
  { id: "uno18", prompt: "Movie that makes me cry?", correctFact: "A Walk to Remember", correctColor: "green", category: "Movies", distractors: ["The Notebook", "Titanic", "P.S. I Love You"] },
  { id: "uno19", prompt: "TV show I was obsessed with?", correctFact: "Lizzie McGuire", correctColor: "green", category: "Movies", distractors: ["Hannah Montana", "That's So Raven", "The Suite Life"] },
  { id: "uno20", prompt: "What format do I still own Cinderella on?", correctFact: "VHS", correctColor: "green", category: "Movies", distractors: ["DVD", "Blu-ray", "Digital Download"] },
]

const unoColorStyles: Record<UnoColor, { bg: string; border: string; text: string }> = {
  red: { bg: "bg-red-600", border: "border-red-400", text: "text-red-100" },
  blue: { bg: "bg-blue-600", border: "border-blue-400", text: "text-blue-100" },
  green: { bg: "bg-green-600", border: "border-green-400", text: "text-green-100" },
  yellow: { bg: "bg-yellow-500", border: "border-yellow-300", text: "text-yellow-900" },
}

// ============ TIC-TAC-TOE QUIZ GAME ============
// Answer questions correctly to place your X!
// These questions are DIFFERENT from UNO - focus on work, personality, and less common facts
interface TicTacToeQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: string
}

const ticTacToeQuestions: TicTacToeQuestion[] = [
  // Work & Career (not in UNO)
  { id: "ttt1", question: "What was my previous career before UX?", options: ["4th Grade Teacher", "Nurse", "Accountant", "Marketing Manager"], correctIndex: 0, category: "Career" },
  { id: "ttt2", question: "Where do I currently work?", options: ["Google", "Apple", "Microsoft", "Meta"], correctIndex: 0, category: "Career" },
  { id: "ttt3", question: "What type of design do I focus on?", options: ["AI-driven experiences", "Print design", "Game design", "Industrial design"], correctIndex: 0, category: "Career" },
  { id: "ttt4", question: "Where did I study design?", options: ["Columbia University", "NYU", "Parsons", "Pratt"], correctIndex: 0, category: "Education" },
  // Personality traits (not in UNO)
  { id: "ttt5", question: "Which trait best describes me?", options: ["Empathetic", "Impatient", "Stubborn", "Reserved"], correctIndex: 0, category: "Personality" },
  { id: "ttt6", question: "What do I value in work?", options: ["Work-life balance", "Long hours", "Competition", "Working alone"], correctIndex: 0, category: "Values" },
  { id: "ttt7", question: "Am I spontaneous or predictable?", options: ["Spontaneous", "Very predictable", "Indecisive", "Rigid"], correctIndex: 0, category: "Personality" },
  { id: "ttt8", question: "What frustrates me at work?", options: ["Scope creep", "Collaboration", "Creativity", "Learning new tools"], correctIndex: 0, category: "Work" },
  // Hobbies & Activities (not in UNO)
  { id: "ttt9", question: "Where do I like to sit on roller coasters?", options: ["Front row", "Back row", "Middle", "I don't ride them"], correctIndex: 0, category: "Hobbies" },
  { id: "ttt10", question: "What activity did I enjoy as a child?", options: ["Horseback riding", "Soccer", "Swimming", "Tennis"], correctIndex: 0, category: "Hobbies" },
  { id: "ttt11", question: "What type of books do I enjoy?", options: ["Romance novels", "Horror", "Textbooks", "Sci-fi"], correctIndex: 0, category: "Hobbies" },
  { id: "ttt12", question: "What do I appreciate?", options: ["Peace and quiet", "Loud parties", "Crowded spaces", "Constant noise"], correctIndex: 0, category: "Personality" },
  // Childhood business & unique facts (not in UNO)
  { id: "ttt13", question: "What business did I run as a kid?", options: ["Breakfast business", "Lemonade stand", "Dog walking", "Lawn mowing"], correctIndex: 0, category: "Childhood" },
  { id: "ttt14", question: "How did we drive from Chicago to NJ?", options: ["Straight through, no stops", "5 hotel stops", "By plane", "By train"], correctIndex: 0, category: "Background" },
  { id: "ttt15", question: "What fashion eras do I love?", options: ["80s and 90s", "60s and 70s", "2010s", "Modern only"], correctIndex: 0, category: "Fashion" },
]

// ============ TWO TRUTHS AND A LIE SECTION ============
// Each round has 2 truths and 1 believable lie - lies should sound plausible!
interface TwoTruthsRound {
  id: string
  statements: string[]
  lieIndex: number
  category: string
}

// 20 rounds, each covering a distinct fact so no two rounds quiz the same thing.
// lieIndex is varied here, and statements are reshuffled again at runtime.
const twoTruthsRounds: TwoTruthsRound[] = [
  // Childhood & homeschool
  { id: "tt1", category: "childhood", statements: ["I was homeschooled until 4th grade", "My grandmother homeschooled me and my cousin", "I was homeschooled until 6th grade"], lieIndex: 2 },
  { id: "tt2", category: "childhood", statements: ["I sold cookies door-to-door for two years", "I had a breakfast business as a kid", "My grandmother encouraged my entrepreneurship"], lieIndex: 0 },
  { id: "tt3", category: "childhood", statements: ["I trained in ballet for 8 years", "I wanted to be a ballet dancer", "I also dreamed of being a cook"], lieIndex: 0 },

  // Moving from Chicago
  { id: "tt4", category: "moving", statements: ["I moved from Chicago to New Jersey", "We took a week-long road trip with many stops", "My mom and I drove straight through with no hotel stops"], lieIndex: 1 },

  // Disney / Cinderella
  { id: "tt5", category: "disney", statements: ["Belle from Beauty and the Beast is my favorite", "Cinderella is my favorite Disney character", "I love the Brandy & Whitney Houston version"], lieIndex: 0 },
  { id: "tt6", category: "disney", statements: ["I still own Cinderella on VHS", "I have the Cinderella soundtrack on vinyl", "I danced with a broom to 'In My Own Little Corner'"], lieIndex: 1 },

  // Music
  { id: "tt7", category: "music", statements: ["Hilary Duff is my favorite childhood artist", "Britney Spears was my absolute favorite", "I was obsessed with Lizzie McGuire"], lieIndex: 1 },
  { id: "tt8", category: "music", statements: ["I prefer Hilary Duff's acting over her music", "I still listen to Metamorphosis while driving", "'So Yesterday' is one of my favorite songs"], lieIndex: 0 },
  { id: "tt9", category: "music", statements: ["I love Mandy Moore's song 'Only Hope'", "A Walk to Remember makes me cry", "I think The Notebook is a better movie"], lieIndex: 2 },

  // Food & drinks
  { id: "tt10", category: "drinks", statements: ["I love lemonade mixed with ginger ale", "I prefer apple juice over orange juice", "I prefer cranberry juice over apple juice"], lieIndex: 2 },
  { id: "tt11", category: "food", statements: ["Broadway Chicken is my favorite fried chicken", "I prefer grilled chicken over fried", "I love hot honey buttermilk chicken"], lieIndex: 1 },
  { id: "tt12", category: "food", statements: ["I always get General Tso's chicken", "My Chinese order is sweet and sour shrimp", "I love Chinese takeout"], lieIndex: 0 },

  // Starbucks
  { id: "tt13", category: "starbucks", statements: ["I prefer hot lattes over frappuccinos", "Caramel Ribbon Crunch is my go-to", "I order it with extra caramel and crunch"], lieIndex: 0 },
  { id: "tt14", category: "starbucks", statements: ["I discovered Starbucks as a little girl", "I started drinking Starbucks in college", "My mom worked near Grand Central"], lieIndex: 1 },

  // Travel
  { id: "tt15", category: "travel", statements: ["I've backpacked through Asia", "I've been to Spain, Paris, and Italy", "I've visited South Africa"], lieIndex: 0 },
  { id: "tt16", category: "travel", statements: ["Greece is on my bucket list", "I've already been to Greece twice", "I dream of traveling more"], lieIndex: 1 },

  // Hobbies & personality
  { id: "tt17", category: "hobbies", statements: ["I love the front row of roller coasters", "I enjoyed horseback riding as a kid", "I go horseback riding every month"], lieIndex: 2 },
  { id: "tt18", category: "hobbies", statements: ["I value peace and quiet", "I prefer action movies over romance", "I love reading romance novels"], lieIndex: 1 },

  // Fashion
  { id: "tt19", category: "fashion", statements: ["I only wear modern minimalist styles", "I love 80s and 90s fashion", "I grew up in the late 90s/early 2000s"], lieIndex: 0 },

  // Career & goals
  { id: "tt20", category: "goals", statements: ["I want to speak at design conferences", "Work-life balance matters to me", "I've already given multiple keynotes"], lieIndex: 2 },
]

// ============ MAIN COMPONENT ============
type GameMode = "menu" | "mind" | "logic" | "persona" | "truths" | "trivia" | "uno" | "tictactoe"
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
  // UNO quiz game state
  currentUnoRound: UnoRound | null
  unoHand: UnoCard[]
  unoSelectedCard: UnoCard | null
  showUnoResult: boolean
  unoScore: number
  unoRoundsPlayed: string[]
  // Tic-Tac-Toe game state
  ticTacToeBoard: (string | null)[]
  ticTacToeCurrentQuestion: TicTacToeQuestion | null
  ticTacToeSelectedCell: number | null
  ticTacToePlayerTurn: boolean
  ticTacToeGameOver: boolean
  ticTacToeWinner: string | null
  ticTacToeQuestionsUsed: string[]
  ticTacToeOpponent: "human" | "charity" | null
  ticTacToeAwaitingPlacement: boolean
  ticTacToeAnswerFeedback: { correct: boolean; correctAnswer: string } | null
  ticTacToeHumanTurn: "X" | "O"
  // Two Truths game state
  currentTruthsRound: TwoTruthsRound | null
  selectedTruthsAnswer: number | null
  showTruthsResult: boolean
  truthsStreak: number
  truthsRoundsPlayed: string[]
  truthsCorrect: number
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
  // UNO quiz game state
  currentUnoRound: null,
  unoHand: [],
  unoSelectedCard: null,
  showUnoResult: false,
  unoScore: 0,
  unoRoundsPlayed: [],
  // Tic-Tac-Toe game state
  ticTacToeBoard: Array(9).fill(null),
  ticTacToeCurrentQuestion: null,
  ticTacToeSelectedCell: null,
  ticTacToePlayerTurn: true,
  ticTacToeGameOver: false,
  ticTacToeWinner: null,
  ticTacToeQuestionsUsed: [],
  ticTacToeOpponent: null,
  ticTacToeAwaitingPlacement: false,
  ticTacToeAnswerFeedback: null,
  ticTacToeHumanTurn: "X",
  // Two Truths game state
  currentTruthsRound: null,
  selectedTruthsAnswer: null,
  showTruthsResult: false,
  truthsStreak: 0,
  truthsRoundsPlayed: [],
  truthsCorrect: 0
}

interface BrainGamesProps {
  onScoreChange?: (score: number) => void
  gameState?: BrainGamesState
  onGameStateChange?: (state: BrainGamesState) => void
}

  // Number of correct answers (out of 20 rounds) required to unlock the reward.
const TRUTHS_WIN_THRESHOLD = 16

export function BrainGames({ onScoreChange, gameState, onGameStateChange }: BrainGamesProps) {
  const [localState, setLocalState] = useState<BrainGamesState>(gameState || initialBrainGamesState)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showTruthsGoal, setShowTruthsGoal] = useState(false)
  
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
  const currentUnoRound = localState.currentUnoRound || null
  const unoHand = localState.unoHand || []
  const unoSelectedCard = localState.unoSelectedCard || null
  const showUnoResult = localState.showUnoResult || false
  const unoScore = localState.unoScore || 0
  const unoRoundsPlayed = localState.unoRoundsPlayed || []
  const ticTacToeBoard = localState.ticTacToeBoard || Array(9).fill(null)
  const ticTacToeCurrentQuestion = localState.ticTacToeCurrentQuestion || null
  const ticTacToeSelectedCell = localState.ticTacToeSelectedCell
  const ticTacToePlayerTurn = localState.ticTacToePlayerTurn !== false
  const ticTacToeGameOver = localState.ticTacToeGameOver || false
  const ticTacToeWinner = localState.ticTacToeWinner || null
  const ticTacToeQuestionsUsed = localState.ticTacToeQuestionsUsed || []
  const ticTacToeOpponent = localState.ticTacToeOpponent || null
  const ticTacToeAwaitingPlacement = localState.ticTacToeAwaitingPlacement || false
  const ticTacToeAnswerFeedback = localState.ticTacToeAnswerFeedback || null
  const ticTacToeHumanTurn = localState.ticTacToeHumanTurn || "X"
  const truthsRoundsPlayed = localState.truthsRoundsPlayed || []
  const truthsCorrect = localState.truthsCorrect || 0
  
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

  // Persona game functions (CARD SORTING)
  const getRandomPersonaCard = (): PersonaCard => {
    const unanswered = personaCards.filter(c => !personaCardsAnswered.includes(c.id))
    if (unanswered.length === 0) {
      return personaCards[Math.floor(Math.random() * personaCards.length)]
    }
    return unanswered[Math.floor(Math.random() * unanswered.length)]
  }

  const startPersonaGame = () => {
    const card = getRandomPersonaCard()
    updateState({
      gameMode: "persona",
      currentPersonaCard: card,
      selectedCategory: null,
      showPersonaResult: false
    })
  }

  const handlePersonaCategorySelect = (category: "need" | "painpoint" | "goal" | "behavior") => {
    if (showPersonaResult) return
    
    const isCorrect = currentPersonaCard && category === currentPersonaCard.correctCategory
    if (isCorrect) {
      const newScore = totalScore + 1
      updateState({
        selectedCategory: category,
        showPersonaResult: true,
        personaStreak: personaStreak + 1,
        totalScore: newScore,
        personaCardsAnswered: [...personaCardsAnswered, currentPersonaCard?.id || '']
      })
      onScoreChange?.(newScore)
    } else {
      updateState({
        selectedCategory: category,
        showPersonaResult: true,
        personaStreak: 0,
        personaCardsAnswered: [...personaCardsAnswered, currentPersonaCard?.id || '']
      })
    }
  }

  const nextPersonaCard = () => {
    const card = getRandomPersonaCard()
    updateState({
      currentPersonaCard: card,
      selectedCategory: null,
      showPersonaResult: false
    })
  }

  // UNO Quiz Game Functions
  const generateUnoHand = (round: UnoRound): UnoCard[] => {
    const colors: UnoColor[] = ["red", "blue", "green", "yellow"]
    const hand: UnoCard[] = []
    
    // Add the correct card
    hand.push({
      id: `correct-${round.id}`,
      color: round.correctColor,
      fact: round.correctFact,
      isCorrect: true
    })
    
    // Add 3 distractor cards using the question-specific distractors
    const otherColors = colors.filter(c => c !== round.correctColor)
    round.distractors.forEach((distractor, index) => {
      hand.push({
        id: `distractor-${index}-${round.id}`,
        color: otherColors[index % otherColors.length],
        fact: distractor,
        isCorrect: false
      })
    })
    
    // Shuffle the hand
    return hand.sort(() => Math.random() - 0.5)
  }

  const getRandomUnoRound = (): UnoRound => {
    const unplayed = unoRounds.filter(r => !unoRoundsPlayed.includes(r.id))
    if (unplayed.length === 0) {
      return unoRounds[Math.floor(Math.random() * unoRounds.length)]
    }
    return unplayed[Math.floor(Math.random() * unplayed.length)]
  }

  const startUnoGame = () => {
    const round = getRandomUnoRound()
    const hand = generateUnoHand(round)
    updateState({
      gameMode: "uno",
      currentUnoRound: round,
      unoHand: hand,
      unoSelectedCard: null,
      showUnoResult: false
    })
  }

  const handleUnoCardSelect = (card: UnoCard) => {
    if (showUnoResult) return
    
    if (card.isCorrect) {
      const newScore = totalScore + 2
      updateState({
        unoSelectedCard: card,
        showUnoResult: true,
        unoScore: unoScore + 1,
        totalScore: newScore,
        unoRoundsPlayed: [...unoRoundsPlayed, currentUnoRound?.id || '']
      })
      onScoreChange?.(newScore)
    } else {
      updateState({
        unoSelectedCard: card,
        showUnoResult: true,
        unoRoundsPlayed: [...unoRoundsPlayed, currentUnoRound?.id || '']
      })
    }
  }

  const nextUnoRound = () => {
    const round = getRandomUnoRound()
    const hand = generateUnoHand(round)
    updateState({
      currentUnoRound: round,
      unoHand: hand,
      unoSelectedCard: null,
      showUnoResult: false
    })
  }

  // Tic-Tac-Toe Game Functions
  const getRandomTicTacToeQuestion = (): TicTacToeQuestion => {
    const unused = ticTacToeQuestions.filter(q => !ticTacToeQuestionsUsed.includes(q.id))
    if (unused.length === 0) {
      return ticTacToeQuestions[Math.floor(Math.random() * ticTacToeQuestions.length)]
    }
    return unused[Math.floor(Math.random() * unused.length)]
  }

  const shuffleOptions = (question: TicTacToeQuestion): TicTacToeQuestion => {
    const correctAnswer = question.options[question.correctIndex]
    const shuffled = [...question.options].sort(() => Math.random() - 0.5)
    return {
      ...question,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctAnswer)
    }
  }

  const checkWinner = (board: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6] // diagonals
    ]
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  // Open the Tic-Tac-Toe opponent selection screen
  const openTicTacToe = () => {
    updateState({
      gameMode: "tictactoe",
      ticTacToeOpponent: null,
      ticTacToeBoard: Array(9).fill(null),
      ticTacToeCurrentQuestion: null,
      ticTacToeGameOver: false,
      ticTacToeWinner: null,
      ticTacToeAwaitingPlacement: false,
      ticTacToeAnswerFeedback: null,
      ticTacToeHumanTurn: "X",
      ticTacToeQuestionsUsed: []
    })
  }

  const startTicTacToeGame = (opponent: "human" | "charity" = ticTacToeOpponent || "charity") => {
    const firstQuestion = opponent === "charity"
      ? shuffleOptions(ticTacToeQuestions[Math.floor(Math.random() * ticTacToeQuestions.length)])
      : null
    updateState({
      gameMode: "tictactoe",
      ticTacToeOpponent: opponent,
      ticTacToeBoard: Array(9).fill(null),
      ticTacToeCurrentQuestion: firstQuestion,
      ticTacToeSelectedCell: null,
      ticTacToeGameOver: false,
      ticTacToeWinner: null,
      ticTacToeQuestionsUsed: firstQuestion ? [firstQuestion.id] : [],
      ticTacToeAwaitingPlacement: false,
      ticTacToeAnswerFeedback: null,
      ticTacToeHumanTurn: "X"
    })
  }

  // Charity mode: answer a trivia question to earn the right to place an X anywhere
  const handleTicTacToeAnswer = (answerIndex: number) => {
    if (!ticTacToeCurrentQuestion) return
    const correctAnswer = ticTacToeCurrentQuestion.options[ticTacToeCurrentQuestion.correctIndex]
    const isCorrect = answerIndex === ticTacToeCurrentQuestion.correctIndex

    if (isCorrect) {
      updateState({
        ticTacToeAwaitingPlacement: true,
        ticTacToeCurrentQuestion: null,
        ticTacToeAnswerFeedback: { correct: true, correctAnswer }
      })
    } else {
      updateState({
        ticTacToeCurrentQuestion: null,
        ticTacToeAnswerFeedback: { correct: false, correctAnswer }
      })
    }
  }

  // Charity mode: after a wrong answer, Charity (computer) takes a turn, then a new question appears
  const continueAfterWrong = () => {
    const newBoard = [...ticTacToeBoard]
    const emptyCells = newBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1)
    if (emptyCells.length > 0) {
      const move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      newBoard[move] = "O"
    }
    const winner = checkWinner(newBoard)
    const isFull = newBoard.every(cell => cell !== null)
    if (winner || isFull) {
      updateState({
        ticTacToeBoard: newBoard,
        ticTacToeGameOver: true,
        ticTacToeWinner: winner,
        ticTacToeAnswerFeedback: null,
        ticTacToeCurrentQuestion: null
      })
    } else {
      const nextQ = shuffleOptions(getRandomTicTacToeQuestion())
      updateState({
        ticTacToeBoard: newBoard,
        ticTacToeAnswerFeedback: null,
        ticTacToeCurrentQuestion: nextQ,
        ticTacToeQuestionsUsed: [...ticTacToeQuestionsUsed, nextQ.id]
      })
    }
  }

  // Charity mode: place X anywhere after answering correctly
  const handleCharityPlaceX = (index: number) => {
    if (!ticTacToeAwaitingPlacement || ticTacToeBoard[index] || ticTacToeGameOver) return
    const newBoard = [...ticTacToeBoard]
    newBoard[index] = "X"
    const winner = checkWinner(newBoard)
    const isFull = newBoard.every(cell => cell !== null)
    if (winner || isFull) {
      const newScore = winner === "X" ? totalScore + 5 : totalScore
      updateState({
        ticTacToeBoard: newBoard,
        ticTacToeAwaitingPlacement: false,
        ticTacToeAnswerFeedback: null,
        ticTacToeGameOver: true,
        ticTacToeWinner: winner,
        totalScore: newScore
      })
      if (winner === "X") onScoreChange?.(newScore)
      return
    }
    // Charity's turn
    const emptyCells = newBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1)
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    newBoard[move] = "O"
    const winner2 = checkWinner(newBoard)
    const isFull2 = newBoard.every(cell => cell !== null)
    if (winner2 || isFull2) {
      updateState({
        ticTacToeBoard: newBoard,
        ticTacToeAwaitingPlacement: false,
        ticTacToeAnswerFeedback: null,
        ticTacToeGameOver: true,
        ticTacToeWinner: winner2
      })
    } else {
      const nextQ = shuffleOptions(getRandomTicTacToeQuestion())
      updateState({
        ticTacToeBoard: newBoard,
        ticTacToeAwaitingPlacement: false,
        ticTacToeAnswerFeedback: null,
        ticTacToeCurrentQuestion: nextQ,
        ticTacToeQuestionsUsed: [...ticTacToeQuestionsUsed, nextQ.id]
      })
    }
  }

  // Human vs Human mode: simple turn-based placement
  const handleHumanPlaceX = (index: number) => {
    if (ticTacToeBoard[index] || ticTacToeGameOver) return
    const newBoard = [...ticTacToeBoard]
    newBoard[index] = ticTacToeHumanTurn
    const winner = checkWinner(newBoard)
    const isFull = newBoard.every(cell => cell !== null)
    updateState({
      ticTacToeBoard: newBoard,
      ticTacToeGameOver: winner !== null || isFull,
      ticTacToeWinner: winner,
      ticTacToeHumanTurn: ticTacToeHumanTurn === "X" ? "O" : "X"
    })
  }

  const handleTicTacToeCellClick = (index: number) => {
    if (ticTacToeOpponent === "human") {
      handleHumanPlaceX(index)
    } else if (ticTacToeOpponent === "charity") {
      handleCharityPlaceX(index)
    }
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
    // Shuffle the statements so the lie isn't always in the same position
    const lieStatement = round.statements[round.lieIndex]
    const shuffledStatements = [...round.statements]
    for (let i = shuffledStatements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledStatements[i], shuffledStatements[j]] = [shuffledStatements[j], shuffledStatements[i]]
    }
    const newLieIndex = shuffledStatements.indexOf(lieStatement)
    const shuffledRound = { ...round, statements: shuffledStatements, lieIndex: newLieIndex }
    updateState({
      gameMode: "truths",
      currentTruthsRound: shuffledRound,
      selectedTruthsAnswer: null,
      showTruthsResult: false,
      truthsRoundsPlayed: [],
      truthsCorrect: 0,
      truthsStreak: 0
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
        truthsCorrect: truthsCorrect + 1,
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
    // Shuffle the statements so the lie isn't always in the same position
    const lieStatement = round.statements[round.lieIndex]
    const shuffledStatements = [...round.statements]
    for (let i = shuffledStatements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledStatements[i], shuffledStatements[j]] = [shuffledStatements[j], shuffledStatements[i]]
    }
    const newLieIndex = shuffledStatements.indexOf(lieStatement)
    const shuffledRound = { ...round, statements: shuffledStatements, lieIndex: newLieIndex }
    updateState({
      currentTruthsRound: shuffledRound,
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

          {/* Tic-Tac-Toe Quiz */}
          <button
            onClick={() => openTicTacToe()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-amber-950/80 to-orange-900/50 rounded-2xl border border-amber-500/30 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] relative overflow-hidden"
          >
            {/* Tic-Tac-Toe grid icon */}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <rect width="100" height="100" rx="20" fill="#451a03"/>
              {/* Grid lines */}
              <line x1="38" y1="20" x2="38" y2="80" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
              <line x1="62" y1="20" x2="62" y2="80" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
              <line x1="20" y1="38" x2="80" y2="38" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
              <line x1="20" y1="62" x2="80" y2="62" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
              {/* X */}
              <path d="M24 24 L34 34 M34 24 L24 34" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
              {/* O */}
              <circle cx="74" cy="29" r="7" stroke="#fcd34d" strokeWidth="3" fill="none"/>
              {/* X */}
              <path d="M66 66 L82 82 M82 66 L66 82" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="text-center">
              <p className="text-amber-300 font-bold text-sm md:text-lg">Tic-Tac-Toe</p>
              <p className="text-amber-400/50 text-xs md:text-sm">Answer to place X!</p>
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
                  <p className="text-amber-300 font-semibold">Tic-Tac-Toe</p>
                  <p>Answer trivia questions to place your X on the board. Beat the computer to win!</p>
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold">Two Truths & a Lie</p>
                  <p>Find the lie! Two statements are true, one is false. Can you spot which one?</p>
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

  // User Persona Game (CARD SORTING - Sort statements into categories)
  if (gameMode === "persona" && currentPersonaCard) {
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

        {/* Persona Header */}
        <div className="w-full bg-gradient-to-r from-violet-600/30 to-purple-600/30 rounded-xl p-3 border border-violet-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              C
            </div>
            <div>
              <h3 className="text-violet-100 font-bold">Charity Dupont</h3>
              <p className="text-violet-300/60 text-xs">UX/UI Designer</p>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-violet-300/80 text-sm text-center">
          Sort this statement into the correct UX persona category
        </p>

        {/* The Card to Sort */}
        <div className={`w-full p-6 rounded-2xl border-2 transition-all shadow-lg ${
          showPersonaResult 
            ? selectedCategory === currentPersonaCard.correctCategory
              ? 'bg-green-950/50 border-green-500'
              : 'bg-red-950/50 border-red-500'
            : 'bg-gradient-to-br from-violet-900/80 to-indigo-900/60 border-violet-400/50'
        }`}>
          <p className="text-violet-100 text-lg md:text-xl font-medium text-center leading-relaxed">
            &quot;{currentPersonaCard.statement}&quot;
          </p>
        </div>

        {/* Category Buckets */}
        {!showPersonaResult ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            {(["need", "painpoint", "goal", "behavior"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handlePersonaCategorySelect(cat)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${categoryInfo[cat].bgColor} ${categoryInfo[cat].borderColor} hover:shadow-lg`}
              >
                <div className={`text-sm font-bold bg-gradient-to-r ${categoryInfo[cat].color} bg-clip-text text-transparent`}>
                  {categoryInfo[cat].label}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className={`text-center ${selectedCategory === currentPersonaCard.correctCategory ? 'text-green-400' : 'text-red-400'}`}>
              <p className="text-xl font-bold">
                {selectedCategory === currentPersonaCard.correctCategory ? 'Correct!' : 'Not quite!'}
              </p>
              {selectedCategory !== currentPersonaCard.correctCategory && (
                <p className="text-sm mt-1 text-violet-300/70">
                  This is a <span className="font-semibold">{categoryInfo[currentPersonaCard.correctCategory].label.slice(0, -1)}</span>
                </p>
              )}
            </div>
            <button
              onClick={nextPersonaCard}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Next Card <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="text-center text-violet-400/60 text-sm">
          {personaCardsAnswered.length} of {personaCards.length} cards sorted
        </div>
      </div>
    )
  }

  // UNO Quiz Game
  if (gameMode === "uno" && currentUnoRound) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-red-400/60 text-sm">Cards Won: {unoScore}</span>
            <span className="text-red-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-medium">
          {currentUnoRound.category}
        </div>

        {/* Question Prompt */}
        <div className="w-full p-4 bg-gradient-to-r from-red-950/60 to-orange-950/40 rounded-xl border border-red-500/30 text-center">
          <p className="text-red-200 text-lg md:text-xl font-medium">{currentUnoRound.prompt}</p>
        </div>

        {/* UNO Cards Hand */}
        <div className="w-full">
          <p className="text-red-300/60 text-sm text-center mb-3">Pick a card:</p>
          <div className="grid grid-cols-2 gap-3">
            {unoHand.map((card) => {
              const styles = unoColorStyles[card.color]
              const isSelected = unoSelectedCard?.id === card.id
              const isCorrect = card.isCorrect
              const showResult = showUnoResult
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleUnoCardSelect(card)}
                  disabled={showUnoResult}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                        : isSelected
                          ? 'bg-red-800 border-red-500 opacity-60'
                          : `${styles.bg} ${styles.border} opacity-40`
                      : `${styles.bg} ${styles.border} hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]`
                  }`}
                >
                  {/* UNO card design */}
                  <div className="absolute top-1 left-2 text-white/60 text-xs font-bold uppercase">{card.color}</div>
                  <div className="absolute top-1 right-2 w-4 h-4 rounded-full bg-white/20" />
                  <p className={`text-center font-semibold text-sm md:text-base mt-3 ${showResult && isCorrect ? 'text-white' : styles.text}`}>
                    {card.fact}
                  </p>
                  {showResult && isCorrect && (
                    <div className="mt-2 flex justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <div className="mt-2 flex justify-center">
                      <XCircle className="w-6 h-6 text-red-300" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Result & Next */}
        {showUnoResult && (
          <div className="w-full space-y-4 mt-2">
            <div className={`text-center ${unoSelectedCard?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              <p className="text-xl font-bold">
                {unoSelectedCard?.isCorrect ? 'UNO! Correct!' : 'Wrong card!'}
              </p>
            </div>
            <button
              onClick={nextUnoRound}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Next Round <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="text-center text-red-400/60 text-sm">
          {unoRoundsPlayed.length} of {unoRounds.length} rounds played
        </div>
      </div>
    )
  }

  // Tic-Tac-Toe Quiz Game
  if (gameMode === "tictactoe") {
    // Opponent selection screen
    if (!ticTacToeOpponent) {
      return (
        <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
          <div className="w-full flex items-center justify-between">
            <button onClick={backToMenu} className="flex items-center gap-1 text-amber-400 text-sm hover:text-amber-300">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <span className="text-amber-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>

          <h2 className="text-amber-100 text-xl font-bold text-center mt-2">Tic-Tac-Toe</h2>
          <p className="text-amber-200/70 text-center text-sm mb-2">Who would you like to play against?</p>

          <button
            onClick={() => startTicTacToeGame("charity")}
            className="w-full p-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] shadow-lg"
          >
            Play vs. Charity
            <span className="block text-amber-100/80 text-xs font-normal mt-1">Answer trivia about Charity to earn each move</span>
          </button>

          <button
            onClick={() => startTicTacToeGame("human")}
            className="w-full p-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] shadow-lg"
          >
            Play vs. a Friend
            <span className="block text-slate-300/80 text-xs font-normal mt-1">Classic two-player tic-tac-toe</span>
          </button>

          <a
            href="https://www.charitydupont.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-amber-300 text-sm underline underline-offset-4 hover:text-amber-200"
          >
            Learn more about Charity
          </a>
        </div>
      )
    }

    const isCharityMode = ticTacToeOpponent === "charity"
    const boardDisabled = ticTacToeGameOver ||
      (isCharityMode && (!ticTacToeAwaitingPlacement || ticTacToeCurrentQuestion !== null || ticTacToeAnswerFeedback !== null))

    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={openTicTacToe} className="flex items-center gap-1 text-amber-400 text-sm hover:text-amber-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <span className="text-amber-400 text-sm font-semibold">Score: {totalScore}</span>
        </div>

        {/* Instructions */}
        <p className="text-amber-200 text-center text-sm">
          {isCharityMode
            ? (ticTacToeAwaitingPlacement
                ? "Correct! Place your X in any open square."
                : ticTacToeCurrentQuestion
                  ? "Answer the question to earn your move!"
                  : "Playing vs. Charity")
            : `${ticTacToeHumanTurn}'s turn`}
        </p>

        {/* Tic-Tac-Toe Board */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] aspect-square">
          {ticTacToeBoard.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleTicTacToeCellClick(index)}
              disabled={cell !== null || boardDisabled}
              className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center text-4xl font-bold ${
                cell === "X"
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : cell === "O"
                    ? 'bg-red-600 border-red-400 text-white'
                    : ticTacToeAwaitingPlacement
                      ? 'bg-amber-900/30 border-amber-400/60 hover:border-amber-300 hover:bg-amber-700/50 animate-pulse'
                      : 'bg-amber-900/30 border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-800/40'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Question Modal (Charity mode) */}
        {isCharityMode && ticTacToeCurrentQuestion && !ticTacToeGameOver && (
          <div className="w-full p-4 bg-gradient-to-r from-amber-950/80 to-orange-950/60 rounded-xl border border-amber-500/40">
            <p className="text-amber-200 text-center font-medium mb-4">{ticTacToeCurrentQuestion.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {ticTacToeCurrentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleTicTacToeAnswer(index)}
                  className="p-3 bg-amber-800/50 hover:bg-amber-700/60 rounded-lg border border-amber-500/30 text-amber-100 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wrong answer feedback (Charity mode) - shows the correct answer */}
        {isCharityMode && ticTacToeAnswerFeedback && !ticTacToeAnswerFeedback.correct && !ticTacToeGameOver && (
          <div className="w-full p-4 bg-red-950/50 rounded-xl border border-red-500/40 text-center space-y-3">
            <p className="text-red-300 font-semibold">Not quite!</p>
            <p className="text-amber-100 text-sm">The correct answer was: <span className="font-bold">{ticTacToeAnswerFeedback.correctAnswer}</span></p>
            <button
              onClick={continueAfterWrong}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-semibold transition-all"
            >
              Continue (Charity&apos;s turn)
            </button>
          </div>
        )}

        {/* Game Over */}
        {ticTacToeGameOver && (
          <div className="w-full space-y-4">
            <div className={`text-center ${ticTacToeWinner === "X" ? 'text-green-400' : ticTacToeWinner === "O" ? 'text-red-400' : 'text-amber-400'}`}>
              <p className="text-xl font-bold">
                {isCharityMode
                  ? (ticTacToeWinner === "X" ? 'You Win! +5 points!' : ticTacToeWinner === "O" ? 'Charity Wins!' : "It's a Tie!")
                  : (ticTacToeWinner === "X" ? 'X Wins!' : ticTacToeWinner === "O" ? 'O Wins!' : "It's a Tie!")}
              </p>
            </div>
            <button
              onClick={() => startTicTacToeGame(ticTacToeOpponent)}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Play Again <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openTicTacToe}
              className="w-full py-2.5 bg-amber-900/40 hover:bg-amber-800/50 rounded-xl text-amber-200 font-medium transition-all"
            >
              Change Opponent
            </button>
          </div>
        )}

        {/* Learn more about Charity (Charity mode) */}
        {isCharityMode && !ticTacToeGameOver && (
          <a
            href="https://www.charitydupont.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-amber-300 text-sm underline underline-offset-4 hover:text-amber-200"
          >
            Learn more about Charity
          </a>
        )}
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
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-emerald-400/70 text-sm font-semibold">{truthsCorrect}/{twoTruthsRounds.length} correct</span>
            {/* Prize / reward goal */}
            <button
              onClick={() => setShowTruthsGoal(true)}
              className="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.5)] hover:scale-105 transition-transform"
              aria-label="View reward goal"
            >
              <Trophy className="w-5 h-5 text-white" />
              {truthsCorrect >= TRUTHS_WIN_THRESHOLD && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-950" />
              )}
            </button>
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
            <p className="text-emerald-300/80 text-sm mt-2">
              Two of these are true. <span className="font-bold text-red-400">Tap the LIE</span> — the one statement about Charity that is <span className="font-bold text-red-400">FALSE</span>.
            </p>
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
              {truthsRoundsPlayed.length >= twoTruthsRounds.length ? (
                truthsCorrect >= TRUTHS_WIN_THRESHOLD ? (
                  <div className="space-y-3">
                    <p className="text-center text-emerald-300 font-semibold">
                      You got {truthsCorrect}/{twoTruthsRounds.length} right — you&apos;ve earned the reward.
                    </p>
                    <button
                      onClick={() => setShowReward(true)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                    >
                      Claim your reward <Trophy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-amber-300 font-semibold text-balance">
                      So close — you got {truthsCorrect}/{twoTruthsRounds.length}. Get at least {TRUTHS_WIN_THRESHOLD} right and the reward is yours.
                    </p>
                    <button
                      onClick={startTruthsGame}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      Try again <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={nextTruthsRound}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  Next Round <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="text-center text-emerald-400/60 text-sm">
          {truthsRoundsPlayed.length} of {twoTruthsRounds.length} rounds played
        </div>

        {/* Reward goal overlay */}
        {showTruthsGoal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 to-black rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-in zoom-in-95 duration-300 p-6 text-center">
              <button
                onClick={() => setShowTruthsGoal(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-4">
                {truthsCorrect >= TRUTHS_WIN_THRESHOLD ? <Trophy className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
              </div>
              <h3 className="text-amber-300 font-bold text-xl text-balance">
                Get {TRUTHS_WIN_THRESHOLD} of {twoTruthsRounds.length} right to unlock the reward
              </h3>
              <p className="text-amber-200/70 text-sm mt-2 text-pretty">
                Spot the lie in at least {TRUTHS_WIN_THRESHOLD} of the {twoTruthsRounds.length} rounds to unlock a special reward.
              </p>
              <p className="text-emerald-300 font-semibold mt-4">
                So far: {truthsCorrect}/{twoTruthsRounds.length} correct
              </p>
              <button
                onClick={() => setShowTruthsGoal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold transition-all"
              >
                Keep playing
              </button>
            </div>
          </div>
        )}

        {/* Reward video overlay */}
        {showReward && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-zinc-900 to-black rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-amber-300 font-bold text-lg text-balance flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> You earned the reward!
                  </h3>
                  <p className="text-amber-200/60 text-sm mt-0.5 text-pretty">Thanks for playing along.</p>
                </div>
                <button
                  onClick={() => setShowReward(false)}
                  className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close reward"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Reward placeholder */}
              <div className="bg-black flex items-center justify-center">
                <div className="w-full aspect-video flex flex-col items-center justify-center gap-3 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-amber-200 font-semibold text-lg">A reward is on the way</p>
                  <p className="text-amber-200/50 text-sm max-w-sm text-pretty">You beat the challenge! A special reward is coming soon &mdash; check back later.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => { setShowReward(false); backToMenu(); }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold transition-all"
                >
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
