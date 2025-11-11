"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepository = exports.ConversationRepository = void 0;
const config_1 = require("../db/config");
class ConversationRepository {
    /**
     * Create a new conversation
     */
    async createConversation() {
        const query = `
      INSERT INTO conversations DEFAULT VALUES
      RETURNING id, created_at, updated_at
    `;
        const result = await config_1.pool.query(query);
        return result.rows[0];
    }
    /**
     * Get conversation by ID
     */
    async findConversationById(id) {
        const query = 'SELECT * FROM conversations WHERE id = $1';
        const result = await config_1.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
    /**
     * Add a message to a conversation
     */
    async addMessage(input) {
        const { conversation_id, role, content, sources = [] } = input;
        const query = `
      INSERT INTO messages (conversation_id, role, content, sources)
      VALUES ($1, $2, $3, $4)
      RETURNING id, conversation_id, role, content, sources, created_at
    `;
        const result = await config_1.pool.query(query, [
            conversation_id,
            role,
            content,
            JSON.stringify(sources)
        ]);
        // Update conversation's updated_at timestamp
        await config_1.pool.query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [conversation_id]);
        return result.rows[0];
    }
    /**
     * Get all messages for a conversation
     */
    async getMessages(conversationId) {
        const query = `
      SELECT id, conversation_id, role, content, sources, created_at
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `;
        const result = await config_1.pool.query(query, [conversationId]);
        return result.rows;
    }
    /**
     * Get conversation with messages
     */
    async getConversationWithMessages(id) {
        const conversation = await this.findConversationById(id);
        if (!conversation) {
            return null;
        }
        const messages = await this.getMessages(id);
        return {
            conversation,
            messages
        };
    }
    /**
     * Delete a conversation and all its messages
     */
    async deleteConversation(id) {
        const query = 'DELETE FROM conversations WHERE id = $1';
        const result = await config_1.pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    /**
     * Get recent conversations (paginated)
     */
    async getRecentConversations(limit = 20, offset = 0) {
        const query = `
      SELECT * FROM conversations
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await config_1.pool.query(query, [limit, offset]);
        return result.rows;
    }
}
exports.ConversationRepository = ConversationRepository;
exports.conversationRepository = new ConversationRepository();
//# sourceMappingURL=conversation.repository.js.map