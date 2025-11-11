"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorService = exports.VectorService = void 0;
const document_repository_1 = require("../repositories/document.repository");
class VectorService {
    /**
     * Add a document to the vector database
     * Note: You need to generate embeddings before calling this method
     */
    async addDocument(content, embedding, metadata) {
        const input = {
            content,
            embedding,
            metadata
        };
        return await document_repository_1.documentRepository.create(input);
    }
    /**
     * Add multiple documents in batch
     */
    async addDocuments(documents) {
        const results = [];
        for (const doc of documents) {
            const result = await this.addDocument(doc.content, doc.embedding, doc.metadata);
            results.push(result);
        }
        return results;
    }
    /**
     * Search for similar documents using vector similarity
     * @param queryEmbedding - The embedding vector of the query
     * @param limit - Maximum number of results to return
     * @param threshold - Minimum similarity score (0-1)
     */
    async search(queryEmbedding, limit = 5, threshold = 0.7) {
        console.log(`🔍 Vector search params: limit=${limit}, threshold=${threshold}, embeddingSize=${queryEmbedding.length}`);
        const results = await document_repository_1.documentRepository.vectorSearch(queryEmbedding, limit, threshold);
        console.log(`📊 Vector search returned ${results.length} results`);
        if (results.length > 0) {
            console.log(`   Top result similarity: ${results[0].similarity.toFixed(4)}`);
        }
        return results;
    }
    /**
     * Get document by ID
     */
    async getDocument(id) {
        return await document_repository_1.documentRepository.findById(id);
    }
    /**
     * Get all documents (paginated)
     */
    async getAllDocuments(limit = 100, offset = 0) {
        return await document_repository_1.documentRepository.findAll(limit, offset);
    }
    /**
     * Update document embedding
     * Useful when you need to re-embed existing documents
     */
    async updateEmbedding(id, embedding) {
        return await document_repository_1.documentRepository.updateEmbedding(id, embedding);
    }
    /**
     * Delete a document
     */
    async deleteDocument(id) {
        return await document_repository_1.documentRepository.delete(id);
    }
    /**
     * Get statistics about the vector database
     */
    async getStats() {
        const totalDocuments = await document_repository_1.documentRepository.count();
        return {
            totalDocuments,
            embeddingDimension: 1536 // This should match your model's dimension
        };
    }
    /**
     * Build context string from search results for RAG
     */
    buildContext(results) {
        if (results.length === 0) {
            return '';
        }
        const contextParts = results.map((result, index) => {
            return `[Document ${index + 1}] (Relevance: ${(result.similarity * 100).toFixed(1)}%)\n${result.content}`;
        });
        return contextParts.join('\n\n---\n\n');
    }
    /**
     * Format sources for inclusion in chat response
     */
    formatSources(results) {
        return results.map(result => ({
            id: result.id,
            content: result.content,
            metadata: result.metadata,
            similarity: result.similarity
        }));
    }
}
exports.VectorService = VectorService;
exports.vectorService = new VectorService();
//# sourceMappingURL=vector.service.js.map