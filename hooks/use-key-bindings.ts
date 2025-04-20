"use client"

import { useEffect, useRef } from "react"

type KeyCombination = string
type Callback = () => void

interface KeyBindings {
  keys: KeyCombination[]
  callback: Callback
}

export function useKeyBindings(
  shortcuts: KeyBindings[],
  deps: React.DependencyList = []
) {
  // Create a ref to store the current shortcuts
  const shortcutsRef = useRef(shortcuts)

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    // Function to normalize key names
    const normalizeKey = (key: string): string => {
      if (key === "+" || key === "plus") return "Plus"
      if (key === "-" || key === "minus") return "Minus"
      return key
    }

    // Parse a key combination string into its components
    const parseKeyCombination = (combination: string): string[] => {
      return combination.split("+").map(key => normalizeKey(key.trim()))
    }

    // Check if the event matches a key combination
    const matchesKeyCombination = (event: KeyboardEvent, combination: string): boolean => {
      const keys = parseKeyCombination(combination)
      
      // Check if modifiers match
      const hasCtrl = keys.includes("Control") || keys.includes("Ctrl")
      const hasAlt = keys.includes("Alt")
      const hasShift = keys.includes("Shift")
      const hasMeta = keys.includes("Meta") || keys.includes("Cmd")
      
      if (hasCtrl !== event.ctrlKey) return false
      if (hasAlt !== event.altKey) return false
      if (hasShift !== event.shiftKey) return false
      if (hasMeta !== event.metaKey) return false
      
      // Check for the main key
      const mainKeys = keys.filter(
        key => !["Control", "Ctrl", "Alt", "Shift", "Meta", "Cmd"].includes(key)
      )
      
      // If there's a specific key to check
      if (mainKeys.length > 0) {
        // Consider ArrowUp, ArrowDown, etc.
        const eventKey = normalizeKey(event.key)
        return mainKeys.some(key => key === eventKey)
      }
      
      return true
    }

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcutsRef.current) {
        for (const keyCombination of shortcut.keys) {
          if (matchesKeyCombination(event, keyCombination)) {
            event.preventDefault()
            shortcut.callback()
            return
          }
        }
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown)

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, deps)
}