"use client"

// This component provides a floating panel with text editing tools
// It includes brushes and other formatting options organized in tabs

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Type, Palette, Brush, Eraser, Pencil, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolsPanelProps {
  onClose: () => void
}

export function ToolsPanel({ onClose }: ToolsPanelProps) {
  const [activeTab, setActiveTab] = useState("brushes")

  const brushes = [
    { name: "Universal Oil", preview: "w-24 h-3 bg-white rounded-full" },
    { name: "Detail Oil", preview: "w-24 h-2 bg-white rounded-full" },
    { name: "Canvas Oil", preview: "w-24 h-4 bg-white rounded-full opacity-80" },
    { name: "Oil Mixer", preview: "w-24 h-3 bg-white rounded-full opacity-70" },
    { name: "Hard Oil", preview: "w-24 h-2 bg-white rounded-full" },
    { name: "Extra Hard Oil", preview: "w-24 h-2 bg-white rounded-full" },
    { name: "Worn Oil Brush", preview: "w-24 h-3 bg-white rounded-full opacity-90" },
    { name: "Ragged Oil", preview: "w-24 h-3 bg-white rounded-full" },
    { name: "Rough Oil", preview: "w-24 h-3 bg-white rounded-full opacity-80" },
    { name: "Perfect Colorer", preview: "w-24 h-3 bg-white rounded-full" },
  ]

  const categories = [
    { id: "brushes", name: "Brushes", icon: <Brush className="w-4 h-4" /> },
    { id: "pens", name: "Pens", icon: <PenTool className="w-4 h-4" /> },
    { id: "pencils", name: "Pencils", icon: <Pencil className="w-4 h-4" /> },
    { id: "lettering", name: "Lettering", icon: <Type className="w-4 h-4" /> },
    { id: "erasers", name: "Erasers", icon: <Eraser className="w-4 h-4" /> },
  ]

  return (
    <motion.div
      className="absolute left-8 top-1/2 -translate-y-1/2 w-[320px] bg-[#1A1A1A] rounded-xl shadow-2xl flex flex-col"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Brush className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-white font-medium">Brushes</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:text-[#FF5722]">
            <Palette className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#FF5722]">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-2 border-b border-[#2A2A2A]">
          <div className="flex overflow-x-auto hide-scrollbar gap-1 pb-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-[#A0A0A0] hover:text-white whitespace-nowrap",
                  activeTab === category.id && "text-white bg-[#252525]",
                )}
                onClick={() => setActiveTab(category.id)}
              >
                <div className="flex items-center gap-1.5">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs text-[#A0A0A0] mb-2">Recent</div>

          <div className="space-y-3">
            {brushes.map((brush, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-[#252525] rounded-md cursor-pointer group"
                whileHover={{ x: 3 }}
              >
                <div className={cn(brush.preview)}></div>
                <div className="text-white text-sm">{brush.name}</div>
                {index === 2 && (
                  <div className="ml-auto bg-[#FF5722] w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-xs text-[#808080] text-center mt-4">Long-Press to show brush and group options</div>
        </div>
      </div>
    </motion.div>
  )
}
