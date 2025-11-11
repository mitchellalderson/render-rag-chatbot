import { Document, DocumentInput, VectorSearchResult } from '../models/document.model';
export declare class DocumentRepository {
    /**
     * Create a new document with optional embedding
     */
    create(input: DocumentInput): Promise<Document>;
    /**
     * Get document by ID
     */
    findById(id: string): Promise<Document | null>;
    /**
     * Get all documents
     */
    findAll(limit?: number, offset?: number): Promise<Document[]>;
    /**
     * Update document embedding
     */
    updateEmbedding(id: string, embedding: number[]): Promise<Document>;
    /**
     * Perform vector similarity search using cosine distance
     */
    vectorSearch(queryEmbedding: number[], limit?: number, threshold?: number): Promise<VectorSearchResult[]>;
    /**
     * Delete document by ID
     */
    delete(id: string): Promise<boolean>;
    /**
     * Count total documents
     */
    count(): Promise<number>;
    /**
     * Helper method to map database row to Document model
     */
    private mapRowToDocument;
    /**
     * Parse pgvector format to number array
     */
    private parseVector;
}
export declare const documentRepository: DocumentRepository;
//# sourceMappingURL=document.repository.d.ts.map