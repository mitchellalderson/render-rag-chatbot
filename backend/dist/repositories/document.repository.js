"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRepository = exports.DocumentRepository = void 0;
const config_1 = require("../db/config");
class DocumentRepository {
    /**
     * Create a new document with optional embedding
     */
    async create(input) {
        const { content, embedding, metadata = {} } = input;
        const embeddingValue = embedding ? `[${embedding.join(',')}]` : null;
        const query = `
      INSERT INTO documents (content, embedding, metadata)
      VALUES ($1, $2, $3)
      RETURNING id, content, embedding, metadata, created_at, updated_at
    `;
        const values = [content, embeddingValue, JSON.stringify(metadata)];
        const result = await config_1.pool.query(query, values);
        return this.mapRowToDocument(result.rows[0]);
    }
    /**
     * Get document by ID
     */
    async findById(id) {
        const query = 'SELECT * FROM documents WHERE id = $1';
        const result = await config_1.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToDocument(result.rows[0]);
    }
    /**
     * Get all documents
     */
    async findAll(limit = 100, offset = 0) {
        const query = `
      SELECT * FROM documents
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await config_1.pool.query(query, [limit, offset]);
        return result.rows.map(row => this.mapRowToDocument(row));
    }
    /**
     * Update document embedding
     */
    async updateEmbedding(id, embedding) {
        const embeddingValue = `[${embedding.join(',')}]`;
        const query = `
      UPDATE documents
      SET embedding = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, content, embedding, metadata, created_at, updated_at
    `;
        const result = await config_1.pool.query(query, [embeddingValue, id]);
        if (result.rows.length === 0) {
            throw new Error(`Document with id ${id} not found`);
        }
        return this.mapRowToDocument(result.rows[0]);
    }
    /**
     * Perform vector similarity search using cosine distance
     */
    async vectorSearch(queryEmbedding, limit = 5, threshold = 0.7) {
        const embeddingValue = `[${queryEmbedding.join(',')}]`;
        // Get the closest documents first, then filter by threshold
        // This ensures we get results even if threshold is high
        const query = `
      SELECT
        id,
        content,
        metadata,
        1 - (embedding <=> $1::vector) as similarity
      FROM documents
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;
        console.log(`🗄️  Executing vector search query with limit=${limit}, threshold=${threshold}`);
        const result = await config_1.pool.query(query, [embeddingValue, limit]);
        console.log(`   Raw SQL returned ${result.rows.length} rows`);
        if (result.rows.length > 0) {
            const similarities = result.rows.map(r => parseFloat(r.similarity));
            console.log(`   Similarity scores: [${similarities.map(s => s.toFixed(4)).join(', ')}]`);
        }
        // Filter by threshold after getting closest results
        const filtered = result.rows
            .filter(row => parseFloat(row.similarity) >= threshold)
            .map(row => ({
            id: row.id,
            content: row.content,
            metadata: row.metadata,
            similarity: parseFloat(row.similarity)
        }));
        console.log(`   After threshold filter (>=${threshold}): ${filtered.length} results`);
        return filtered;
    }
    /**
     * Delete document by ID
     */
    async delete(id) {
        const query = 'DELETE FROM documents WHERE id = $1';
        const result = await config_1.pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    /**
     * Count total documents
     */
    async count() {
        const query = 'SELECT COUNT(*) FROM documents';
        const result = await config_1.pool.query(query);
        return parseInt(result.rows[0].count, 10);
    }
    /**
     * Helper method to map database row to Document model
     */
    mapRowToDocument(row) {
        return {
            id: row.id,
            content: row.content,
            embedding: row.embedding ? this.parseVector(row.embedding) : null,
            metadata: row.metadata,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }
    /**
     * Parse pgvector format to number array
     */
    parseVector(vectorString) {
        // pgvector returns vectors as "[1,2,3]" string format
        return vectorString
            .replace('[', '')
            .replace(']', '')
            .split(',')
            .map(n => parseFloat(n));
    }
}
exports.DocumentRepository = DocumentRepository;
exports.documentRepository = new DocumentRepository();
//# sourceMappingURL=document.repository.js.map