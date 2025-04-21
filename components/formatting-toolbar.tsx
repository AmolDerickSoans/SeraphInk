"use client"

// This component provides text formatting options that expand from the T button
// It includes font family, size, alignment, and text styling options

import { motion } from "framer-motion"
import type { Editor } from "@tiptap/react" // Import Editor type
import {
  Bold,
  Italic,
  Underline,
  Strikethrough, // Add Strikethrough
  Highlighter, // Add Highlighter for the new button
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle" // Use Toggle for active states
import { cn } from "@/lib/utils" // Import cn for conditional classes

// Define props interface
interface FormattingToolbarProps {
  editor: Editor | null
}

export function FormattingToolbar({ editor }: FormattingToolbarProps) {
  if (!editor) {
    return null
  }

  const fontFamilies = [
    { value: "Inter", label: "Inter" }, // Use actual font names
    { value: "Georgia", label: "Georgia" },
    { value: "Arial", label: "Arial" },
    { value: "Courier New", label: "Courier New" }, // Use actual font names
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Verdana", label: "Verdana" },
  ]

  // Font sizes - Tiptap doesn't have a direct font size extension in starter kit.
  // We'll skip this for now to keep it simpler, but it could be added with custom extensions or marks.
  // const fontSizes = [
  //   { value: "12", label: "12px" },
  //   { value: "14", label: "14px" },
  //   { value: "16", label: "16px" },
  //   { value: "18", label: "18px" },
  //   { value: "20", label: "20px" },
  //   { value: "24", label: "24px" },
  // ]

  // Helper for Toggle button styling
  const toggleVariants = {
    default: "text-white hover:text-[#FF5722] hover:bg-[#252525]",
    active: "bg-[#252525] text-[#FF5722]",
  }

  return (
    <motion.div
      className="px-4 py-3 border-t border-[#2A2A2A] flex flex-wrap items-center gap-1" // Reduced gap
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Font Family Select */}
      <Select
        value={editor.isActive("textStyle") ? editor.getAttributes("textStyle").fontFamily || "Inter" : "Inter"}
        onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
      >
        <SelectTrigger className="w-32 h-8 bg-[#252525] border-0 text-white text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent className="bg-[#252525] border-[#353535] text-white">
          {fontFamilies.map((font) => (
            <SelectItem key={font.value} value={font.value} className="text-white focus:bg-[#353535]">
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size Select - Placeholder for now */}
      {/* <Select defaultValue="16"> ... </Select> */}

      <div className="h-6 w-px bg-[#353535] mx-2"></div>

      {/* Basic Styles */}
      <div className="flex items-center gap-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className={cn(toggleVariants.default, editor.isActive("bold") && toggleVariants.active)}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className={cn(toggleVariants.default, editor.isActive("italic") && toggleVariants.active)}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(toggleVariants.default, editor.isActive("underline") && toggleVariants.active)}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          className={cn(toggleVariants.default, editor.isActive("strike") && toggleVariants.active)}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
         <Toggle
          size="sm"
          pressed={editor.isActive("highlight")}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          className={cn(toggleVariants.default, editor.isActive("highlight") && toggleVariants.active)}
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-2"></div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(toggleVariants.default, editor.isActive({ textAlign: "left" }) && toggleVariants.active)}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(toggleVariants.default, editor.isActive({ textAlign: "center" }) && toggleVariants.active)}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(toggleVariants.default, editor.isActive({ textAlign: "right" }) && toggleVariants.active)}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn(toggleVariants.default, editor.isActive({ textAlign: "justify" }) && toggleVariants.active)}
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-2"></div>

      {/* Lists */}
      <div className="flex items-center gap-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(toggleVariants.default, editor.isActive("bulletList") && toggleVariants.active)}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(toggleVariants.default, editor.isActive("orderedList") && toggleVariants.active)}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-2"></div>

      {/* Headings */}
      <div className="flex items-center gap-0.5">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(toggleVariants.default, editor.isActive("heading", { level: 1 }) && toggleVariants.active)}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(toggleVariants.default, editor.isActive("heading", { level: 2 }) && toggleVariants.active)}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(toggleVariants.default, editor.isActive("heading", { level: 3 }) && toggleVariants.active)}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
      </div>
    </motion.div>
  )
}
