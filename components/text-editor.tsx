"use client"

// This is the main editor component that orchestrates all the floating UI elements
// It manages the state of which panels are visible and handles the core text editing functionality

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"
import { useEditor, EditorContent, EditorProvider } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import TextStyle from "@tiptap/extension-text-style" // Needed for FontFamily
import Underline from "@tiptap/extension-underline" // Import Underline

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DifficultySlider } from "@/components/difficulty-slider"
import { ToneAdjuster } from "@/components/tone-adjuster"
import { ToolsPanel } from "@/components/tools-panel"
import { EditorHeader } from "@/components/editor-header"
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
  const [activePanel, setActivePanel] = useState<string | null>(null)
  
  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName)
  }
  const [difficulty, setDifficulty] = useState(3)
  // const [text, setText] = useState(sampleText) // Managed by Tiptap now
  const [isRecording, setIsRecording] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  // const editorRef = useRef<HTMLDivElement>(null) // Tiptap manages the editor ref
  const isMobile = useMobile()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options if needed
        // e.g., disable some default extensions
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"], // Apply alignment to headings and paragraphs
      }),
      FontFamily,
      TextStyle, // Required by FontFamily
      Underline, // Add Underline extension
    ],
    content: sampleText, // Set initial content
    editorProps: {
      attributes: {
        // Apply Tailwind classes for styling the editor content area
        class: "outline-none min-h-full text-[#121212] text-lg leading-relaxed max-w-4xl mx-auto prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  })

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

  // Remove the old pinch-to-zoom simulation
  // useEffect(() => { ... }, [])

  // Cleanup editor instance on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) {
    return null // Or a loading indicator
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Editor Header */}
      <EditorHeader
        editor={editor}
        activePanel={activePanel}
        togglePanel={togglePanel}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        isSaved={isSaved}
        handleSave={handleSave}
      />

      {/* Main Editor Canvas - Takes remaining space */}
      {/* Use EditorContent for the Tiptap editor */}
      <div className="flex-grow w-full bg-white pt-24 px-8 pb-8 overflow-auto">
         <EditorContent editor={editor} />
      </div>


      {/* Voice Recording Indicator - Positioned absolutely */}
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

      {/* Floating Panels - Positioned absolutely */}
      <AnimatePresence>
        {activePanel === 'difficultySlider' && (
          // Ensure panels have high z-index to appear above editor
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20">
            <DifficultySlider
              difficulty={difficulty}
              setDifficulty={setDifficulty} // This might need adjustment depending on how difficulty interacts with Tiptap
              // onClose={() => setActivePanel(null)} // Removed as per TS error
            />
          </div>
        )}
      </AnimatePresence>

      {/* Ensure panels have high z-index */}
      <AnimatePresence>
        {activePanel === 'toneAdjuster' && <div className="fixed z-20"><ToneAdjuster onClose={() => setActivePanel(null)} /></div>}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === 'toolsPanel' && <div className="fixed z-20"><ToolsPanel onClose={() => setActivePanel(null)} /></div>}
      </AnimatePresence>

      {/* Timeline - Centered at bottom, ensure high z-index */}
      <AnimatePresence>
        {activePanel === 'timeline' && (
          <div className="fixed inset-x-0 bottom-0 flex items-center justify-center w-[80vw] mx-auto z-20">
            <Timeline historyData={historyData} onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
