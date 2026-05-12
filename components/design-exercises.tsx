"use client"

import { useState } from "react"
import { ChevronLeft, Pencil, Lightbulb, Layout, Palette, HelpCircle } from "lucide-react"

// ============ DESIGN EXERCISES STATE ============
export interface DesignExercisesState {
  currentExercise: string | null
  completedExercises: string[]
  // Add more state as needed when content is added
}

export const initialDesignExercisesState: DesignExercisesState = {
  currentExercise: null,
  completedExercises: [],
}

interface DesignExercisesProps {
  gameState?: DesignExercisesState
  onGameStateChange?: (state: DesignExercisesState) => void
}

export function DesignExercises({ gameState, onGameStateChange }: DesignExercisesProps) {
  // Use provided state or local state
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

  const { currentExercise } = state

  // Placeholder exercise categories - will be expanded with more content
  const exerciseCategories = [
    {
      id: "wireframing",
      title: "Wireframing",
      description: "Practice creating low-fidelity layouts",
      icon: Layout,
      color: "from-blue-600 to-cyan-700",
      comingSoon: true,
    },
    {
      id: "color-theory",
      title: "Color Theory",
      description: "Learn about color relationships and palettes",
      icon: Palette,
      color: "from-purple-600 to-pink-700",
      comingSoon: true,
    },
    {
      id: "ux-writing",
      title: "UX Writing",
      description: "Craft clear and effective microcopy",
      icon: Pencil,
      color: "from-amber-600 to-orange-700",
      comingSoon: true,
    },
    {
      id: "design-thinking",
      title: "Design Thinking",
      description: "Problem-solving exercises and methods",
      icon: Lightbulb,
      color: "from-green-600 to-emerald-700",
      comingSoon: true,
    },
  ]

  const backToMenu = () => {
    updateState({ currentExercise: null })
  }

  // Main Menu
  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          Design Exercises
        </h2>
        <p className="text-purple-300/70 text-sm md:text-base">
          Sharpen your design skills with interactive challenges
        </p>
      </div>

      {/* Exercise Categories Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
        {exerciseCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              disabled={category.comingSoon}
              className={`relative flex flex-col items-center gap-3 p-4 md:p-6 bg-gradient-to-br from-purple-950/80 to-pink-900/50 rounded-2xl border border-purple-500/30 transition-all ${
                category.comingSoon 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] active:scale-[0.98]'
              }`}
            >
              {/* Coming Soon Badge */}
              {category.comingSoon && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500/30 rounded-full">
                  <span className="text-[10px] text-purple-300 font-medium">Coming Soon</span>
                </div>
              )}
              
              {/* Icon */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              
              <div className="text-center">
                <p className="text-purple-300 font-bold text-sm md:text-lg">{category.title}</p>
                <p className="text-purple-400/50 text-xs md:text-sm">{category.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Section */}
      <div className="w-full p-4 bg-purple-950/40 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-300 font-medium text-sm">More exercises coming soon!</p>
            <p className="text-purple-400/60 text-xs mt-1">
              I&apos;m working on interactive design challenges to help you practice UX/UI skills. 
              Check back soon for wireframing exercises, color palette builders, and more!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
