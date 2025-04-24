// Path: components/editor/context/EditorContext.tsx (complete)

import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { generateId } from "@/lib/utils";
import { createAIService } from "@/lib/api-services";
import { 
  DocumentState, 
  VersionEntry, 
  EditorContextType, 
  SelectionRange,
  AIServiceConfig,
  AIRequest,
  AIResponse,
  AIInteraction
} from "./types";

// Create the context with default values
export const EditorContext = createContext<EditorContextType>({
  document: {
    content: {},
    currentVersion: "initial",
    selections: [],
    metadata: { title: "Untitled Document" }
  },
  setDocument: () => {},
  versions: {},
  createCheckpoint: () => "",
  restoreVersion: () => false,
  aiConfig: {
    serviceType: "openai",
    endpoint: "/api/ai",
    model: "gpt-3.5-turbo",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
    }
  },
  setAIConfig: () => {},
  processWithAI: async () => ({
    result: "",
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
    metadata: { modelUsed: "", processingTime: 0 }
  }),
  aiInteractions: [],
  handleSelectionChange: () => {},
  isDiffMode: false,
  setIsDiffMode: () => {},
  selectedVersions: { left: null, right: null },
  setSelectedVersions: () => {}
});

// Sample initial content for the editor
const initialContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Introducing the next-generation text editor, an innovative, AI-driven writing tool that reimagines the creative process as an intuitive and interactive experience. Users begin with a simple input—keywords, a topic, or a prompt—and the AI generates an initial draft. From there, users refine and sculpt the text using a blend of gestures, parameter adjustments, voice commands, and real-time feedback."
        }
      ]
    }
  ]
};

// Provider component that wraps the app
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core document state
  const [document, setDocument] = useState<DocumentState>({
    content: initialContent,
    currentVersion: "initial",
    selections: [],
    metadata: { 
      title: "Untitled Document",
      readingLevel: 3, // Default reading level (College)
      tone: {
        formal: 0,
        concise: 0
      }
    }
  });
  
  // Version history
  const [versions, setVersions] = useState<Record<string, VersionEntry>>({
    initial: {
      id: "initial",
      timestamp: new Date(),
      content: initialContent,
      parentId: null,
      type: "checkpoint",
      metadata: {
        readingLevel: 3,
        tone: {
          formal: 0,
          concise: 0
        }
      }
    }
  });

  // AI configuration
  const [aiConfig, setAIConfig] = useState<AIServiceConfig>({
    serviceType: "openai",
    endpoint: "/api/ai",
    model: "gpt-3.5-turbo",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
    }
  });

  // AI interaction history
  const [aiInteractions, setAiInteractions] = useState<AIInteraction[]>([]);

  // Diff mode and selected versions for comparison
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<{
    left: string | null;
    right: string | null;
  }>({
    left: null,
    right: null
  });
  
  // Create AI service based on current config
  const aiService = useMemo(() => createAIService(aiConfig), [aiConfig]);
  
  // Create a checkpoint in version history
  const createCheckpoint = useCallback((type: VersionEntry['type'], metadata = {}) => {
    const id = generateId();
    const newVersion: VersionEntry = {
      id,
      timestamp: new Date(),
      content: document.content,
      parentId: document.currentVersion,
      type,
      metadata: {
        ...document.metadata,
        ...metadata
      }
    };
    
    setVersions(prev => ({
      ...prev,
      [id]: newVersion
    }));
    
    setDocument(prev => ({
      ...prev,
      currentVersion: id
    }));
    
    return id;
  }, [document]);
  
  // Restore to a previous version
  const restoreVersion = useCallback((versionId: string) => {
    if (!versions[versionId]) return false;
    
    const restoredContent = versions[versionId].content;
    const restorationVersion = createCheckpoint('checkpoint', {
      operation: 'restored',
      restoredFrom: versionId
    });
    
    setDocument(prev => ({
      ...prev,
      content: restoredContent,
      currentVersion: restorationVersion
    }));
    
    return true;
  }, [versions, createCheckpoint]);
  
  // Selection tracking
  const handleSelectionChange = useCallback((selection: SelectionRange | null) => {
    if (selection) {
      setDocument(prev => ({
        ...prev,
        selections: [selection] // Only track current selection
      }));
    }
  }, []);

  // Prepare context based on selection or full document
  const prepareContextForAI = useCallback((contextType: AIRequest['contextType']) => {
    switch (contextType) {
      case 'selection':
        if (document.selections.length > 0) {
          return document.selections[0].text;
        }
        return convertContentToText(document.content);
      case 'section':
        // For now, just return the paragraph containing the selection
        return document.selections.length > 0 
          ? document.selections[0].text
          : convertContentToText(document.content);
      case 'full':
      default:
        return convertContentToText(document.content);
    }
  }, [document]);

  // Convert TipTap content to text
  const convertContentToText = (content: any): string => {
    // Simple implementation - can be expanded for more complex documents
    let text = '';
    
    if (!content || !content.content) return text;
    
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
    
    content.content.forEach(traverse);
    return text.trim();
  };

  // AI processing function using our service layer
  const processWithAI = async (instruction: string, contextType: AIRequest['contextType'] = 'full') => {
    // Create checkpoint before AI processing
    const checkpointId = createCheckpoint('ai-operation', {
      operation: 'before-ai',
      instruction
    });
    
    // Prepare context based on selection or full document
    const contentForAI = prepareContextForAI(contextType);
    
    try {
      // Create the request object
      const request: AIRequest = {
        content: contentForAI,
        instruction,
        contextType,
        previousInteractions: aiInteractions.slice(-3) // Include last 3 interactions for context
      };
      
      // Process with AI service
      const response = await aiService.processText(request);
      
      // Store interaction in history
      const interaction: AIInteraction = {
        request,
        response,
        timestamp: new Date()
      };
      
      setAiInteractions(prev => [...prev, interaction]);
      
      // Create checkpoint after AI processing
      createCheckpoint('ai-operation', {
        operation: 'after-ai',
        instruction,
        modelUsed: aiConfig.model,
        tokenUsage: response.tokenUsage.total
      });
      
      return response;
    } catch (error) {
      // Handle error and potentially restore to previous checkpoint
      restoreVersion(checkpointId);
      throw error;
    }
  };

  // Provide context to components
  const contextValue: EditorContextType = {
    document,
    setDocument,
    versions,
    createCheckpoint,
    restoreVersion,
    aiConfig,
    setAIConfig,
    processWithAI,
    aiInteractions,
    handleSelectionChange,
    isDiffMode,
    setIsDiffMode,
    selectedVersions,
    setSelectedVersions
  };
  
  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};