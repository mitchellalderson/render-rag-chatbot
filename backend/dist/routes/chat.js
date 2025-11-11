"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const rag_service_1 = require("../services/rag.service");
const vector_service_1 = require("../services/vector.service");
const router = (0, express_1.Router)();
// POST /api/chat - Send a message to the chatbot
router.post('/', async (req, res, next) => {
    try {
        const { message, conversationId, maxSources, similarityThreshold, includeHistory } = req.body;
        if (!message || typeof message !== 'string') {
            throw new errorHandler_1.ApiError(400, 'Message is required and must be a string');
        }
        // Use RAG service to process the query
        const result = await rag_service_1.ragService.query(message, conversationId, {
            maxSources,
            similarityThreshold,
            includeHistory
        });
        res.json({
            success: true,
            data: {
                message: result.answer,
                conversationId: result.conversationId,
                timestamp: new Date().toISOString(),
                sources: result.sources,
                usage: result.usage
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/chat/history/:conversationId - Get conversation history
router.get('/history/:conversationId', async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const history = await rag_service_1.ragService.getHistory(conversationId);
        if (!history) {
            throw new errorHandler_1.ApiError(404, 'Conversation not found');
        }
        res.json({
            success: true,
            data: {
                conversationId: history.conversation.id,
                messages: history.messages,
                createdAt: history.conversation.created_at,
                updatedAt: history.conversation.updated_at
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/chat/ingest - Ingest documents into the vector database
router.post('/ingest', async (req, res, next) => {
    try {
        const { documents } = req.body;
        if (!Array.isArray(documents) || documents.length === 0) {
            throw new errorHandler_1.ApiError(400, 'Documents array is required and must not be empty');
        }
        const results = await rag_service_1.ragService.ingestDocuments(documents);
        res.json({
            success: true,
            data: {
                ingested: results.length,
                results
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/chat/stats - Get vector database statistics
router.get('/stats', async (_req, res, next) => {
    try {
        const stats = await vector_service_1.vectorService.getStats();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map