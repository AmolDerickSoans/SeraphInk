// Path: components/text-editor.tsx (updated)

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Sliders, Type, Mic, Save, History, Sparkles, Terminal, ArrowLeftRight } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DifficultySlider } from "@/components/difficulty-slider"
import { ToneAdjuster } from "@/components/tone-adjuster"
import { ToolsPanel } from "@/components/tools-panel"
import { FormattingToolbar } from "@/components/formatting-toolbar"
import { Timeline } from "@/components/timeline"
import { useMobile } from "@/hooks/use-mobile"
import { EditorProvider } from "@/components/editor/context/EditorContext"
import { useEditorState } from "@/hooks/use-editor-state"
import { AIPanel } from "./editor/AIPanel/AIPanel"
import { CursorIDE } from "@/components/editor/CursorIDE/CursorIDE"
import { VersionDiff } from "@/components/editor/DiffViewer/VersionDiff"

// Inner editor component that uses the editor context
function TextEditorInner() {
  // Get state from context
  const { 
    document, 
    setDocument, 
    handleSelectionChange,
    isDiffMode,
    selectedVersions
  } = useEditorState();

  const [activePanel, setActivePanel] = useState<string | null>(null);
  
  const togglePanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  const [difficulty, setDifficulty] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useMobile();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options if needed
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontFamily,
      TextStyle,
      Underline,
    ],
    content: document.content,
    editorProps: {
      attributes: {
        class: "outline-none min-h-full text-[#121212] text-lg leading-relaxed max-w-4xl mx-auto prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Update document content
      setDocument(prev => ({
        ...prev,
        content: editor.getJSON()
      }));
    },
    onSelectionUpdate: ({ editor }) => {
      // Track selection changes
      const { from, to } = editor.state.selection;
      if (from !== to) {
        handleSelectionChange({
          from,
          to,
          text: editor.state.doc.textBetween(from, to, ' ')
        });
      }
    }
  });

  // Simulate saving animation
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Simulate voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  // Cleanup editor instance on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return null; // Or a loading indicator
  }

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Centered Floating Header - Positioned absolutely */}
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
              onClick={() => togglePanel('aiPanel')}
              className={cn(
                "text-white hover:text-[#FF5722] transition-colors",
                activePanel === 'aiPanel' && "text-[#FF5722]",
              )}
            >
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePanel('cursorIDE')}
              className={cn(
                "text-white hover:text-[#FF5722] transition-colors",
                activePanel === 'cursorIDE' && "text-[#FF5722]",
              )}
            >
              <Terminal className="w-5 h-5" />
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
            {isDiffMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePanel('versionDiff')}
                className={cn(
                  "text-white hover:text-[#FF5722] transition-colors",
                  activePanel === 'versionDiff' && "text-[#FF5722]",
                  (selectedVersions.left === null || selectedVersions.right === null) && "opacity-50"
                )}
                disabled={selectedVersions.left === null || selectedVersions.right === null}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Formatting Toolbar */}
        <AnimatePresence>
          {activePanel === 'formattingToolbar' && <FormattingToolbar editor={editor} />}
        </AnimatePresence>
      </motion.div>

      {/* Main Editor Canvas - Takes remaining space */}
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
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20">
            <DifficultySlider
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === 'toneAdjuster' && (
          <div className="fixed z-20">
            <ToneAdjuster onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel === 'toolsPanel' && (
          <div className="fixed z-20">
            <ToolsPanel onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* AI Panel - New addition */}
      <AnimatePresence>
        {activePanel === 'aiPanel' && (
          <div className="fixed z-20">
            <AIPanel onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Cursor IDE - New addition */}
      <AnimatePresence>
        {activePanel === 'cursorIDE' && (
          <div className="fixed z-20">
            <CursorIDE onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Timeline - Centered at bottom */}
      <AnimatePresence>
        {activePanel === 'timeline' && (
          <div className="fixed inset-x-0 bottom-0 flex items-center justify-center w-[80vw] mx-auto z-20">
            <Timeline historyData={[]} onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Version Diff Viewer - New addition */}
      <AnimatePresence>
        {activePanel === 'versionDiff' && (
          <div className="fixed z-30">
            <VersionDiff onClose={() => setActivePanel(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main exported component that provides the editor context
export default function TextEditor() {
  return (
    <EditorProvider>
      <TextEditorInner />
    </EditorProvider>
  );
}
