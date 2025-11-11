import OpenAI from 'openai';
export declare const openai: OpenAI;
export declare const openAIConfig: {
    embedding: {
        model: string;
        dimensions: number;
    };
    chat: {
        model: string;
        temperature: number;
        maxTokens: number;
    };
    retry: {
        maxRetries: number;
        retryDelay: number;
    };
};
export declare const isOpenAIConfigured: () => boolean;
//# sourceMappingURL=openai.config.d.ts.map