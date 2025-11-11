export declare class EmbeddingService {
    /**
     * Generate embedding vector for a single text
     */
    generateEmbedding(text: string): Promise<number[]>;
    /**
     * Generate embeddings for multiple texts in batch
     */
    generateEmbeddings(texts: string[]): Promise<number[][]>;
    /**
     * Get the dimension of embeddings produced by the current model
     */
    getEmbeddingDimension(): number;
    /**
     * Chunk text into smaller pieces for embedding
     * Useful for long documents that exceed token limits
     */
    chunkText(text: string, maxChunkSize?: number): string[];
}
export declare const embeddingService: EmbeddingService;
//# sourceMappingURL=embedding.service.d.ts.map