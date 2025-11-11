"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingService = exports.EmbeddingService = void 0;
const openai_config_1 = require("../config/openai.config");
class EmbeddingService {
    /**
     * Generate embedding vector for a single text
     */
    async generateEmbedding(text) {
        if (!(0, openai_config_1.isOpenAIConfigured)()) {
            throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
        }
        try {
            const response = await openai_config_1.openai.embeddings.create({
                model: openai_config_1.openAIConfig.embedding.model,
                input: text,
                encoding_format: 'float',
            });
            if (!response.data || response.data.length === 0) {
                throw new Error('No embedding returned from OpenAI');
            }
            return response.data[0].embedding;
        }
        catch (error) {
            console.error('Error generating embedding:', error);
            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            }
            else if (error.status === 429) {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            }
            else if (error.status === 500) {
                throw new Error('OpenAI service error. Please try again later.');
            }
            throw new Error(`Failed to generate embedding: ${error.message}`);
        }
    }
    /**
     * Generate embeddings for multiple texts in batch
     */
    async generateEmbeddings(texts) {
        if (!(0, openai_config_1.isOpenAIConfigured)()) {
            throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
        }
        if (texts.length === 0) {
            return [];
        }
        try {
            const response = await openai_config_1.openai.embeddings.create({
                model: openai_config_1.openAIConfig.embedding.model,
                input: texts,
                encoding_format: 'float',
            });
            if (!response.data || response.data.length === 0) {
                throw new Error('No embeddings returned from OpenAI');
            }
            // Sort by index to ensure correct order
            return response.data
                .sort((a, b) => a.index - b.index)
                .map(item => item.embedding);
        }
        catch (error) {
            console.error('Error generating embeddings:', error);
            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            }
            else if (error.status === 429) {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            }
            else if (error.status === 500) {
                throw new Error('OpenAI service error. Please try again later.');
            }
            throw new Error(`Failed to generate embeddings: ${error.message}`);
        }
    }
    /**
     * Get the dimension of embeddings produced by the current model
     */
    getEmbeddingDimension() {
        return openai_config_1.openAIConfig.embedding.dimensions;
    }
    /**
     * Chunk text into smaller pieces for embedding
     * Useful for long documents that exceed token limits
     */
    chunkText(text, maxChunkSize = 8000) {
        const chunks = [];
        const paragraphs = text.split('\n\n');
        let currentChunk = '';
        for (const paragraph of paragraphs) {
            if ((currentChunk + paragraph).length > maxChunkSize) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
                // If a single paragraph is too long, split by sentences
                if (paragraph.length > maxChunkSize) {
                    const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
                    for (const sentence of sentences) {
                        if ((currentChunk + sentence).length > maxChunkSize) {
                            if (currentChunk) {
                                chunks.push(currentChunk.trim());
                            }
                            currentChunk = sentence;
                        }
                        else {
                            currentChunk += sentence;
                        }
                    }
                }
                else {
                    currentChunk = paragraph;
                }
            }
            else {
                currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
        return chunks;
    }
}
exports.EmbeddingService = EmbeddingService;
exports.embeddingService = new EmbeddingService();
//# sourceMappingURL=embedding.service.js.map