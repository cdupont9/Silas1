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

// ============ CONNECTIONS PUZZLE (like NYT Connections) ============
// Group 16 items into 4 categories of 4 items each
interface ConnectionsCategory {
  name: string
  items: string[]
  color: string // Tailwind gradient classes
  difficulty: 1 | 2 | 3 | 4 // 1 = easiest (yellow), 4 = hardest (purple)
}

interface ConnectionsPuzzle {
  id: string
  categories: ConnectionsCategory[]
}

const connectionsPuzzles: ConnectionsPuzzle[] = [
  {
    id: "cp1",
    categories: [
      { name: "Hilary Duff Songs", items: ["So Yesterday", "Come Clean", "Why Not", "Fly"], color: "from-yellow-500 to-amber-600", difficulty: 1 },
      { name: "Places Charity Has Visited", items: ["Paris", "Spain", "South Africa", "Italy"], color: "from-green-500 to-emerald-600", difficulty: 2 },
      { name: "Charity's Favorite Drinks", items: ["Apple Juice", "Lemonade + Ginger Ale", "Caramel Ribbon Crunch", "Vanilla Bean Frapp"], color: "from-blue-500 to-cyan-600", difficulty: 3 },
      { name: "Childhood Memories", items: ["Breakfast Business", "Ballet Dreams", "Homeschooled", "Broom Dancing"], color: "from-purple-500 to-violet-600", difficulty: 4 },
    ]
  },
  {
    id: "cp2",
    categories: [
      { name: "Mandy Moore Songs", items: ["Candy", "Only Hope", "Cry", "Saved"], color: "from-yellow-500 to-amber-600", difficulty: 1 },
      { name: "Movies Charity Loves", items: ["A Walk to Remember", "Lizzie McGuire Movie", "Cinderella (Brandy)", "The Princess Diaries"], color: "from-green-500 to-emerald-600", difficulty: 2 },
      { name: "Broadway Chicken Order", items: ["Hot and Honey", "Buttermilk Battered", "Honey Mustard", "Westfield NJ"], color: "from-blue-500 to-cyan-600", difficulty: 3 },
      { name: "Things on VHS", items: ["Cinderella", "Lizzie McGuire", "Metamorphosis Concert", "A Walk to Remember"], color: "from-purple-500 to-violet-600", difficulty: 4 },
    ]
  },
  {
    id: "cp3",
    categories: [
      { name: "Disney Characters", items: ["Cinderella", "Lizzie McGuire", "Brandy", "Whitney Houston"], color: "from-yellow-500 to-amber-600", difficulty: 1 },
      { name: "Bucket List Destinations", items: ["Greece", "Bus Travel", "Design Conference", "Senior Leadership"], color: "from-green-500 to-emerald-600", difficulty: 2 },
      { name: "Childhood Dreams", items: ["Ballet Dancer", "Cook", "Teacher", "Designer"], color: "from-blue-500 to-cyan-600", difficulty: 3 },
      { name: "Road Trip: Chicago to NJ", items: ["No Hotel Stops", "Drove Straight Through", "With Mom", "Lots of Snacks"], color: "from-purple-500 to-violet-600", difficulty: 4 },
    ]
  },
  {
    id: "cp4",
    categories: [
      { name: "Starbucks Favorites", items: ["Caramel Ribbon Crunch", "Vanilla Bean Frapp", "Extra Caramel", "Extra Crunch"], color: "from-yellow-500 to-amber-600", difficulty: 1 },
      { name: "Chinese Food Order", items: ["Sweet and Sour Shrimp", "White Rice", "Egg Roll", "Fortune Cookie"], color: "from-green-500 to-emerald-600", difficulty: 2 },
      { name: "UX Designer Traits", items: ["Empathetic", "Detail-Oriented", "Creative", "Patient"], color: "from-blue-500 to-cyan-600", difficulty: 3 },
      { name: "In My Own Little Corner", items: ["Broom Dancing", "Singing Along", "Pretending to be Cinderella", "Mom Watching"], color: "from-purple-500 to-violet-600", difficulty: 4 },
    ]
  },
  {
    id: "cp5",
    categories: [
      { name: "90s/2000s Nostalgia", items: ["Lizzie McGuire", "Hilary Duff", "VHS Tapes", "Metamorphosis"], color: "from-yellow-500 to-amber-600", difficulty: 1 },
      { name: "Roller Coaster Preferences", items: ["Front Row", "Big Drops", "Loop-de-loops", "Screaming Allowed"], color: "from-green-500 to-emerald-600", difficulty: 2 },
      { name: "Homeschool Life", items: ["Grandmother Teacher", "Cousin Classmates", "4th Grade End", "Chicago Days"], color: "from-blue-500 to-cyan-600", difficulty: 3 },
      { name: "Work Values", items: ["Peace and Quiet", "Work-Life Balance", "Meaningful Impact", "Continuous Learning"], color: "from-purple-500 to-violet-600", difficulty: 4 },
    ]
  },
]

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
  // Disney & Movies (same category per round)
  { id: "tt27", category: "disney", statements: ["Cinderella is my favorite Disney character", "My favorite Cinderella is the one with Brandy and Whitney Houston", "My favorite Cinderella is the animated 1950 version"], lieIndex: 2 },
  { id: "tt28", category: "disney", statements: ["I still own the Brandy Cinderella movie on VHS", "As a kid I would dance with a broom singing 'In My Own Little Corner'", "I've never watched Cinderella"], lieIndex: 2 },
  { id: "tt29", category: "disney", statements: ["My mom told me I used to dance with a broom to Cinderella songs", "I loved pretending to be Cinderella as a little girl", "I thought Cinderella was boring as a child"], lieIndex: 2 },
  // Goals (same category per round)
  { id: "tt30", category: "goals", statements: ["I dream of traveling to Greece", "I want to speak at design conferences", "I've already given a TED talk"], lieIndex: 2 },
  { id: "tt31", category: "goals", statements: ["Work-life balance is important to me", "I want to grow into senior leadership roles", "I only care about salary, not impact"], lieIndex: 2 },
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
  // Connections puzzle state (group items into categories)
  currentConnectionsPuzzle: ConnectionsPuzzle | null
  connectionsSelected: string[] // Currently selected items (max 4)
  connectionsSolved: number[] // Indices of solved categories (0-3)
  connectionsMistakes: number // Number of wrong guesses (max 4)
  connectionsComplete: boolean
  connectionsPuzzlesPlayed: string[]
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
  // Connections puzzle state
  currentConnectionsPuzzle: null,
  connectionsSelected: [],
  connectionsSolved: [],
  connectionsMistakes: 0,
  connectionsComplete: false,
  connectionsPuzzlesPlayed: [],
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
  const currentConnectionsPuzzle = localState.currentConnectionsPuzzle || null
  const connectionsSelected = localState.connectionsSelected || []
  const connectionsSolved = localState.connectionsSolved || []
  const connectionsMistakes = localState.connectionsMistakes || 0
  const connectionsComplete = localState.connectionsComplete || false
  const connectionsPuzzlesPlayed = localState.connectionsPuzzlesPlayed || []
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

  // Connections puzzle functions (GROUP ITEMS INTO CATEGORIES)
  const getRandomConnectionsPuzzle = (): ConnectionsPuzzle => {
    const unplayed = connectionsPuzzles.filter(p => !connectionsPuzzlesPlayed.includes(p.id))
    if (unplayed.length === 0) {
      return connectionsPuzzles[Math.floor(Math.random() * connectionsPuzzles.length)]
    }
    return unplayed[Math.floor(Math.random() * unplayed.length)]
  }

  const startConnectionsGame = () => {
    const puzzle = getRandomConnectionsPuzzle()
    updateState({
      gameMode: "trivia", // reusing trivia mode for connections
      currentConnectionsPuzzle: puzzle,
      connectionsSelected: [],
      connectionsSolved: [],
      connectionsMistakes: 0,
      connectionsComplete: false
    })
  }

  const handleConnectionsItemClick = (item: string) => {
    if (connectionsComplete || connectionsMistakes >= 4) return
    
    // Check if item is already in a solved category
    const solvedItems = connectionsSolved.flatMap(idx => 
      currentConnectionsPuzzle?.categories[idx].items || []
    )
    if (solvedItems.includes(item)) return
    
    // Toggle selection
    if (connectionsSelected.includes(item)) {
      updateState({ connectionsSelected: connectionsSelected.filter(i => i !== item) })
    } else if (connectionsSelected.length < 4) {
      updateState({ connectionsSelected: [...connectionsSelected, item] })
    }
  }

  const submitConnectionsGuess = () => {
    if (connectionsSelected.length !== 4 || !currentConnectionsPuzzle) return
    
    // Check if selected items match any unsolved category
    const unsolvedCategories = currentConnectionsPuzzle.categories
      .map((cat, idx) => ({ cat, idx }))
      .filter(({ idx }) => !connectionsSolved.includes(idx))
    
    const matchedCategory = unsolvedCategories.find(({ cat }) => 
      cat.items.every(item => connectionsSelected.includes(item))
    )
    
    if (matchedCategory) {
      const newSolved = [...connectionsSolved, matchedCategory.idx]
      const isComplete = newSolved.length === 4
      const newScore = totalScore + (isComplete ? 4 : 1)
      
      updateState({
        connectionsSolved: newSolved,
        connectionsSelected: [],
        connectionsComplete: isComplete,
        totalScore: newScore,
        connectionsPuzzlesPlayed: isComplete 
          ? [...connectionsPuzzlesPlayed, currentConnectionsPuzzle.id]
          : connectionsPuzzlesPlayed
      })
      onScoreChange?.(newScore)
    } else {
      // Wrong guess
      const newMistakes = connectionsMistakes + 1
      updateState({
        connectionsMistakes: newMistakes,
        connectionsSelected: [],
        connectionsComplete: newMistakes >= 4,
        connectionsPuzzlesPlayed: newMistakes >= 4 
          ? [...connectionsPuzzlesPlayed, currentConnectionsPuzzle.id]
          : connectionsPuzzlesPlayed
      })
    }
  }

  const nextConnectionsPuzzle = () => {
    const puzzle = getRandomConnectionsPuzzle()
    updateState({
      currentConnectionsPuzzle: puzzle,
      connectionsSelected: [],
      connectionsSolved: [],
      connectionsMistakes: 0,
      connectionsComplete: false
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
          {/* User Persona - Card Sorting Game */}
          <button
            onClick={() => startPersonaGame()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-violet-950/80 to-indigo-900/50 rounded-2xl border border-violet-500/30 hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98]"
          >
            {/* Card sorting icon */}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <rect width="100" height="100" rx="20" fill="#1e1b4b"/>
              {/* Stacked cards */}
              <rect x="20" y="25" width="35" height="50" rx="4" fill="#8b5cf6" transform="rotate(-8 37 50)"/>
              <rect x="30" y="22" width="35" height="50" rx="4" fill="#a78bfa" transform="rotate(0 47 47)"/>
              <rect x="40" y="25" width="35" height="50" rx="4" fill="#c4b5fd" transform="rotate(8 57 50)"/>
              {/* Category buckets */}
              <rect x="15" y="78" width="16" height="8" rx="2" fill="#3b82f6"/>
              <rect x="34" y="78" width="16" height="8" rx="2" fill="#ef4444"/>
              <rect x="53" y="78" width="16" height="8" rx="2" fill="#22c55e"/>
              <rect x="72" y="78" width="16" height="8" rx="2" fill="#a855f7"/>
            </svg>
            <div className="text-center">
              <p className="text-violet-300 font-bold text-sm md:text-lg">User Persona</p>
              <p className="text-violet-400/50 text-xs md:text-sm">Sort the Cards</p>
            </div>
          </button>

          {/* Connections Puzzle - Group items into categories */}
          <button
            onClick={() => startConnectionsGame()}
            className="flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-pink-950/80 to-rose-900/50 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
          >
            {/* Connections grid icon */}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16">
              <rect width="100" height="100" rx="20" fill="#831843"/>
              {/* 4x4 grid of items */}
              <rect x="12" y="12" width="18" height="18" rx="3" fill="#eab308"/>
              <rect x="33" y="12" width="18" height="18" rx="3" fill="#eab308"/>
              <rect x="54" y="12" width="18" height="18" rx="3" fill="#22c55e"/>
              <rect x="75" y="12" width="18" height="18" rx="3" fill="#22c55e"/>
              <rect x="12" y="33" width="18" height="18" rx="3" fill="#3b82f6"/>
              <rect x="33" y="33" width="18" height="18" rx="3" fill="#eab308"/>
              <rect x="54" y="33" width="18" height="18" rx="3" fill="#a855f7"/>
              <rect x="75" y="33" width="18" height="18" rx="3" fill="#3b82f6"/>
              <rect x="12" y="54" width="18" height="18" rx="3" fill="#a855f7"/>
              <rect x="33" y="54" width="18" height="18" rx="3" fill="#22c55e"/>
              <rect x="54" y="54" width="18" height="18" rx="3" fill="#3b82f6"/>
              <rect x="75" y="54" width="18" height="18" rx="3" fill="#a855f7"/>
              <rect x="12" y="75" width="18" height="18" rx="3" fill="#22c55e"/>
              <rect x="33" y="75" width="18" height="18" rx="3" fill="#3b82f6"/>
              <rect x="54" y="75" width="18" height="18" rx="3" fill="#eab308"/>
              <rect x="75" y="75" width="18" height="18" rx="3" fill="#a855f7"/>
            </svg>
            <div className="text-center">
              <p className="text-pink-300 font-bold text-sm md:text-lg">Connections</p>
              <p className="text-pink-400/50 text-xs md:text-sm">Group the items!</p>
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
                  <p className="text-violet-300 font-semibold">User Persona (Card Sort)</p>
                  <p>Sort statements about Charity into categories: Needs, Pain Points, Goals, or Behaviors.</p>
                </div>
                <div>
                  <p className="text-pink-300 font-semibold">Connections</p>
                  <p>Find 4 groups of 4 items that belong together. Select 4 items and submit your guess!</p>
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold">Two Truths & a Lie</p>
                  <p>Find the lie! Two statements are true, one is false. Can you spot which one?</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold">Logic Grids (My Favorite!)</p>
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

  // Connections Puzzle (Group 16 items into 4 categories of 4)
  if (gameMode === "trivia" && currentConnectionsPuzzle) {
    // Get all items that haven't been solved yet
    const solvedItems = connectionsSolved.flatMap(idx => 
      currentConnectionsPuzzle.categories[idx].items
    )
    const remainingItems = currentConnectionsPuzzle.categories
      .flatMap(cat => cat.items)
      .filter(item => !solvedItems.includes(item))
    
    // Shuffle remaining items (but keep it stable during render)
    const shuffledItems = [...remainingItems].sort(() => 0.5 - Math.random())

    return (
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-pink-400/60 text-sm">Mistakes: {connectionsMistakes}/4</span>
            <span className="text-pink-400 text-sm font-semibold">Score: {totalScore}</span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-pink-200 text-center text-sm">
          Find 4 groups of 4 items that belong together
        </p>

        {/* Solved Categories (shown at top) */}
        {connectionsSolved.length > 0 && (
          <div className="w-full space-y-2">
            {connectionsSolved
              .sort((a, b) => currentConnectionsPuzzle.categories[a].difficulty - currentConnectionsPuzzle.categories[b].difficulty)
              .map(idx => {
                const cat = currentConnectionsPuzzle.categories[idx]
                return (
                  <div 
                    key={idx}
                    className={`w-full p-3 rounded-xl bg-gradient-to-r ${cat.color} text-white text-center`}
                  >
                    <p className="font-bold text-sm">{cat.name}</p>
                    <p className="text-xs opacity-80">{cat.items.join(", ")}</p>
                  </div>
                )
              })}
          </div>
        )}

        {/* Item Grid */}
        {!connectionsComplete && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {remainingItems.map((item) => {
              const isSelected = connectionsSelected.includes(item)
              return (
                <button
                  key={item}
                  onClick={() => handleConnectionsItemClick(item)}
                  className={`p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? 'bg-pink-500 text-white border-2 border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                      : 'bg-pink-900/40 text-pink-100 border border-pink-500/30 hover:border-pink-400/50'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        )}

        {/* Selection Counter & Submit */}
        {!connectionsComplete && (
          <div className="w-full flex items-center justify-between">
            <span className="text-pink-400/60 text-sm">
              {connectionsSelected.length}/4 selected
            </span>
            <button
              onClick={submitConnectionsGuess}
              disabled={connectionsSelected.length !== 4}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                connectionsSelected.length === 4
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white'
                  : 'bg-pink-900/30 text-pink-400/50 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        )}

        {/* Game Over */}
        {connectionsComplete && (
          <div className="w-full space-y-4">
            <div className={`text-center ${connectionsSolved.length === 4 ? 'text-green-400' : 'text-red-400'}`}>
              <p className="text-xl font-bold">
                {connectionsSolved.length === 4 ? 'You got them all!' : 'Game Over!'}
              </p>
              <p className="text-sm mt-1 opacity-70">
                {connectionsSolved.length}/4 categories found
              </p>
            </div>
            
            {/* Show remaining categories if game over from mistakes */}
            {connectionsMistakes >= 4 && connectionsSolved.length < 4 && (
              <div className="space-y-2">
                <p className="text-pink-300/60 text-xs text-center">The categories were:</p>
                {currentConnectionsPuzzle.categories
                  .filter((_, idx) => !connectionsSolved.includes(idx))
                  .map((cat, idx) => (
                    <div key={idx} className={`w-full p-2 rounded-lg bg-gradient-to-r ${cat.color} text-white text-center opacity-70`}>
                      <p className="font-bold text-xs">{cat.name}</p>
                      <p className="text-[10px] opacity-80">{cat.items.join(", ")}</p>
                    </div>
                  ))}
              </div>
            )}
            
            <button
              onClick={nextConnectionsPuzzle}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Next Puzzle <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="text-center text-pink-400/60 text-sm">
          {connectionsPuzzlesPlayed.length} of {connectionsPuzzles.length} puzzles played
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
