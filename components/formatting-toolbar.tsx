"use client"

// This component provides text formatting options that expand from the T button
// It includes font family, size, alignment, and text styling options

import { motion } from "framer-motion"
import {
  Bold,
  Italic,
  Underline,
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

export function FormattingToolbar() {
  const fontFamilies = [
    { value: "inter", label: "Inter" },
    { value: "georgia", label: "Georgia" },
    { value: "arial", label: "Arial" },
    { value: "courier", label: "Courier" },
    { value: "times", label: "Times New Roman" },
  ]

  const fontSizes = [
    { value: "12", label: "12px" },
    { value: "14", label: "14px" },
    { value: "16", label: "16px" },
    { value: "18", label: "18px" },
    { value: "20", label: "20px" },
    { value: "24", label: "24px" },
  ]

  return (
    <motion.div
      className="px-4 py-3 border-t border-[#2A2A2A] flex flex-wrap items-center gap-2"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Select defaultValue="inter">
        <SelectTrigger className="w-32 h-8 bg-[#252525] border-0 text-white text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent className="bg-[#252525] border-[#353535] text-white">
          {fontFamilies.map((font) => (
            <SelectItem key={font.value} value={font.value} className="text-white">
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="16">
        <SelectTrigger className="w-20 h-8 bg-[#252525] border-0 text-white text-xs">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent className="bg-[#252525] border-[#353535] text-white">
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value} className="text-white">
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-[#353535] mx-1"></div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-1"></div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-1"></div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-[#353535] mx-1"></div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-[#FF5722] hover:bg-[#252525]">
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
