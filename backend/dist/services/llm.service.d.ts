import { VectorSearchResult } from '../models/document.model';
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}
export interface ChatCompletionResult {
    content: string;
    usage: TokenUsage;
}
export interface ChatCompletionOptions {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}
export declare class LLMService {
    /**
     * Generate a chat completion with optional RAG context
     */
    generateChatCompletion(userMessage: string, context?: VectorSearchResult[], conversationHistory?: ChatMessage[], options?: ChatCompletionOptions): Promise<ChatCompletionResult>;
    /**
     * Build system prompt with RAG context
     */
    private buildSystemPrompt;
    /**
     * Generate a streaming chat completion
     * Note: This is a placeholder for streaming support
     */
    generateChatCompletionStream(userMessage: string, context?: VectorSearchResult[], conversationHistory?: ChatMessage[], options?: ChatCompletionOptions): AsyncGenerator<string, void, unknown>;
    /**
     * Summarize a long text
     */
    summarize(text: string, maxLength?: number): Promise<string>;
}
export declare const llmService: LLMService;
//# sourceMappingURL=llm.service.d.ts.map