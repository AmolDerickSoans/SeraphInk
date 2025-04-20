"use client"

// This component provides a floating vertical slider for adjusting reading level
// It features a draggable indicator that moves up and down with a label that follows it

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion"
import { X, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DifficultySliderProps {
  difficulty: number
  setDifficulty: (value: number) => void
  onClose: () => void
}

export function DifficultySlider({ difficulty, setDifficulty, onClose }: DifficultySliderProps) {
  const levels = [
    { name: "Elementary", icon: <BookOpen className="w-4 h-4" />, color: "#FF5722" },
    { name: "Middle School", icon: <BookOpen className="w-4 h-4" />, color: "#FF9800" },
    { name: "High School", icon: <BookOpen className="w-4 h-4" />, color: "#FFEB3B" },
    { name: "College", icon: <GraduationCap className="w-4 h-4" />, color: "#4CAF50" },
    { name: "Graduate", icon: <GraduationCap className="w-4 h-4" />, color: "#2196F3" },
  ]

  const [activeLevel, setActiveLevel] = useState(levels[difficulty])
  const sliderHeight = 400
  const indicatorSize = 48
  const trackRef = useRef<HTMLDivElement>(null)

  // Motion values for the draggable indicator
  const y = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Calculate the initial position based on difficulty
  useEffect(() => {
    const newY = ((levels.length - 1 - difficulty) / (levels.length - 1)) * (sliderHeight - indicatorSize)
    animate(y, newY, { duration: 0.3 })
    setActiveLevel(levels[difficulty])
  }, [difficulty, levels.length, y])

  // Transform y position to difficulty level
  const handleDrag = (_: MouseEvent, info: PanInfo) => {
    if (!trackRef.current) return

    const trackHeight = sliderHeight - indicatorSize
    const newY = Math.max(0, Math.min(trackHeight, y.get() + info.delta.y))
    y.set(newY)

    // Calculate new difficulty based on position
    const newDifficulty = Math.round(levels.length - 1 - (newY / trackHeight) * (levels.length - 1))
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty)
      setActiveLevel(levels[newDifficulty])
    }
  }

  return (
    <motion.div
      className="w-[280px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Reading Level</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#FF5722]">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div ref={constraintsRef} className="relative h-[400px] w-[60px] bg-[#252525] rounded-full mb-6">
          {/* Track with gradient */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#FF5722] to-[#2196F3] rounded-full"
            style={{ height: `${(difficulty / (levels.length - 1)) * 100}%` }}
          />

          {/* Draggable indicator */}
          <motion.div
            drag="y"
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            style={{ y }}
            className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: activeLevel.color }}
            >
              {activeLevel.icon}
            </div>

            {/* Label that follows the indicator */}
            <motion.div
              className="absolute left-16 bg-[#1A1A1A] text-white px-3 py-1 rounded-md whitespace-nowrap"
              style={{
                y: 0,
                backgroundColor: `${activeLevel.color}20`, // 20% opacity
                borderLeft: `3px solid ${activeLevel.color}`,
              }}
            >
              {activeLevel.name}
            </motion.div>
          </motion.div>

          {/* Level markers */}
          {levels.map((level, index) => (
            <div
              key={index}
              className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                bottom: `${(index / (levels.length - 1)) * 100}%`,
                backgroundColor: index <= difficulty ? level.color : "#353535",
              }}
            />
          ))}
        </div>

        <p className="text-[#A0A0A0] text-sm text-center mb-4">Drag the indicator to adjust reading level</p>

        <motion.button
          className="bg-[#252525] rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-[#303030] transition-colors w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ borderLeft: `3px solid ${activeLevel.color}` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: activeLevel.color }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">Keep current level</div>
            <div className="text-[#A0A0A0] text-xs">Lock at {activeLevel.name}</div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
