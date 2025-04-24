"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"
import { BookOpen, GraduationCap, Bookmark , Award , Book } from "lucide-react"
import { useKeyBindings } from "@/hooks/use-key-bindings"

interface DifficultySliderProps {
  difficulty: number
  setDifficulty: (value: number) => void
}

export function DifficultySlider({ difficulty, setDifficulty }: DifficultySliderProps) {
  const levels = [
    { name: "Elementary", icon: <BookOpen className="w-5 h-5 text-white" /> },
    { name: "Middle School", icon: <Book className="w-5 h-5 text-white" /> },
    { name: "High School", icon: <Bookmark className="w-5 h-5 text-white" /> },
    { name: "College", icon: <GraduationCap className="w-5 h-5 text-white" /> },
    { name: "Graduate", icon: <Award className="w-5 h-5 text-white" /> },
  ]

  const sliderHeight = 300
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Motion values for the indicator
  const y = useMotionValue(0)
  // Use a stiffer spring for more magnetic feel
  const springY = useSpring(y, { damping: 50, stiffness: 400 })

  // Calculate position based on difficulty level
  useEffect(() => {
    const newY = ((levels.length - 1 - difficulty) / (levels.length - 1)) * sliderHeight
    animate(y, newY, { type: "spring", damping: 50, stiffness: 400 })
  }, [difficulty, levels.length])

  // Keybindings: Cmd+Option+[-/+] (Mac), Ctrl+Alt+[-/+] (Windows), plus ArrowUp/ArrowDown for accessibility
  // "Plus" and "Minus" refer to the + and - keys (not numpad)
  useKeyBindings(
    [
      {
        keys: [
          // Cmd+Option+= (Mac, for "+"), Cmd+Option+- (Mac, for "-")
          // Ctrl+Alt+= (Windows, for "+"), Ctrl+Alt+- (Windows, for "-")
          // Some browsers report "+" as "Equal" with shift, so include both
          "Meta+Alt+Plus",
          "Meta+Alt+Equal",
          "Meta+Alt+Shift+Equal",
          "Meta+Alt+Minus",
          "Control+Alt+Plus",
          "Control+Alt+Equal",
          "Control+Alt+Shift+Equal",
          "Control+Alt+Minus",
          "Control+ArrowUp",
          "Meta+ArrowUp"
        ],
        callback: () => {
          const newDifficulty = Math.min(levels.length - 1, difficulty + 1)
          setDifficulty(newDifficulty)
        },
      },
      {
        keys: [
          "Meta+Alt+Minus",
          "Meta+Alt+Equal",
          "Meta+Alt+Shift+Equal",
          "Meta+Alt+Plus",
          "Control+Alt+Minus",
          "Control+Alt+Equal",
          "Control+Alt+Shift+Equal",
          "Control+Alt+Plus",
          "Control+ArrowDown",
          "Meta+ArrowDown"
        ],
        callback: () => {
          const newDifficulty = Math.max(0, difficulty - 1)
          setDifficulty(newDifficulty)
        },
      },
    ],
    [difficulty, setDifficulty, levels.length]
  )

  // Handle drag on the slider
  const handleDrag = (_: any, info: any) => {
    const newY = Math.max(0, Math.min(sliderHeight, y.get() + info.delta.y))
    y.set(newY)

    // Calculate new difficulty based on position and snap immediately
    const newDifficulty = Math.round(levels.length - 1 - (newY / sliderHeight) * (levels.length - 1))
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty)
      
      // Snap to exact position for the level - creates magnetic effect
      const snapY = ((levels.length - 1 - newDifficulty) / (levels.length - 1)) * sliderHeight
      animate(y, snapY, { type: "spring", damping: 50, stiffness: 400 })
    }
  }

  // Snap to nearest level on drag end
  const handleDragEnd = () => {
    const snapY = ((levels.length - 1 - difficulty) / (levels.length - 1)) * sliderHeight
    animate(y, snapY, { type: "spring", damping: 50, stiffness: 400 })
  }

  return (
    <div className="flex items-center">
      {/* The tooltip that follows the slider thumb */}
      <motion.div
        className="mr-2 bg-black text-white px-4 py-2 rounded-md whitespace-nowrap z-30"
        style={{ y: springY }}
      >
        {levels[difficulty].name}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-8px)] w-0 h-0 border-8 border-transparent border-l-black"></div>
      </motion.div>
      
      {/* Dark enclosure for the slider */}
      <div className="relative h-[400px] w-[60px] bg-black/80 backdrop-blur-sm rounded-[30px] shadow-lg flex items-center justify-center overflow-hidden border border-white/10">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[300px] w-full flex items-center justify-center" ref={constraintsRef}>
          {/* Level markers - small dots */}
          {/* 5 perfectly aligned dots: 0% (top, Graduate) to 100% (bottom, Elementary) */}
          {levels.map((_, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 left-1/2 -translate-x-1/2 rounded-full bg-gray-300"
              style={{
                top: `calc(${(index / (levels.length - 1)) * 100}% - 4px)`, // offset by half dot height for perfect alignment
              }}
            />
          ))}

          {/* Draggable indicator */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: sliderHeight }}
            dragElastic={0.02}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ y: springY }}
            className="absolute left-[3%] w-14 h-14 bg-[#FF5722] rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            whileDrag={{ scale: 1.05 }}
          >
            {levels[difficulty].icon}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
