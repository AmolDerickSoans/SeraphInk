import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Terminal, Play, Pause, RotateCcw, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorState } from "@/hooks/use-editor-state";
import { cn } from "@/lib/utils";

interface CursorIDEProps {
  onClose: () => void;
}

export function CursorIDE({ onClose }: CursorIDEProps) {
  const { processWithAI } = useEditorState();
  const [command, setCommand] = useState("");
  const [executing, setExecuting] = useState(false);
  const [history, setHistory] = useState<Array<{
    command: string;
    response: string;
    timestamp: Date;
    status: 'success' | 'error';
  }>>([]);
  
  const commandInputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of history when new commands are executed
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Focus command input on mount
  useEffect(() => {
    if (commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, []);
  
  const handleExecute = async () => {
    if (!command.trim() || executing) return;
    
    setExecuting(true);
    
    try {
      // Use the AI to process the command
      const response = await processWithAI(command, 'full');
      
      setHistory(prev => [
        ...prev,
        {
          command,
          response: response.result,
          timestamp: new Date(),
          status: 'success'
        }
      ]);
      
      setCommand("");
    } catch (error) {
      setHistory(prev => [
        ...prev,
        {
          command,
          response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
          status: 'error'
        }
      ]);
    } finally {
      setExecuting(false);
      // Focus back on input after execution
      setTimeout(() => {
        if (commandInputRef.current) {
          commandInputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <motion.div
      className="absolute right-8 bottom-20 w-[450px] h-[350px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-3 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-white font-medium">Agent Workspace</h3>
          <span className="text-xs bg-[#353535] text-white px-2 py-0.5 rounded">Beta</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-[#FF5722]"
            onClick={() => setHistory([])}
            title="Clear history"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-[#FF5722]"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-3 bg-[#121212] font-mono text-sm">
        {history.length === 0 ? (
          <div className="text-[#808080] text-xs p-2">
            Type an agent command below. Try "analyze this document" or "improve the structure".
          </div>
        ) : (
          history.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-start">
                <span className="text-[#FF5722] mr-2">$</span>
                <span className="text-[#E0E0E0]">{item.command}</span>
              </div>
              <div className={cn(
                "mt-1 p-2 rounded-md whitespace-pre-wrap",
                item.status === 'success' ? 'bg-[#1E1E1E] text-[#A0A0A0]' : 'bg-[#301515] text-[#FF8A80]'
              )}>
                {item.response}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-[#606060]">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-[#606060] hover:text-white"
                    onClick={() => copyToClipboard(item.response)}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={historyEndRef} />
      </div>
      
      <div className="border-t border-[#2A2A2A] p-3 flex items-center">
        <span className="text-[#FF5722] mr-2">$</span>
        <input
          ref={commandInputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a command..."
          className="flex-1 bg-transparent outline-none text-white"
          disabled={executing}
        />
        <Button
          variant={executing ? "outline" : "default"}
          size="sm"
          onClick={handleExecute}
          disabled={executing || !command.trim()}
          className={cn(
            "ml-2", 
            executing
              ? "bg-transparent text-white border-[#2A2A2A]"
              : "bg-[#FF5722] hover:bg-[#E64A19]"
          )}
        >
          {executing ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {executing ? 'Running' : 'Run'}
        </Button>
      </div>
    </motion.div>
  );
}