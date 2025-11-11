# RAG-Powered Chatbot

A monorepo containing a full-stack RAG (Retrieval Augmented Generation) chatbot application with TypeScript backend and frontend.

## Project Structure

```
.
├── rag-chatbot/
│   ├── backend/          # TypeScript Express.js API server
│   ├── frontend/         # Frontend application (TBD)
│   └── deployment/       # Deployment configurations
└── package.json          # Root workspace configuration
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Setup

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

### 2. Configure Environment Variables

Navigate to the backend directory and create a `.env` file:

```bash
cd rag-chatbot/backend
cp .env.example .env
```

Edit `.env` and add your API keys and configuration.

### 3. Start Development Server

From the root directory:

```bash
# Start backend only
npm run dev:backend

# Or navigate to backend directory
cd rag-chatbot/backend
npm run dev
```

The server will start on `http://localhost:3001`

## Backend

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### API Endpoints

#### Health Check
```
GET /api/health
```

#### Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here",
  "conversationId": "optional-conversation-id"
}
```

#### Conversation History
```
GET /api/chat/history/:conversationId
```

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Dev Tools:** tsx (for hot reload), ESLint
- **Middleware:** Helmet (security), CORS, Morgan (logging)

## Next Steps

1. Add vector database integration (Pinecone, Weaviate, or Qdrant)
2. Integrate AI model (OpenAI, Anthropic Claude, or local LLM)
3. Implement RAG pipeline
4. Add frontend application
5. Set up deployment configuration

## License

MIT