// Path: components/editor/AIPanel/AIPanel.tsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditorState } from "@/hooks/use-editor-state";
import { countTokens, estimateCost } from "@/lib/utils";
import { AIRequest } from "../context/types";

interface AIPanelProps {
  onClose: () => void;
}

export function AIPanel({ onClose }: AIPanelProps) {
  const { aiConfig, setAIConfig, processWithAI, document } = useEditorState();
  const [prompt, setPrompt] = useState("");
  const [contextType, setContextType] = useState<AIRequest['contextType']>('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [costEstimate, setCostEstimate] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debug: log when panel renders and key state
  console.log("[AIPanel] Rendered", {
    prompt,
    contextType,
    isProcessing,
    tokenCount,
    costEstimate,
    aiConfig,
    document,
    onCloseType: typeof onClose
  });
  
  // Available models
  const models = [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "OpenAI" },
    { value: "gpt-4", label: "GPT-4", provider: "OpenAI" },
    { value: "claude-3-opus", label: "Claude 3 Opus", provider: "Anthropic" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet", provider: "Anthropic" }
  ];

  // Quick prompt templates
  const promptTemplates = [
    { name: "Summarize", prompt: "Summarize this text in bullet points" },
    { name: "Simplify", prompt: "Simplify this text to make it easier to understand" },
    { name: "Polish", prompt: "Improve the grammar and style of this text" },
    { name: "Format", prompt: "Convert this text to a bulleted list" }
  ];
  
  // Update token count when prompt or context type changes
  useEffect(() => {
    // Simplified token estimation
    const documentTokens = document.selections.length > 0 && contextType === 'selection'
      ? countTokens(document.selections[0].text)
      : countTokens(JSON.stringify(document.content));
    
    const promptTokens = countTokens(prompt);
    const total = documentTokens + promptTokens;
    
    setTokenCount(total);
    setCostEstimate(estimateCost(total, aiConfig.model));
  }, [prompt, contextType, document, aiConfig.model]);
  
  // Handle model change
  const handleModelChange = (model: string) => {
    setAIConfig(prev => ({
      ...prev,
      model
    }));
  };
  
  // Execute AI operation
  const handleProcess = async () => {
    if (!prompt.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await processWithAI(prompt, contextType);
      console.log("AI Response:", response);
      setPrompt("");
    } catch (error) {
      console.error("AI processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 w-[350px] bg-[#1A1A1A] backdrop-blur-md rounded-xl shadow-2xl flex flex-col z-[9999]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-white font-medium">AI Assistant</h3>
          <span className="text-xs bg-[#353535] text-white px-2 py-0.5 rounded">Beta</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-[#FF5722]">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b border-[#2A2A2A]">
        <div className="mb-4">
          <label className="block text-sm text-white font-medium mb-1">Model</label>
          <Select
            value={aiConfig.model}
            onValueChange={handleModelChange}
          >
            <SelectTrigger className="bg-[#252525] border-[#3A3A3A] text-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-[#252525] border-[#3A3A3A] text-white">
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value} className="text-white focus:bg-[#353535]">
                  {model.label} ({model.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-white font-medium mb-1">Context</label>
          <div className="flex gap-2">
            <Button
              variant={contextType === 'selection' ? "default" : "outline"}
              size="sm"
              onClick={() => setContextType('selection')}
              className={contextType === 'selection' ? "bg-[#FF5722] hover:bg-[#E64A19]" : "bg-[#252525] border-[#3A3A3A] text-white"}
            >
              Selection
            </Button>
            <Button
              variant={contextType === 'full' ? "default" : "outline"}
              size="sm"
              onClick={() => setContextType('full')}
              className={contextType === 'full' ? "bg-[#FF5722] hover:bg-[#E64A19]" : "bg-[#252525] border-[#3A3A3A] text-white"}
            >
              Full Document
            </Button>
          </div>
        </div>
        
        <div 
          className="flex justify-between items-center mb-2 text-[#A0A0A0] cursor-pointer"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="text-xs">Advanced settings</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </div>
        
        {showAdvanced && (
          <motion.div
            className="mb-4 bg-[#252525] p-3 rounded-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-xs text-[#A0A0A0] mb-1">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={aiConfig.parameters.temperature}
                onChange={(e) => setAIConfig(prev => ({
                  ...prev,
                  parameters: {
                    ...prev.parameters,
                    temperature: parseFloat(e.target.value)
                  }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#A0A0A0]">
                <span>Precise</span>
                <span>{aiConfig.parameters.temperature}</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-[#A0A0A0] mb-1">Max tokens</label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={aiConfig.parameters.maxTokens}
                onChange={(e) => setAIConfig(prev => ({
                  ...prev,
                  parameters: {
                    ...prev.parameters,
                    maxTokens: parseInt(e.target.value)
                  }
                }))}
                className="w-full bg-[#353535] text-white border-[#3A3A3A] rounded-md p-1 text-xs"
              />
            </div>
          </motion.div>
        )}
        
        <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
          <span>Estimated tokens: {tokenCount}</span>
          <span>Est. cost: ${costEstimate.toFixed(6)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <label className="block text-sm text-white font-medium mb-1">Instruction</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What would you like the AI to do with your text?"
          className="w-full h-24 bg-[#252525] border-[#3A3A3A] text-white resize-none mb-4"
          disabled={isProcessing}
        />
        
        <Button
          onClick={handleProcess}
          disabled={isProcessing || !prompt.trim()}
          className="w-full bg-[#FF5722] hover:bg-[#E64A19] mb-4"
        >
          {isProcessing ? 'Processing...' : 'Process with AI'}
        </Button>
        
        <div className="mb-4">
          <div className="text-sm text-white font-medium mb-2">Quick actions</div>
          <div className="grid grid-cols-2 gap-2">
            {promptTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(template.prompt)}
                disabled={isProcessing}
                className="justify-start text-left bg-[#252525] border-[#3A3A3A] text-white hover:bg-[#353535] hover:text-white"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[#A0A0A0] text-xs">
          <Info className="w-3 h-3" />
          <span>AI outputs can be misleading or wrong</span>
        </div>
      </div>
    </motion.div>
  );
}
