import { VectorSearchResult } from '../models/document.model';
import { TokenUsage } from './llm.service';
export interface RAGResponse {
    answer: string;
    sources: VectorSearchResult[];
    conversationId: string;
    usage: TokenUsage;
}
export declare class RAGService {
    /**
     * Process a user query using RAG pipeline
     *
     * Steps:
     * 1. Generate embedding for the query (to be implemented with AI model)
     * 2. Search for relevant documents using vector similarity
     * 3. Build context from retrieved documents
     * 4. Generate response using AI model with context (to be implemented)
     * 5. Save conversation history
     */
    query(userMessage: string, conversationId?: string, options?: {
        maxSources?: number;
        similarityThreshold?: number;
        includeHistory?: boolean;
    }): Promise<RAGResponse>;
    /**
     * Get conversation history
     */
    getHistory(conversationId: string): Promise<{
        conversation: import("../models/conversation.model").Conversation;
        messages: import("../models/conversation.model").Message[];
    } | null>;
    /**
     * Ingest documents into the vector database
     * @param documents - Array of documents to ingest
     */
    ingestDocuments(documents: Array<{
        content: string;
        metadata?: Record<string, unknown>;
    }>): Promise<({
        status: string;
        documentIndex: number;
        chunkIndex: number;
        id: string;
        error?: undefined;
    } | {
        status: string;
        documentIndex: number;
        id: string;
        chunkIndex?: undefined;
        error?: undefined;
    } | {
        status: string;
        documentIndex: number;
        error: any;
        chunkIndex?: undefined;
        id?: undefined;
    })[]>;
    /**
     * Ingest a single document with automatic chunking
     */
    ingestDocument(content: string, metadata?: Record<string, unknown>): Promise<({
        status: string;
        documentIndex: number;
        chunkIndex: number;
        id: string;
        error?: undefined;
    } | {
        status: string;
        documentIndex: number;
        id: string;
        chunkIndex?: undefined;
        error?: undefined;
    } | {
        status: string;
        documentIndex: number;
        error: any;
        chunkIndex?: undefined;
        id?: undefined;
    })[]>;
}
export declare const ragService: RAGService;
//# sourceMappingURL=rag.service.d.ts.map