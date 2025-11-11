"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOpenAIConfigured = exports.openAIConfig = exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables BEFORE reading them
// This ensures scripts that import this config get the env vars loaded
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    console.warn('   AI features will not work until you add your API key to .env');
}
// Initialize OpenAI client
exports.openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
});
// OpenAI configuration
exports.openAIConfig = {
    // Embedding model configuration
    embedding: {
        model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
        dimensions: parseInt(process.env.EMBEDDING_DIMENSION || '1536', 10),
    },
    // Chat completion model configuration
    chat: {
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo-preview',
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
    },
    // Rate limiting and retry configuration
    retry: {
        maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.OPENAI_RETRY_DELAY || '1000', 10),
    },
};
// Check if OpenAI is properly configured
const isOpenAIConfigured = () => {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder-key';
};
exports.isOpenAIConfigured = isOpenAIConfigured;
//# sourceMappingURL=openai.config.js.map