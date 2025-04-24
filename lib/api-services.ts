// Path: lib/api-services.ts

import { AIRequest, AIResponse, AIServiceConfig } from "@/components/editor/context/types";

// Interface for AI services
export interface AIService {
  processText: (request: AIRequest) => Promise<AIResponse>;
  countTokens: (text: string) => number;
  estimateCost: (tokenCount: number) => number;
}

// OpenAI Service Implementation
export class OpenAIService implements AIService {
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig) {
    this.config = config;
  }
  
  async processText(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // This is a mock implementation - in a real app, you would call the OpenAI API
      console.log('OpenAI Processing:', request);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, return a modified version of the input
      let result = '';
      
      // Simple response generation based on instruction
      if (request.instruction.toLowerCase().includes('summarize')) {
        result = `# Summary\n\n- Key point from the text\n- Another important aspect\n- Final consideration`;
      } else if (request.instruction.toLowerCase().includes('simplify')) {
        result = request.content
          .split('.')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0)
          .map(sentence => this.simplify(sentence))
          .join('. ');
      } else if (request.instruction.toLowerCase().includes('polish')) {
        result = `I've polished your text for grammar and style:\n\n${request.content
          .replace(/\s+/g, ' ')
          .replace(/\b(i|I)\b(?!'m|'ve|'d|'ll|'s| am| have| had| will| shall| should| would| is)/g, 'I')
          .trim()}`;
      } else if (request.instruction.toLowerCase().includes('list')) {
        result = `${request.content.split('.').filter(sentence => sentence.trim().length > 0).map(sentence => `• ${sentence.trim()}`).join('\n')}`;
      } else {
        // Generic response
        result = `I've processed your text based on your instruction to "${request.instruction}".\n\nHere's the result:\n\n${request.content}`;
      }
      
      // Calculate token usage (simplified)
      const promptTokens = Math.ceil(request.content.length / 4) + request.instruction.length;
      const completionTokens = Math.ceil(result.length / 4);
      
      return {
        result,
        tokenUsage: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens
        },
        metadata: {
          modelUsed: this.config.model,
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('OpenAI Processing Error:', error);
      throw error;
    }
  }
  
  // Simple sentence simplification for demo
  private simplify(text: string): string {
    return text
      .replace(/\b(?:utilize|employ|leverage)\b/g, 'use')
      .replace(/\b(?:commence|initiate)\b/g, 'start')
      .replace(/\b(?:terminate|conclude)\b/g, 'end')
      .replace(/\b(?:ascertain|determine)\b/g, 'find')
      .replace(/\bin order to\b/g, 'to')
      .replace(/\bdue to the fact that\b/g, 'because')
      .replace(/\bprior to\b/g, 'before')
      .replace(/\bsubsequent to\b/g, 'after')
      .trim();
  }
  
  countTokens(text: string): number {
    // Simplified token counting - roughly 4 characters per token
    return Math.ceil(text.length / 4);
  }
  
  estimateCost(tokenCount: number): number {
    // Estimate cost based on current OpenAI pricing
    const rates: Record<string, number> = {
      'gpt-3.5-turbo': 0.0000015, // $0.0015 per 1000 tokens
      'gpt-4': 0.00003,           // $0.03 per 1000 tokens
      'gpt-4-turbo': 0.00001,     // $0.01 per 1000 tokens
      'default': 0.0000015
    };
    
    const rate = rates[this.config.model] || rates['default'];
    return tokenCount * rate;
  }
}

// Claude (Anthropic) Service Implementation
export class ClaudeService implements AIService {
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig) {
    this.config = config;
  }
  
  async processText(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // This is a mock implementation - in a real app, you would call the Anthropic API
      console.log('Claude Processing:', request);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // For demo purposes, generate a slightly different response style than OpenAI
      let result = '';
      
      // Simple response generation based on instruction
      if (request.instruction.toLowerCase().includes('summarize')) {
        result = `Summary of the document:\n\n1. Main point: The text discusses innovative technology.\n2. Supporting idea: User interaction is emphasized.\n3. Conclusion: This approach is transforming creative workflows.`;
      } else if (request.instruction.toLowerCase().includes('simplify')) {
        result = `I've simplified this for you:\n\n${request.content
          .split('.')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0)
          .map(sentence => this.simplify(sentence))
          .join('. ')}`;
      } else if (request.instruction.toLowerCase().includes('polish')) {
        result = `Here's your text with improved grammar and style:\n\n${request.content
          .replace(/\s+/g, ' ')
          .replace(/\b(i|I)\b(?!'m|'ve|'d|'ll|'s| am| have| had| will| shall| should| would| is)/g, 'I')
          .trim()}`;
      } else if (request.instruction.toLowerCase().includes('list')) {
        result = `I've converted your text to a list:\n\n${request.content.split('.').filter(sentence => sentence.trim().length > 0).map(sentence => `- ${sentence.trim()}`).join('\n')}`;
      } else {
        // Generic response
        result = `I've analyzed your text based on your request to "${request.instruction}".\n\nResult:\n\n${request.content}`;
      }
      
      // Calculate token usage (simplified)
      const promptTokens = Math.ceil(request.content.length / 4) + request.instruction.length;
      const completionTokens = Math.ceil(result.length / 4);
      
      return {
        result,
        tokenUsage: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens
        },
        metadata: {
          modelUsed: this.config.model,
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('Claude Processing Error:', error);
      throw error;
    }
  }
  
  // Simple sentence simplification for demo
  private simplify(text: string): string {
    return text
      .replace(/\b(?:utilize|employ|leverage)\b/g, 'use')
      .replace(/\b(?:commence|initiate)\b/g, 'start')
      .replace(/\b(?:terminate|conclude)\b/g, 'end')
      .replace(/\b(?:ascertain|determine)\b/g, 'find')
      .replace(/\bin order to\b/g, 'to')
      .replace(/\bdue to the fact that\b/g, 'because')
      .replace(/\bprior to\b/g, 'before')
      .replace(/\bsubsequent to\b/g, 'after')
      .trim();
  }
  
  countTokens(text: string): number {
    // Simplified token counting - roughly 4 characters per token
    return Math.ceil(text.length / 4);
  }
  
  estimateCost(tokenCount: number): number {
    // Estimate cost based on current Anthropic pricing
    const rates: Record<string, number> = {
      'claude-3-opus': 0.00003,    // $0.03 per 1000 tokens
      'claude-3-sonnet': 0.00001,  // $0.01 per 1000 tokens
      'claude-3-haiku': 0.000003,  // $0.003 per 1000 tokens
      'default': 0.00001
    };
    
    const rate = rates[this.config.model] || rates['default'];
    return tokenCount * rate;
  }
}

// Factory function to create appropriate service based on configuration
export function createAIService(config: AIServiceConfig): AIService {
  switch (config.serviceType) {
    case 'anthropic':
      return new ClaudeService(config);
    case 'openai':
    default:
      return new OpenAIService(config);
  }
}