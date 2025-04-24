import { useContext } from "react";
import { EditorContext } from "@/components/editor/context/EditorContext";
import type { EditorContextType } from "@/components/editor/context/types";

/**
 * Custom hook to access the editor state context
 * @returns The editor context state and functions
 */
export const useEditorState = (): EditorContextType => {
  const context = useContext(EditorContext);
  
  if (context === undefined) {
    throw new Error("useEditorState must be used within an EditorProvider");
  }
  
  return context;
};