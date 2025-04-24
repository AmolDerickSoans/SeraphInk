import React from "react";
import { motion } from "framer-motion";
import { X, ArrowLeftRight, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorState } from "@/hooks/use-editor-state";
import { VersionEntry } from "../context/types";

interface VersionDiffProps {
  onClose: () => void;
}

export function VersionDiff({ onClose }: VersionDiffProps) {
  const { versions, selectedVersions, restoreVersion } = useEditorState();
  
  // Get the version entries if they exist
  const leftVersion = selectedVersions.left ? versions[selectedVersions.left] : null;
  const rightVersion = selectedVersions.right ? versions[selectedVersions.right] : null;
  
  // Convert TipTap JSON to text for display
  const getVersionText = (version: VersionEntry | null): string => {
    if (!version) return '';
    
    let text = '';
    
    if (!version.content || !version.content.content) return text;
    
    // Recursively traverse the document structure
    const traverse = (node: any) => {
      if (node.text) {
        text += node.text;
      }
      
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
      
      // Add newline after paragraphs and headings
      if (node.type === 'paragraph' || node.type?.startsWith('heading')) {
        text += '\n\n';
      }
    };
    
    version.content.content.forEach(traverse);
    return text.trim();
  };
  
  const leftText = getVersionText(leftVersion);
  const rightText = getVersionText(rightVersion);
  
  // Function to handle version restoration
  const handleRestore = (versionId: string) => {
    restoreVersion(versionId);
    onClose();
  };
  
  if (!leftVersion || !rightVersion) {
    return (
      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto mb-8 max-w-3xl bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex flex-col items-center justify-center text-white">
          <FileText className="w-12 h-12 text-[#FF5722] mb-4" />
          <h3 className="text-xl font-medium mb-2">No versions selected</h3>
          <p className="text-[#A0A0A0] mb-4 text-center">
            Please select two versions to compare from the timeline.
          </p>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
          >
            Close
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 mx-auto mb-8 max-w-5xl h-[500px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-white font-medium">Version Comparison</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:text-[#FF5722]"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left version */}
        <div className="flex-1 border-r border-[#2A2A2A] flex flex-col">
          <div className="p-3 bg-[#252525] border-b border-[#2A2A2A] flex justify-between items-center">
            <div>
              <div className="text-white text-sm font-medium">
                {new Date(leftVersion.timestamp).toLocaleString()}
              </div>
              <div className="text-[#A0A0A0] text-xs flex items-center gap-1">
                <span>{leftVersion.type}</span>
                {leftVersion.metadata.operation && (
                  <span>• {leftVersion.metadata.operation}</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestore(leftVersion.id)}
              className="h-8 border-[#2A2A2A] text-white hover:bg-[#2A2A2A] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-[#202020] text-white font-mono text-sm whitespace-pre-wrap">
            {leftText}
          </div>
        </div>
        
        {/* Right version */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 bg-[#252525] border-b border-[#2A2A2A] flex justify-between items-center">
            <div>
              <div className="text-white text-sm font-medium">
                {new Date(rightVersion.timestamp).toLocaleString()}
              </div>
              <div className="text-[#A0A0A0] text-xs flex items-center gap-1">
                <span>{rightVersion.type}</span>
                {rightVersion.metadata.operation && (
                  <span>• {rightVersion.metadata.operation}</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestore(rightVersion.id)}
              className="h-8 border-[#2A2A2A] text-white hover:bg-[#2A2A2A] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-[#202020] text-white font-mono text-sm whitespace-pre-wrap">
            {rightText}
          </div>
        </div>
      </div>
    </motion.div>
  );
}