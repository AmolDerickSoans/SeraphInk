"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Sliders, Type, Mic, Save, History } from "lucide-react"
import { Editor } from "@tiptap/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormattingToolbar } from "@/components/formatting-toolbar"

interface EditorHeaderProps {
  editor: Editor | null
  activePanel: string | null
  togglePanel: (panelName: string) => void
  isRecording: boolean
  toggleRecording: () => void
  isSaved: boolean
  handleSave: () => void
}

export function EditorHeader({
  editor,
  activePanel,
  togglePanel,
  isRecording,
  toggleRecording,
  isSaved,
  handleSave,
}: EditorHeaderProps) {
  if (!editor) return null

  return (
    <motion.div
      className="fixed top-6 left-0 right-0 z-10 mx-auto bg-[#1A1A1A] rounded-xl shadow-xl flex flex-col overflow-hidden w-[90%] max-w-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePanel('toolsPanel')}
            className={cn("text-white hover:text-[#FF5722] transition-colors", activePanel === 'toolsPanel' && "text-[#FF5722]")}
          >
            <Type className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePanel('formattingToolbar')}
            className={cn(
              "text-white hover:text-[#FF5722] transition-colors",
              activePanel === 'formattingToolbar' && "text-[#FF5722]",
            )}
          >
            <span className="font-bold text-lg">T</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePanel('difficultySlider')}
            className={cn(
              "text-white hover:text-[#FF5722] transition-colors",
              activePanel === 'difficultySlider' && "text-[#FF5722]",
            )}
          >
            <BookOpen className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePanel('toneAdjuster')}
            className={cn("text-white hover:text-[#FF5722] transition-colors", activePanel === 'toneAdjuster' && "text-[#FF5722]")}
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
            onClick={() => togglePanel('timeline')}
            className={cn("text-white hover:text-[#FF5722] transition-colors", activePanel === 'timeline' && "text-[#FF5722]")}
          >
            <History className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Expandable Formatting Toolbar */}
      <AnimatePresence>
        {activePanel === 'formattingToolbar' && <FormattingToolbar editor={editor} />}
      </AnimatePresence>
    </motion.div>
  )
}