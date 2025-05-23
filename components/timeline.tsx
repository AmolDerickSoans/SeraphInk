"use client"

import type React from "react"

// This component provides a horizontal timeline for scrubbing through the history of generated prompts
// It features interactive markers and a scrubber with Apple-inspired interactions

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion"
import { X, ChevronLeft, ChevronRight, BookOpen, Sliders, MessageSquare, Briefcase, Lightbulb, Code, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Helper function to get the appropriate icon based on item properties
const getIconForItem = (item: TimelineItem): React.ReactNode => {
  // Prioritize specific properties if they exist
  if (item.level) {
    // Icon for reading level adjustments
    return <BookOpen className="w-4 h-4 text-white" />;
  }
  if (item.tone) {
    // Icon for tone adjustments
    return <Sliders className="w-4 h-4 text-white" />;
  }

  // Add more sophisticated logic here based on item content or type if needed.
  // For example, you could check item.content for keywords or use a hypothetical item.type.

  // Default icon if no specific property matches
  return <MessageSquare className="w-4 h-4 text-white" />;
};

interface TimelineItem {
  id: number
  timestamp: string
  content: string
  level?: string
  tone?: string
}

interface TimelineProps {
  historyData: TimelineItem[]
  onClose: () => void
}

export function Timeline({ historyData, onClose }: TimelineProps) {
  const [activeIndex, setActiveIndex] = useState(historyData.length - 1)
  const [isDragging, setIsDragging] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const timelineWidth = useRef(0)

  // Motion values for the scrubber
  const x = useMotionValue(0)

  // Update timeline width on mount
  useEffect(() => {
    if (constraintsRef.current) {
      timelineWidth.current = constraintsRef.current.offsetWidth - 20 // Adjust for scrubber width
      // Set initial position to the last item
      const initialX = (activeIndex / (historyData.length - 1)) * timelineWidth.current
      animate(x, initialX, { duration: 0.3 })
    }
  }, [activeIndex, historyData.length])

  // Handle drag to update position
  const handleDrag = (_: MouseEvent, info: PanInfo) => {
    if (!constraintsRef.current) return

    const newX = Math.max(0, Math.min(timelineWidth.current, x.get() + info.delta.x))
    x.set(newX)

    // Calculate nearest checkpoint position
    const percentage = newX / timelineWidth.current
    const newIndex = Math.round(percentage * (historyData.length - 1))
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
      // Snap to nearest checkpoint
      const snapX = (newIndex / (historyData.length - 1)) * timelineWidth.current
      animate(x, snapX, { duration: 0.2, type: "spring", stiffness: 400 })
    }
  }

  // Handle click on timeline to jump to position
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!constraintsRef.current || isDragging) return

    const rect = constraintsRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newIndex = Math.round(percentage * (historyData.length - 1))

    setActiveIndex(newIndex)
    animate(x, (newIndex / (historyData.length - 1)) * timelineWidth.current, { duration: 0.3 })
  }

  // Navigate with buttons
  const navigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev" ? Math.max(0, activeIndex - 1) : Math.min(historyData.length - 1, activeIndex + 1)

    setActiveIndex(newIndex)
    animate(x, (newIndex / (historyData.length - 1)) * timelineWidth.current, { duration: 0.3 })
  }

  // Toggle details card
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <motion.div
      className="flex-1 bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">History Timeline</h3>
          <span className="text-xs bg-[#353535] text-white px-2 py-0.5 rounded">
            {historyData[activeIndex].timestamp}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#FF5722]">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Interactive History Card */}
      <motion.div
        className={cn(
          "bg-[#252525] rounded-lg p-4 mb-4 cursor-pointer transition-all",
          showDetails ? "h-auto" : "h-16 overflow-hidden",
        )}
        onClick={toggleDetails}
        whileHover={{ scale: 1.01 }}
        layout
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF5722] flex items-center justify-center shrink-0">
            {getIconForItem(historyData[activeIndex])}
          </div>
          <div className="flex-1">
            <div className="text-white font-medium mb-1">{historyData[activeIndex].content}</div>

            {showDetails && (
              <motion.div
                className="mt-3 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {historyData[activeIndex].level && (
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-[#4CAF50]" />
                    <span className="text-[#A0A0A0]">Reading Level:</span>
                    <span className="text-white">{historyData[activeIndex].level}</span>
                  </div>
                )}

                {historyData[activeIndex].tone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Sliders className="w-4 h-4 text-[#2196F3]" />
                    <span className="text-[#A0A0A0]">Tone:</span>
                    <span className="text-white">{historyData[activeIndex].tone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-[#303030] border-[#454545] text-white hover:bg-[#404040] hover:text-white"
                  >
                    Restore
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-[#A0A0A0] hover:text-white">
                    Compare
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("prev")}
          disabled={activeIndex === 0}
          className="text-white hover:text-[#FF5722] disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Timeline track */}
        <div
          ref={constraintsRef}
          className="relative flex-1 h-8 bg-[#252525] rounded-full cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Timeline markers */}
          {historyData.map((_, index) => (
            <div
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                index <= activeIndex ? "bg-[#FF5722]" : "bg-[#454545]"
              }`}
              style={{ left: `${(index / (historyData.length - 1)) * 100}%` }}
            />
          ))}

          {/* Draggable scrubber */}
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              // Ensure final snap on drag end
              const percentage = x.get() / timelineWidth.current
              const finalIndex = Math.round(percentage * (historyData.length - 1))
              const snapX = (finalIndex / (historyData.length - 1)) * timelineWidth.current
              animate(x, snapX, { duration: 0.3, type: "spring", stiffness: 400 })
              setTimeout(() => setIsDragging(false), 100)
            }}
            style={{ x }}
            className="absolute top-[20%] -translate-y-[-50%] w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          />
          {/* Progress track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-[#FF5722] rounded-full"
            style={{ width: `${(activeIndex / (historyData.length - 1)) * 100}%` }}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("next")}
          disabled={activeIndex === historyData.length - 1}
          className="text-white hover:text-[#FF5722] disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
