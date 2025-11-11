import { Conversation, Message, MessageInput } from '../models/conversation.model';
export declare class ConversationRepository {
    /**
     * Create a new conversation
     */
    createConversation(): Promise<Conversation>;
    /**
     * Get conversation by ID
     */
    findConversationById(id: string): Promise<Conversation | null>;
    /**
     * Add a message to a conversation
     */
    addMessage(input: MessageInput): Promise<Message>;
    /**
     * Get all messages for a conversation
     */
    getMessages(conversationId: string): Promise<Message[]>;
    /**
     * Get conversation with messages
     */
    getConversationWithMessages(id: string): Promise<{
        conversation: Conversation;
        messages: Message[];
    } | null>;
    /**
     * Delete a conversation and all its messages
     */
    deleteConversation(id: string): Promise<boolean>;
    /**
     * Get recent conversations (paginated)
     */
    getRecentConversations(limit?: number, offset?: number): Promise<Conversation[]>;
}
export declare const conversationRepository: ConversationRepository;
//# sourceMappingURL=conversation.repository.d.ts.map