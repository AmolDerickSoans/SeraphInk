"use client"

// This component is a floating side panel for adjusting the tone of the text
// It provides a matrix for fine-tuning and preset options for quick selection

import { useRef } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToneAdjusterProps {
  onClose: () => void
}

export function ToneAdjuster({ onClose }: ToneAdjusterProps) {
  const presets = [
    { name: "Executive", description: "Formal and authoritative", x: -50, y: 50 },
    { name: "Technical", description: "Precise and detailed", x: 50, y: 50 },
    { name: "Basic", description: "Simple and clear", x: -50, y: -50 },
    { name: "Educational", description: "Informative and explanatory", x: 50, y: -50 },
  ]

  // Motion values for the joystick
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Transform x and y to tone values
  const formalCasual = useTransform(y, [-50, 50], ["Formal", "Casual"])
  const conciseExpanded = useTransform(x, [-50, 50], ["Concise", "Expanded"])

  // Color transforms based on position
  const backgroundColor = useTransform([x, y], ([latestX, latestY]) => {
    // Normalize values to 0-1 range
    const normalizedX = (latestX + 50) / 100
    const normalizedY = (latestY + 50) / 100

    // Create a gradient based on position
    const colors = [
      "#FF5722", // top-left (concise, formal)
      "#2196F3", // top-right (expanded, formal)
      "#4CAF50", // bottom-left (concise, casual)
      "#9C27B0", // bottom-right (expanded, casual)
    ]

    // Interpolate between colors based on position
    const topColor = interpolateColor(colors[0], colors[1], normalizedX)
    const bottomColor = interpolateColor(colors[2], colors[3], normalizedX)
    const finalColor = interpolateColor(topColor, bottomColor, normalizedY)

    return finalColor
  })

  // Handle preset selection
  const selectPreset = (preset: (typeof presets)[0]) => {
    animate(x, preset.x, { duration: 0.3 })
    animate(y, preset.y, { duration: 0.3 })
  }

  return (
    <motion.div
      className="absolute right-8 top-1/2 -translate-y-1/2 w-[320px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">Adjust tone</h3>
          <span className="text-xs bg-[#353535] text-white px-2 py-0.5 rounded">AI beta</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#FF5722]">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="relative h-[240px] bg-[#252525] rounded-lg mb-6 overflow-hidden">
          {/* Tone Matrix Grid */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
            <div className="border-r border-b border-[#353535] flex items-center justify-center">
              <span className="text-[#808080] text-xs transform -rotate-45">Concise & Formal</span>
            </div>
            <div className="border-b border-[#353535] flex items-center justify-center">
              <span className="text-[#808080] text-xs transform rotate-45">Expanded & Formal</span>
            </div>
            <div className="border-r border-[#353535] flex items-center justify-center">
              <span className="text-[#808080] text-xs transform rotate-45">Concise & Casual</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-[#808080] text-xs transform -rotate-45">Expanded & Casual</span>
            </div>
          </div>

          {/* Draggable Joystick */}
          <motion.div
            ref={constraintsRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            onTap={(_, info) => {
              if (constraintsRef.current) {
                const rect = constraintsRef.current.getBoundingClientRect()
                const centerX = rect.width / 2
                const centerY = rect.height / 2
                const newX = Math.max(-50, Math.min(50, info.point.x - rect.left - centerX))
                const newY = Math.max(-50, Math.min(50, info.point.y - rect.top - centerY))
                animate(x, newX, { duration: 0.3 })
                animate(y, newY, { duration: 0.3 })
              }
            }}
          >
            <motion.div
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              dragElastic={0.1}
              dragMomentum={false}
              style={{ x, y, backgroundColor }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <motion.div className="text-white text-xs font-medium text-center" style={{ opacity: 0.9 }}>
                  <motion.div>{formalCasual}</motion.div>
                  <motion.div>{conciseExpanded}</motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="text-[#A0A0A0] text-sm mb-4">Or pick a preset</div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {presets.map((preset, index) => (
            <motion.button
              key={index}
              className="bg-[#252525] rounded-md p-3 text-left hover:bg-[#303030] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectPreset(preset)}
            >
              <div className="text-white font-medium">{preset.name}</div>
              <div className="text-[#A0A0A0] text-xs">{preset.description}</div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
          <Info className="w-4 h-4" />
          <span>AI outputs can be misleading or wrong</span>
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number) {
  // Convert hex to RGB
  const r1 = Number.parseInt(color1.substring(1, 3), 16)
  const g1 = Number.parseInt(color1.substring(3, 5), 16)
  const b1 = Number.parseInt(color1.substring(5, 7), 16)

  const r2 = Number.parseInt(color2.substring(1, 3), 16)
  const g2 = Number.parseInt(color2.substring(3, 5), 16)
  const b2 = Number.parseInt(color2.substring(5, 7), 16)

  // Interpolate
  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
