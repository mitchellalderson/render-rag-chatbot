# RAG Chatbot Backend

TypeScript Express.js backend for the RAG-powered chatbot application.

## Architecture

```
src/
├── index.ts              # Application entry point
├── config/
│   └── openai.config.ts  # OpenAI client and configuration
├── db/
│   ├── config.ts         # PostgreSQL connection pool
│   ├── migrate.ts        # Database migrations
│   └── seed.ts           # Sample data seeding
├── middleware/
│   └── errorHandler.ts   # Global error handling
├── models/
│   ├── document.model.ts     # Document types
│   └── conversation.model.ts # Conversation types
├── repositories/
│   ├── document.repository.ts     # Document database operations
│   └── conversation.repository.ts # Conversation database operations
├── services/
│   ├── embedding.service.ts # OpenAI embedding generation
│   ├── llm.service.ts       # OpenAI chat completions
│   ├── vector.service.ts    # Vector database operations
│   └── rag.service.ts       # RAG pipeline orchestration
├── routes/
│   ├── health.ts         # Health check endpoints
│   └── chat.ts           # Chat API endpoints
└── types/
    └── index.ts          # TypeScript type definitions
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL with pgvector

Follow the detailed setup guide: [SETUP.md](./SETUP.md)

Quick steps:
1. Install PostgreSQL and pgvector
2. Create database and user
3. Update `.env` with database credentials
4. Run migrations

### 3. Environment Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Required environment variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL connection
- `OPENAI_API_KEY` - Your OpenAI API key (get from https://platform.openai.com/api-keys)

Optional (with defaults):
- `OPENAI_EMBEDDING_MODEL` - Embedding model (default: text-embedding-3-small)
- `OPENAI_CHAT_MODEL` - Chat model (default: gpt-4-turbo-preview)
- `SIMILARITY_THRESHOLD` - Min similarity for retrieval (default: 0.7)
- `MAX_SOURCES` - Max documents to retrieve (default: 5)

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. (Optional) Seed Sample Data

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Server runs with hot reload at `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

## API Reference

### Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "RAG Chatbot API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### Send Chat Message

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "message": "What is machine learning?",
  "conversationId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Response from AI model",
    "conversationId": "uuid",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "sources": [
      {
        "id": "doc-id",
        "content": "Relevant document content",
        "metadata": {},
        "score": 0.95
      }
    ]
  }
}
```

### Get Conversation History

**Endpoint:** `GET /api/chat/history/:conversationId`

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "messages": [
      {
        "id": "uuid",
        "conversation_id": "uuid",
        "role": "user",
        "content": "What is machine learning?",
        "sources": [],
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Ingest Documents

**Endpoint:** `POST /api/chat/ingest`

**Request Body:**
```json
{
  "documents": [
    {
      "content": "Machine learning is a subset of AI...",
      "metadata": {
        "category": "AI",
        "topic": "Machine Learning"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ingested": 1,
    "results": [...]
  }
}
```

### Get Vector Database Stats

**Endpoint:** `GET /api/chat/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDocuments": 42,
    "embeddingDimension": 1536
  }
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Stack trace (development only)"
  }
}
```

HTTP Status Codes:
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Technology Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with pgvector extension
- **Vector Search:** Cosine similarity with IVFFlat indexing
- **AI Models:** OpenAI (embeddings + chat completions)
- **Dev Tools:** tsx, ESLint

## RAG Pipeline

The application implements a complete Retrieval Augmented Generation (RAG) pipeline:

1. **Document Ingestion** - Automatically chunk and embed documents using OpenAI
2. **Query Processing** - Convert user query to embedding vector
3. **Vector Search** - Find semantically similar documents using pgvector
4. **Context Building** - Combine relevant documents with conversation history
5. **Response Generation** - Generate contextual AI response using GPT-4/3.5
6. **Conversation Storage** - Persist messages with source citations

## Current Status

- [x] Vector database integration (PostgreSQL + pgvector)
- [x] Conversation persistence with history
- [x] Document storage with metadata
- [x] OpenAI embedding model integration (text-embedding-3-small)
- [x] OpenAI LLM integration (GPT-4 Turbo / GPT-3.5)
- [x] Document ingestion with automatic embedding and chunking
- [x] Complete end-to-end RAG pipeline
- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] Caching layer
- [ ] WebSocket support for streaming responses

## OpenAI Integration

See [OPENAI_INTEGRATION.md](./OPENAI_INTEGRATION.md) for detailed guide on:
- Setting up OpenAI API keys
- Choosing embedding and chat models
- Cost optimization strategies
- API usage examples
- Troubleshooting

## Next Steps

1. **Add Authentication**: Implement user authentication and API keys
2. **Rate Limiting**: Add request throttling and quotas
3. **Caching**: Cache embeddings and responses for efficiency
4. **Streaming**: Add WebSocket support for streaming responses
5. **Monitoring**: Add logging and metrics for usage tracking
6. **Alternative Providers**: Support Anthropic Claude, Cohere, or local models