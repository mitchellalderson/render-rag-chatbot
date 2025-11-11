"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragService = exports.RAGService = void 0;
const vector_service_1 = require("./vector.service");
const conversation_repository_1 = require("../repositories/conversation.repository");
const embedding_service_1 = require("./embedding.service");
const llm_service_1 = require("./llm.service");
const openai_config_1 = require("../config/openai.config");
class RAGService {
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
    async query(userMessage, conversationId, options) {
        const maxSources = options?.maxSources || parseInt(process.env.MAX_SOURCES || '5', 10);
        const similarityThreshold = options?.similarityThreshold || parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7');
        const includeHistory = options?.includeHistory ?? true;
        // Check if OpenAI is configured
        if (!(0, openai_config_1.isOpenAIConfigured)()) {
            throw new Error('OpenAI is not configured. Please add OPENAI_API_KEY to your .env file.');
        }
        // Step 1: Create or get conversation
        let convId = conversationId;
        if (!convId) {
            const conversation = await conversation_repository_1.conversationRepository.createConversation();
            convId = conversation.id;
        }
        // Save user message
        await conversation_repository_1.conversationRepository.addMessage({
            conversation_id: convId,
            role: 'user',
            content: userMessage
        });
        // Step 2: Generate query embedding
        console.log('🔍 Generating embedding for query...');
        const queryEmbedding = await embedding_service_1.embeddingService.generateEmbedding(userMessage);
        // Step 3: Search for relevant documents using vector similarity
        console.log('📚 Searching for relevant documents...');
        const sources = await vector_service_1.vectorService.search(queryEmbedding, maxSources, similarityThreshold);
        console.log(`✅ Found ${sources.length} relevant document(s)`);
        // Step 4: Get conversation history if needed
        let conversationHistory = [];
        if (includeHistory) {
            const history = await conversation_repository_1.conversationRepository.getMessages(convId);
            // Convert to chat messages (exclude the current user message we just added)
            conversationHistory = history
                .slice(0, -1) // Remove last message (current user message)
                .slice(-10) // Keep last 10 messages for context
                .map(msg => ({
                role: msg.role,
                content: msg.content
            }));
        }
        // Step 5: Generate response using LLM with retrieved context
        console.log('💭 Generating AI response...');
        const result = await llm_service_1.llmService.generateChatCompletion(userMessage, sources, conversationHistory.length > 0 ? conversationHistory : undefined);
        // Step 6: Save assistant response
        await conversation_repository_1.conversationRepository.addMessage({
            conversation_id: convId,
            role: 'assistant',
            content: result.content,
            sources: vector_service_1.vectorService.formatSources(sources)
        });
        console.log('✅ Response generated successfully');
        return {
            answer: result.content,
            sources,
            conversationId: convId,
            usage: result.usage
        };
    }
    /**
     * Get conversation history
     */
    async getHistory(conversationId) {
        return await conversation_repository_1.conversationRepository.getConversationWithMessages(conversationId);
    }
    /**
     * Ingest documents into the vector database
     * @param documents - Array of documents to ingest
     */
    async ingestDocuments(documents) {
        if (!(0, openai_config_1.isOpenAIConfigured)()) {
            throw new Error('OpenAI is not configured. Please add OPENAI_API_KEY to your .env file.');
        }
        const results = [];
        console.log(`📝 Starting ingestion of ${documents.length} document(s)...`);
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            try {
                // Check if document needs chunking
                const chunks = embedding_service_1.embeddingService.chunkText(doc.content);
                if (chunks.length > 1) {
                    console.log(`📄 Document ${i + 1} split into ${chunks.length} chunks`);
                    // Process each chunk
                    for (let j = 0; j < chunks.length; j++) {
                        const chunk = chunks[j];
                        const embedding = await embedding_service_1.embeddingService.generateEmbedding(chunk);
                        const chunkMetadata = {
                            ...doc.metadata,
                            chunkIndex: j,
                            totalChunks: chunks.length,
                            isChunked: true
                        };
                        const result = await vector_service_1.vectorService.addDocument(chunk, embedding, chunkMetadata);
                        results.push({
                            status: 'success',
                            documentIndex: i,
                            chunkIndex: j,
                            id: result.id
                        });
                    }
                }
                else {
                    // Process single document
                    console.log(`📄 Processing document ${i + 1}/${documents.length}...`);
                    const embedding = await embedding_service_1.embeddingService.generateEmbedding(doc.content);
                    const result = await vector_service_1.vectorService.addDocument(doc.content, embedding, doc.metadata);
                    results.push({
                        status: 'success',
                        documentIndex: i,
                        id: result.id
                    });
                }
            }
            catch (error) {
                console.error(`❌ Error processing document ${i + 1}:`, error.message);
                results.push({
                    status: 'error',
                    documentIndex: i,
                    error: error.message
                });
            }
        }
        const successCount = results.filter(r => r.status === 'success').length;
        console.log(`✅ Ingestion complete: ${successCount}/${results.length} successful`);
        return results;
    }
    /**
     * Ingest a single document with automatic chunking
     */
    async ingestDocument(content, metadata) {
        return this.ingestDocuments([{ content, metadata }]);
    }
}
exports.RAGService = RAGService;
exports.ragService = new RAGService();
//# sourceMappingURL=rag.service.js.map