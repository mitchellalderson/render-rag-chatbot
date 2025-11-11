import { VectorSearchResult } from '../models/document.model';
export declare class VectorService {
    /**
     * Add a document to the vector database
     * Note: You need to generate embeddings before calling this method
     */
    addDocument(content: string, embedding: number[], metadata?: Record<string, unknown>): Promise<import("../models/document.model").Document>;
    /**
     * Add multiple documents in batch
     */
    addDocuments(documents: Array<{
        content: string;
        embedding: number[];
        metadata?: Record<string, unknown>;
    }>): Promise<import("../models/document.model").Document[]>;
    /**
     * Search for similar documents using vector similarity
     * @param queryEmbedding - The embedding vector of the query
     * @param limit - Maximum number of results to return
     * @param threshold - Minimum similarity score (0-1)
     */
    search(queryEmbedding: number[], limit?: number, threshold?: number): Promise<VectorSearchResult[]>;
    /**
     * Get document by ID
     */
    getDocument(id: string): Promise<import("../models/document.model").Document | null>;
    /**
     * Get all documents (paginated)
     */
    getAllDocuments(limit?: number, offset?: number): Promise<import("../models/document.model").Document[]>;
    /**
     * Update document embedding
     * Useful when you need to re-embed existing documents
     */
    updateEmbedding(id: string, embedding: number[]): Promise<import("../models/document.model").Document>;
    /**
     * Delete a document
     */
    deleteDocument(id: string): Promise<boolean>;
    /**
     * Get statistics about the vector database
     */
    getStats(): Promise<{
        totalDocuments: number;
        embeddingDimension: number;
    }>;
    /**
     * Build context string from search results for RAG
     */
    buildContext(results: VectorSearchResult[]): string;
    /**
     * Format sources for inclusion in chat response
     */
    formatSources(results: VectorSearchResult[]): {
        id: string;
        content: string;
        metadata: Record<string, unknown>;
        similarity: number;
    }[];
}
export declare const vectorService: VectorService;
//# sourceMappingURL=vector.service.d.ts.map