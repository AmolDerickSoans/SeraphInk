"use client"

// This is the main editor component that orchestrates all the floating UI elements
// It manages the state of which panels are visible and handles the core text editing functionality

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Sliders, Type, Mic, Save, History } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DifficultySlider } from "@/components/difficulty-slider"
import { ToneAdjuster } from "@/components/tone-adjuster"
import { ToolsPanel } from "@/components/tools-panel"
import { FormattingToolbar } from "@/components/formatting-toolbar"
import { Timeline } from "@/components/timeline"
import { useMobile } from "@/hooks/use-mobile"

const sampleText = `Introducing the next-generation text editor, an innovative, AI-driven writing tool that reimagines the creative process as an intuitive and interactive experience. Users begin with a simple input—keywords, a topic, or a prompt—and the AI generates an initial draft. From there, users refine and sculpt the text using a blend of gestures, parameter adjustments, voice commands, and real-time feedback.`

// Sample history data for the timeline
const historyData = [
  {
    id: 1,
    timestamp: "10:30 AM",
    content: "Initial draft generated from prompt",
    level: "College",
    tone: "Professional",
  },
  {
    id: 2,
    timestamp: "10:32 AM",
    content: "Adjusted to college reading level",
    level: "College",
    tone: "Professional",
  },
  { id: 3, timestamp: "10:35 AM", content: "Changed tone to professional", level: "High School", tone: "Casual" },
  { id: 4, timestamp: "10:38 AM", content: "Expanded introduction paragraph", level: "Graduate", tone: "Technical" },
  { id: 5, timestamp: "10:40 AM", content: "Added technical details", level: "Graduate", tone: "Technical" },
  {
    id: 6,
    timestamp: "10:45 AM",
    content: "Simplified conclusion for clarity",
    level: "Middle School",
    tone: "Casual",
  },
]

export default function TextEditor() {
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)
  const [showDifficultySlider, setShowDifficultySlider] = useState(false)
  const [showToneAdjuster, setShowToneAdjuster] = useState(false)
  const [showToolsPanel, setShowToolsPanel] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [difficulty, setDifficulty] = useState(3)
  const [text, setText] = useState(sampleText)
  const [isRecording, setIsRecording] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Simulate saving animation
  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  // Simulate voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000)
    }
  }

  // Handle pinch to zoom (simplified simulation)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        // Simulate pinch zoom by adjusting font size
        const currentSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        const newSize = e.deltaY > 0 ? Math.max(14, currentSize - 1) : Math.min(24, currentSize + 1)
        document.documentElement.style.fontSize = `${newSize}px`
      }
    }

    document.addEventListener("wheel", handleWheel, { passive: false })
    return () => document.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Editor Canvas - Full Screen */}
      <div ref={editorRef} className="w-full h-full bg-white p-8 overflow-auto">
        <div
          contentEditable
          className="outline-none min-h-full text-[#121212] text-lg leading-relaxed max-w-4xl mx-auto"
          suppressContentEditableWarning={true}
        >
          {text}
        </div>
      </div>

      {/* Centered Floating Header */}
      <motion.div
        className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] rounded-xl shadow-xl flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowToolsPanel(!showToolsPanel)}
              className={cn("text-white hover:text-[#FF5722] transition-colors", showToolsPanel && "text-[#FF5722]")}
            >
              <Type className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
              className={cn(
                "text-white hover:text-[#FF5722] transition-colors",
                showFormattingToolbar && "text-[#FF5722]",
              )}
            >
              <span className="font-bold text-lg">T</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDifficultySlider(!showDifficultySlider)}
              className={cn(
                "text-white hover:text-[#FF5722] transition-colors",
                showDifficultySlider && "text-[#FF5722]",
              )}
            >
              <BookOpen className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowToneAdjuster(!showToneAdjuster)}
              className={cn("text-white hover:text-[#FF5722] transition-colors", showToneAdjuster && "text-[#FF5722]")}
            >
              <Sliders className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                "text-white hover:text-[#FF5722] transition-colors",
                isRecording && "text-[#FF5722] animate-pulse",
              )}
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn("text-white hover:text-[#FF5722] transition-colors", isSaved && "text-[#4CAF50]")}
            >
              <Save className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTimeline(!showTimeline)}
              className={cn("text-white hover:text-[#FF5722] transition-colors", showTimeline && "text-[#FF5722]")}
            >
              <History className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Expandable Formatting Toolbar */}
        <AnimatePresence>{showFormattingToolbar && <FormattingToolbar />}</AnimatePresence>
      </motion.div>

      {/* Voice Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Mic className="w-4 h-4 text-[#FF5722]" />
            <span>Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Indicator */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            className="absolute top-20 right-8 bg-[#4CAF50] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <span>Changes saved</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Panels */}
      <AnimatePresence>
        {showDifficultySlider && (
          <DifficultySlider
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onClose={() => setShowDifficultySlider(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToneAdjuster && <ToneAdjuster onClose={() => setShowToneAdjuster(false)} />}
      </AnimatePresence>

      <AnimatePresence>{showToolsPanel && <ToolsPanel onClose={() => setShowToolsPanel(false)} />}</AnimatePresence>

      {/* Timeline */}
      <AnimatePresence>
        {showTimeline && <Timeline historyData={historyData} onClose={() => setShowTimeline(false)} />}
      </AnimatePresence>
    </div>
  )
}
