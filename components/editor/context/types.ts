export interface SelectionRange {
    from: number;
    to: number;
    text: string;
  }
  
  export interface DocumentMetadata {
    title: string;
    readingLevel?: number;
    tone?: {
      formal: number; // -1 to 1 where -1 is casual, 1 is formal
      concise: number; // -1 to 1 where -1 is expanded, 1 is concise
    };
    lastModified?: Date;
  }
  
  export interface DocumentState {
    content: any; // TipTap JSON content
    currentVersion: string;
    selections: SelectionRange[];
    metadata: DocumentMetadata;
  }
  
  export interface VersionEntry {
    id: string;
    timestamp: Date;
    content: any; // TipTap JSON content
    parentId: string | null;
    type: 'user-edit' | 'ai-operation' | 'checkpoint';
    metadata: {
      operation?: string;
      readingLevel?: number;
      tone?: {
        formal: number;
        concise: number;
      };
      modelUsed?: string;
      instruction?: string;
      tokenUsage?: number;
    };
  }
  
  export interface AIServiceConfig {
    serviceType: 'openai' | 'anthropic' | 'local';
    endpoint: string;
    model: string;
    apiKey?: string;
    parameters: {
      temperature: number;
      maxTokens?: number;
    };
  }
  
  export interface AIRequest {
    content: string;
    instruction: string;
    contextType: 'full' | 'selection' | 'section';
    previousInteractions?: AIInteraction[];
  }
  
  export interface AIResponse {
    result: string;
    tokenUsage: {
      prompt: number;
      completion: number;
      total: number;
    };
    metadata: {
      modelUsed: string;
      processingTime: number;
    };
  }
  
  export interface AIInteraction {
    request: AIRequest;
    response: AIResponse;
    timestamp: Date;
  }
  
  export interface EditorContextType {
    document: DocumentState;
    setDocument: React.Dispatch<React.SetStateAction<DocumentState>>;
    versions: Record<string, VersionEntry>;
    createCheckpoint: (type: VersionEntry['type'], metadata?: any) => string;
    restoreVersion: (versionId: string) => boolean;
    aiConfig: AIServiceConfig;
    setAIConfig: React.Dispatch<React.SetStateAction<AIServiceConfig>>;
    processWithAI: (instruction: string, contextType?: AIRequest['contextType']) => Promise<AIResponse>;
    aiInteractions: AIInteraction[];
    handleSelectionChange: (selection: SelectionRange | null) => void;
    isDiffMode: boolean;
    setIsDiffMode: React.Dispatch<React.SetStateAction<boolean>>;
    selectedVersions: {
      left: string | null;
      right: string | null;
    };
    setSelectedVersions: React.Dispatch<React.SetStateAction<{
      left: string | null;
      right: string | null;
    }>>;
  }
  