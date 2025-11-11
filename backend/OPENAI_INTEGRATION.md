# OpenAI Integration Guide

This guide explains how to integrate and use OpenAI's models for embeddings and chat completions in your RAG chatbot.

## Overview

The backend uses OpenAI for two main purposes:
1. **Embeddings** - Convert text into vector representations for similarity search
2. **Chat Completions** - Generate intelligent responses based on retrieved context

## Setup

### 1. Get Your OpenAI API Key

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to [API Keys](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy your API key (it will only be shown once!)

### 2. Configure Environment Variables

Add your API key to `.env`:

```bash
OPENAI_API_KEY=sk-proj-...your-key-here
```

### 3. Choose Your Models

#### Embedding Models

**text-embedding-3-small** (Recommended)
- Dimensions: 1536
- Cost: $0.02 per 1M tokens
- Best for: Most use cases, good balance of performance and cost

**text-embedding-3-large**
- Dimensions: 3072
- Cost: $0.13 per 1M tokens
- Best for: Maximum accuracy, willing to pay more

**text-embedding-ada-002** (Legacy)
- Dimensions: 1536
- Cost: $0.10 per 1M tokens
- Best for: Backward compatibility

Update in `.env`:
```bash
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSION=1536
```

⚠️ **Important**: If you change the embedding dimension, you must update your database schema and re-embed all documents.

#### Chat Models

**gpt-4-turbo-preview** (Recommended)
- Context: 128K tokens
- Cost: $10/$30 per 1M tokens (input/output)
- Best for: Complex reasoning, long context

**gpt-4**
- Context: 8K tokens
- Cost: $30/$60 per 1M tokens
- Best for: Best quality responses

**gpt-3.5-turbo**
- Context: 16K tokens
- Cost: $0.50/$1.50 per 1M tokens
- Best for: Fast, cost-effective responses

Update in `.env`:
```bash
OPENAI_CHAT_MODEL=gpt-4-turbo-preview
```

## Architecture

### Services

#### EmbeddingService (`src/services/embedding.service.ts`)

Handles text-to-vector conversion:

```typescript
import { embeddingService } from './services/embedding.service';

// Generate single embedding
const embedding = await embeddingService.generateEmbedding("Hello world");
// Returns: number[] (1536 dimensions)

// Generate multiple embeddings
const embeddings = await embeddingService.generateEmbeddings([
  "First document",
  "Second document"
]);
// Returns: number[][]

// Chunk long text
const chunks = embeddingService.chunkText(longDocument, 8000);
```

#### LLMService (`src/services/llm.service.ts`)

Handles chat completions with RAG context:

```typescript
import { llmService } from './services/llm.service';

// Generate response with context
const response = await llmService.generateChatCompletion(
  "What is machine learning?",
  retrievedDocuments,  // VectorSearchResult[]
  conversationHistory  // Optional
);

// Summarize text
const summary = await llmService.summarize(longText, 200);
```

#### RAGService (`src/services/rag.service.ts`)

Orchestrates the complete RAG pipeline:

```typescript
import { ragService } from './services/rag.service';

// Process query with RAG
const result = await ragService.query(
  "What is machine learning?",
  conversationId,
  {
    maxSources: 5,
    similarityThreshold: 0.7,
    includeHistory: true
  }
);

// Ingest documents
const results = await ragService.ingestDocuments([
  {
    content: "Machine learning is...",
    metadata: { category: "AI" }
  }
]);
```

## API Usage

### Chat Endpoint

**POST** `/api/chat`

```json
{
  "message": "What is machine learning?",
  "conversationId": "optional-uuid",
  "maxSources": 5,
  "similarityThreshold": 0.7,
  "includeHistory": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Machine learning is a subset of artificial intelligence...",
    "conversationId": "uuid",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "sources": [
      {
        "id": "doc-uuid",
        "content": "Relevant document content",
        "metadata": { "category": "AI" },
        "similarity": 0.95
      }
    ]
  }
}
```

### Ingest Documents

**POST** `/api/chat/ingest`

```json
{
  "documents": [
    {
      "content": "Long document content here...",
      "metadata": {
        "title": "Introduction to AI",
        "category": "Education",
        "author": "John Doe"
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
    "ingested": 3,
    "results": [
      {
        "status": "success",
        "documentIndex": 0,
        "chunkIndex": 0,
        "id": "uuid"
      },
      {
        "status": "success",
        "documentIndex": 0,
        "chunkIndex": 1,
        "id": "uuid"
      }
    ]
  }
}
```

## RAG Pipeline Flow

1. **User Query** → Received by API endpoint
2. **Embedding Generation** → Convert query to vector using OpenAI
3. **Vector Search** → Find similar documents in PostgreSQL using pgvector
4. **Context Building** → Combine retrieved documents into context
5. **LLM Generation** → Generate response using OpenAI with context
6. **Response** → Return answer with source citations

## Configuration Options

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_key_here

# Model selection
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4-turbo-preview

# Generation parameters
OPENAI_TEMPERATURE=0.7          # 0.0 = deterministic, 2.0 = very creative
OPENAI_MAX_TOKENS=1000          # Maximum response length
OPENAI_MAX_RETRIES=3            # Retry attempts on failure
OPENAI_RETRY_DELAY=1000         # Delay between retries (ms)

# RAG parameters
EMBEDDING_DIMENSION=1536        # Must match your embedding model
SIMILARITY_THRESHOLD=0.7        # Minimum similarity for retrieval (0-1)
MAX_SOURCES=5                   # Maximum documents to retrieve
```

### Temperature Guide

- `0.0-0.3` - Focused, deterministic (factual Q&A, data extraction)
- `0.4-0.7` - Balanced (general chatbot, RAG applications)
- `0.8-1.2` - Creative (brainstorming, storytelling)
- `1.3-2.0` - Very creative (experimental, artistic)

## Cost Optimization

### Tips to Reduce Costs

1. **Use smaller models when appropriate**
   - `gpt-3.5-turbo` for simple queries
   - `text-embedding-3-small` for embeddings

2. **Limit context size**
   - Reduce `MAX_SOURCES` to 3-5 most relevant documents
   - Increase `SIMILARITY_THRESHOLD` to filter out marginal results
   - Limit conversation history to last 5-10 messages

3. **Optimize token usage**
   - Reduce `OPENAI_MAX_TOKENS` for shorter responses
   - Chunk documents efficiently (not too small, not too large)

4. **Batch operations**
   - Use `generateEmbeddings()` for multiple documents
   - Process documents in batches during ingestion

### Cost Estimation

**Example: 1000 queries/day with 5 sources each**

Embeddings:
- 1000 queries × ~100 tokens = 100K tokens/day
- Cost: $0.02 per 1M tokens = $0.002/day

Chat Completions (GPT-4 Turbo):
- 1000 queries × 2000 tokens (context) = 2M input tokens
- 1000 responses × 500 tokens = 500K output tokens
- Cost: (2M × $10 + 500K × $30) / 1M = $35/day

**Monthly: ~$1,050**

Switch to GPT-3.5 Turbo: ~$1.50/day (~$45/month)

## Error Handling

The services handle common OpenAI errors:

- `401` - Invalid API key
- `429` - Rate limit exceeded (retry with backoff)
- `500` - OpenAI service error

Errors are properly propagated with clear messages.

## Testing

### Test Embedding Generation

```bash
curl -X POST http://localhost:3001/api/chat/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [{
      "content": "Test document for embedding",
      "metadata": { "test": true }
    }]
  }'
```

### Test Chat Completion

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is in the test document?"
  }'
```

## Troubleshooting

### "OpenAI API key is not configured"

Add your API key to `.env`:
```bash
OPENAI_API_KEY=sk-proj-...
```

### "Rate limit exceeded"

OpenAI has rate limits. Solutions:
- Wait and retry (automatic with `OPENAI_MAX_RETRIES`)
- Upgrade your OpenAI plan
- Reduce request frequency

### "Invalid embedding dimension"

Your database schema doesn't match the embedding model:
1. Check `EMBEDDING_DIMENSION` matches your model
2. Run migration to update schema if needed
3. Re-embed all documents

### High costs

See "Cost Optimization" section above.

## Next Steps

1. Monitor usage in [OpenAI Dashboard](https://platform.openai.com/usage)
2. Set up usage limits and alerts
3. Implement caching for repeated queries
4. Consider fine-tuning for domain-specific applications
5. Explore batch API for non-real-time processing