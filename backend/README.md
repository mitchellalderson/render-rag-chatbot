# RAG Chatbot Backend

TypeScript/Express.js backend for the RAG-powered chatbot application with OpenAI integration, PostgreSQL vector database, and automatic migrations.

## 🎯 Key Features

- ✅ **Complete RAG Pipeline** - Query embedding, vector search, context building, and AI response generation
- ✅ **Conversation Management** - Persistent multi-turn conversations with full history
- ✅ **Document Ingestion** - Automatic chunking and embedding generation
- ✅ **Vector Search** - Fast semantic similarity search using PostgreSQL + pgvector
- ✅ **Source Citations** - Track and return which documents informed each response
- ✅ **Automatic Migrations** - Database schema automatically set up on deployment
- ✅ **Docker Support** - Containerized deployment, error handling, health checks

## Architecture

```
src/
├── index.ts              # Application entry point
├── config/
│   └── openai.config.ts  # OpenAI client and configuration
├── db/
│   ├── config.ts         # PostgreSQL connection pool
│   ├── migrate.ts        # Database migrations
│   ├── seed-embeddings.ts # Database seeding from markdown docs
│   └── docs/             # Markdown documentation files for seeding
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

Migrations create all necessary tables, indexes, and extensions (including pgvector).

```bash
npm run db:migrate
```

**Note:** In production (Docker/Render), migrations run automatically via the `start.sh` script.

### 5. (Optional) Seed Sample Data

The backend includes 15 comprehensive markdown documents about AI and machine learning topics in `src/db/docs/`. These will be automatically embedded and seeded into your vector database.

```bash
# Seed database with markdown documents (includes embedding generation)
npm run db:seed
```

To add custom knowledge:
1. Add markdown files to `src/db/docs/`
2. Run the seed command
3. The script will automatically process all `.md` files

### 6. Start Development Server

```bash
npm run dev
```

Server runs with hot reload at `http://localhost:3001`

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

**Note:** In Docker, the `start.sh` script handles migrations, optional seeding, and server startup:
```bash
# Runs automatically in container
./start.sh
# 1. Runs migrations: node dist/db/migrate.js
# 2. (Optional) Seeds database: node dist/db/seed-embeddings.js (if RUN_SEED=true)
# 3. Starts server: node dist/index.js
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

## 🚀 Production Deployment

### Docker Deployment

The backend includes Docker configuration with automatic migrations.

**Build and run:**
```bash
# From repository root
docker build -f backend/Dockerfile -t rag-backend .
docker run -p 3001:3001 --env-file backend/.env rag-backend
```

**What happens on container startup:**
1. `start.sh` script runs automatically
2. Database migrations execute (`node dist/db/migrate.js`)
3. Server starts (`node dist/index.js`)

### Deploy to Render.com

Configured in root `render.yaml`:
- Automatic deployments from Git
- Managed PostgreSQL with pgvector
- Auto-scaling and health checks
- Environment variable management

See root `README.md` for detailed deployment instructions.

### Environment Variables for Production

**Required:**
```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=sk-...
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=rag_chatbot
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

**Optional (with defaults):**
```env
CORS_ORIGIN=https://your-frontend.com
DB_POOL_MAX=20
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1000
SIMILARITY_THRESHOLD=0.2
MAX_SOURCES=5
RUN_SEED=false  # Set to 'true' to auto-seed database on startup (incurs OpenAI costs)
```

**Note on Automatic Seeding:**
- Set `RUN_SEED=true` to automatically seed the database with the 15 markdown documents in `src/db/docs/` on container startup
- ⚠️ This will generate embeddings using OpenAI API and incur costs (~$0.01-0.02 per run)
- Database migrations always run automatically; seeding is optional and disabled by default

## 📊 Current Status

**Implemented:**
- [x] Vector database integration (PostgreSQL + pgvector)
- [x] Conversation persistence with history
- [x] Document storage with metadata
- [x] OpenAI embedding model integration (text-embedding-3-small)
- [x] OpenAI LLM integration (GPT-4 Turbo / GPT-3.5)
- [x] Document ingestion with automatic embedding
- [x] Complete end-to-end RAG pipeline
- [x] Docker production deployment
- [x] Automatic database migrations
- [x] Health check endpoint
- [x] Error handling and validation
- [x] Token usage tracking

**Roadmap:**
- [ ] Authentication & authorization
- [ ] Rate limiting and quotas
- [ ] Response caching layer
- [ ] WebSocket support for streaming responses
- [ ] Alternative model providers (Anthropic, Cohere)
- [ ] Vector index optimization
- [ ] Monitoring and observability

## 📚 Additional Documentation

- [OPENAI_INTEGRATION.md](./OPENAI_INTEGRATION.md) - OpenAI setup, model selection, and cost optimization
- [SETUP.md](./SETUP.md) - PostgreSQL and pgvector installation guide
- [DOCKER.md](./DOCKER.md) - Docker development and deployment details

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Authentication system
- Rate limiting implementation
- Caching strategies
- Alternative model providers
- Performance optimizations