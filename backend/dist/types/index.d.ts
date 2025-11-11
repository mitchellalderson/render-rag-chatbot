export interface ChatRequest {
    message: string;
    conversationId?: string;
}
export interface ChatResponse {
    success: boolean;
    data: {
        message: string;
        conversationId: string;
        timestamp: string;
        sources?: DocumentSource[];
    };
}
export interface DocumentSource {
    id: string;
    content: string;
    metadata: Record<string, unknown>;
    score: number;
}
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}
export interface Conversation {
    id: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=index.d.ts.map