"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Lightbulb, Target, Users, Layers, Sparkles, ArrowRight } from "lucide-react"

// ============ DESIGN EXERCISES STATE ============
export interface DesignExercisesState {
  currentProject: string | null
  currentSection: number
}

export const initialDesignExercisesState: DesignExercisesState = {
  currentProject: null,
  currentSection: 0,
}

interface DesignExercisesProps {
  gameState?: DesignExercisesState
  onGameStateChange?: (state: DesignExercisesState) => void
}

// ============ DESIGN CHALLENGE DATA ============
interface DesignChallenge {
  id: string
  title: string
  subtitle: string
  category: string
  color: string
  icon: string
  overview: string
  sections: {
    title: string
    icon: typeof Lightbulb
    content: string[]
  }[]
  mockups?: string[] // URLs or descriptions of mockup images
}

const designChallenges: DesignChallenge[] = [
  {
    id: "habit-breaker",
    title: "Habit Breaker",
    subtitle: "Breaking Bad Habits App",
    category: "Mobile App Design",
    color: "from-red-600 to-orange-600",
    icon: "🔥",
    overview: "A mobile app designed to help users identify, track, and break their bad habits through behavioral psychology techniques and positive reinforcement.",
    sections: [
      {
        title: "The Challenge",
        icon: Target,
        content: [
          "Design an app that helps people break bad habits without feeling like punishment",
          "Make habit tracking engaging rather than tedious",
          "Create a supportive experience that celebrates small wins",
          "Address the psychological aspects of habit formation"
        ]
      },
      {
        title: "My Thinking Process",
        icon: Lightbulb,
        content: [
          "I started by researching behavioral psychology - specifically how habits form and what triggers them",
          "I realized most habit apps focus on building good habits, not breaking bad ones - there's a gap in the market",
          "Breaking habits requires understanding triggers, so I designed a 'trigger journal' feature",
          "I wanted to avoid shame-based motivation - instead focusing on compassion and progress"
        ]
      },
      {
        title: "User Research Insights",
        icon: Users,
        content: [
          "Users often feel ashamed tracking bad habits - needed a judgment-free zone",
          "People want to understand WHY they do things, not just track WHAT they do",
          "Small streaks (even 1-3 days) feel like big wins and motivate continued effort",
          "Community support helps but needs to be anonymous to reduce stigma"
        ]
      },
      {
        title: "Design Decisions",
        icon: Layers,
        content: [
          "Warm, encouraging color palette - oranges and soft reds instead of harsh warning colors",
          "Celebration animations for every milestone, no matter how small",
          "Trigger tracking with time, location, and emotion tags",
          "Anonymous community stories for inspiration without judgment",
          "'Slip-up' recovery flow that treats setbacks as learning opportunities"
        ]
      },
      {
        title: "Key Features",
        icon: Sparkles,
        content: [
          "Habit Loop Analyzer - identifies trigger → routine → reward patterns",
          "Replacement Suggester - recommends healthier alternatives",
          "Progress Visualization - shows brain rewiring over time",
          "Support Circle - anonymous community of people with similar goals",
          "Compassion Mode - gentle reminders without guilt trips"
        ]
      }
    ]
  },
  // Add more design challenges here as you complete them
]

export function DesignExercises({ gameState, onGameStateChange }: DesignExercisesProps) {
  const [localState, setLocalState] = useState<DesignExercisesState>(initialDesignExercisesState)
  const state = gameState || localState
  
  const updateState = (updates: Partial<DesignExercisesState>) => {
    const newState = { ...state, ...updates }
    if (onGameStateChange) {
      onGameStateChange(newState)
    } else {
      setLocalState(newState)
    }
  }

  const { currentProject, currentSection } = state
  const activeProject = designChallenges.find(p => p.id === currentProject)

  const backToMenu = () => {
    updateState({ currentProject: null, currentSection: 0 })
  }

  const goToSection = (index: number) => {
    updateState({ currentSection: index })
  }

  const nextSection = () => {
    if (activeProject && currentSection < activeProject.sections.length - 1) {
      updateState({ currentSection: currentSection + 1 })
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      updateState({ currentSection: currentSection - 1 })
    }
  }

  // ============ PROJECT DETAIL VIEW ============
  if (activeProject) {
    const section = activeProject.sections[currentSection]
    const SectionIcon = section.icon

    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 w-full max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <button onClick={backToMenu} className="flex items-center gap-1 text-purple-400 text-sm hover:text-purple-300">
            <ChevronLeft className="w-5 h-5" /> All Projects
          </button>
          <span className="text-purple-400/60 text-xs">{activeProject.category}</span>
        </div>

        {/* Project Title */}
        <div className="text-center space-y-1">
          <span className="text-4xl">{activeProject.icon}</span>
          <h2 className="text-2xl font-bold text-purple-100">{activeProject.title}</h2>
          <p className="text-purple-300/70 text-sm">{activeProject.subtitle}</p>
        </div>

        {/* Section Navigation Dots */}
        <div className="flex justify-center gap-2">
          {activeProject.sections.map((s, idx) => (
            <button
              key={idx}
              onClick={() => goToSection(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSection 
                  ? 'bg-purple-400 w-6' 
                  : 'bg-purple-600/40 hover:bg-purple-500/60'
              }`}
            />
          ))}
        </div>

        {/* Current Section */}
        <div className="bg-purple-950/50 rounded-2xl border border-purple-500/20 p-4 md:p-6 space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${activeProject.color}`}>
              <SectionIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-purple-200">{section.title}</h3>
          </div>

          {/* Section Content */}
          <ul className="space-y-3">
            {section.content.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                <p className="text-purple-200/80 text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentSection === 0
                ? 'text-purple-600/40 cursor-not-allowed'
                : 'text-purple-400 hover:bg-purple-900/40'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <span className="text-purple-400/60 text-sm">
            {currentSection + 1} / {activeProject.sections.length}
          </span>
          
          <button
            onClick={nextSection}
            disabled={currentSection === activeProject.sections.length - 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentSection === activeProject.sections.length - 1
                ? 'text-purple-600/40 cursor-not-allowed'
                : 'text-purple-400 hover:bg-purple-900/40'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // ============ MAIN MENU - PROJECT LIST ============
  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          Design Challenges
        </h2>
        <p className="text-purple-300/70 text-sm md:text-base">
          Explore my design thinking process and solutions
        </p>
      </div>

      {/* Project Cards */}
      <div className="w-full space-y-4">
        {designChallenges.map((project) => (
          <button
            key={project.id}
            onClick={() => updateState({ currentProject: project.id, currentSection: 0 })}
            className="w-full flex items-center gap-4 p-4 bg-gradient-to-br from-purple-950/80 to-pink-900/50 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all active:scale-[0.99] text-left"
          >
            {/* Project Icon */}
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-3xl flex-shrink-0`}>
              {project.icon}
            </div>
            
            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <span className="text-purple-400/60 text-xs uppercase tracking-wide">{project.category}</span>
              <h3 className="text-purple-100 font-bold text-lg truncate">{project.title}</h3>
              <p className="text-purple-300/60 text-sm truncate">{project.subtitle}</p>
            </div>
            
            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-purple-400/60 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Coming Soon Placeholder */}
      <div className="w-full p-4 bg-purple-950/30 rounded-xl border border-dashed border-purple-500/20">
        <div className="flex items-center justify-center gap-2 text-purple-400/50">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">More design challenges coming soon...</span>
        </div>
      </div>
    </div>
  )
}
