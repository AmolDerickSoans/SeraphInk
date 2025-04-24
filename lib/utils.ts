import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Count tokens for estimation (simplified)
export function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Estimate cost based on token count and model
export function estimateCost(tokenCount: number, model: string): number {
  // Simplified cost estimation
  const rates: Record<string, number> = {
    'gpt-3.5-turbo': 0.0000015, // $0.0015 per 1000 tokens
    'gpt-4': 0.00003,           // $0.03 per 1000 tokens
    'claude-3-opus': 0.00001,   // $0.01 per 1000 tokens
    'claude-3-sonnet': 0.000003 // $0.003 per 1000 tokens
  };
  
  const rate = rates[model] || rates['gpt-3.5-turbo'];
  return tokenCount * rate;
}