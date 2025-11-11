# RAG Chatbot Monorepo

A production-ready, full-stack Retrieval-Augmented Generation (RAG) chatbot with OpenAI integration. Built as an npm workspaces monorepo with TypeScript/Express backend, React/Vite frontend, PostgreSQL with pgvector, and a shared UI component library.

## ✨ Features

- 🤖 **RAG-Powered Responses** - Semantic search over document knowledge base using vector embeddings
- 💬 **Conversation History** - Persistent multi-turn conversations with context awareness
- 📚 **Source Citations** - Shows which documents informed each response
- 🎯 **Real-time Token Usage** - Visual context window usage tracking (GPT-4 Turbo 128k context)
- 🚀 **Production-Ready** - Docker support, automated migrations, Render.com deployment config
- 🎨 **Modern UI** - Beautiful React interface with Tailwind CSS and Radix UI components
- 📊 **Vector Search** - PostgreSQL with pgvector extension for fast similarity search

## Repository Structure

```
.
├── backend/            # Express + TypeScript API (RAG + chat endpoints)
│   ├── src/
│   │   ├── services/   # RAG, embedding, LLM, and vector services
│   │   ├── routes/     # API endpoints (chat, health)
│   │   ├── db/         # Database config, migrations, and utilities
│   │   └── ...
│   ├── Dockerfile      # Production container with auto-migrations
│   └── start.sh        # Startup script (runs migrations then starts server)
├── frontend/           # React + Vite app (chat UI)
│   ├── src/
│   │   ├── components/ # Chatbot component with real API integration
│   │   └── config.ts   # API configuration
│   ├── Dockerfile      # Nginx-served production build
│   └── nginx.conf      # Nginx configuration
├── common-ui/          # Shared UI components and styles
├── docker-compose.yml  # Full-stack local development (Postgres + backend + frontend)
├── render.yaml         # Production deployment configuration (Render.com)
├── package.json        # Root workspaces + scripts
└── README.md
```

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (recommended for local development)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- PostgreSQL 14+ with pgvector extension (handled by Docker)

## 🚀 Quick Start

### Option 1: Full Stack with Docker Compose (Recommended)

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd rag-chatbot
npm install
```

2. **Configure environment:**

```bash
# Create environment file for Docker
cp .env.docker.example .env.docker
# Edit .env.docker and add your OpenAI API key
```

Required in `.env.docker`:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
DB_PASSWORD=postgres
```

3. **Start all services:**

```bash
docker compose up -d
```

This starts:
- PostgreSQL with pgvector (port 5432)
- Backend API with auto-migrations (port 3001)
- Frontend UI (port 3000)

4. **Seed the database with sample data (optional):**

```bash
# Access the backend container
docker exec -it rag-chatbot-backend sh
cd backend
npm run db:seed
npm run db:seed:embeddings
exit
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

### Option 2: Local Development (Separate Services)

1. **Install dependencies:**

```bash
npm install
```

2. **Start PostgreSQL with Docker:**

```bash
# Start only the database
docker compose up -d postgres
```

3. **Configure backend environment:**

```bash
cd backend
cat > .env << EOF
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Database (matches docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rag_chatbot
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_MAX=20

# OpenAI
OPENAI_API_KEY=sk-your-actual-openai-key-here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1000

# Vector Search
EMBEDDING_DIMENSION=1536
SIMILARITY_THRESHOLD=0.2
MAX_SOURCES=5
EOF
```

4. **Run database migrations:**

```bash
# From backend directory
npm run db:migrate
```

5. **Seed sample data (optional):**

```bash
npm run db:seed
npm run db:seed:embeddings
```

6. **Start backend:**

```bash
# From repo root
npm run dev:backend

# Or from backend directory
cd backend && npm run dev
```

Backend runs at http://localhost:3001

7. **Start frontend (in a new terminal):**

```bash
# From repo root
npm run dev:frontend

# Or from frontend directory
cd frontend && npm run dev
```

Frontend runs at http://localhost:5173

## Workspaces and Scripts

At the repository root (`package.json`), common scripts are provided:

- `dev:backend` — run backend in watch mode
- `build:backend` — build backend
- `dev:frontend` — run frontend in dev mode
- `build:frontend` — build frontend
- `dev:common-ui` / `build:common-ui` — develop or build the shared UI package

If the workspace scripts do not run in your environment, navigate into each package folder and run the equivalent local script (`npm run dev`, `npm run build`).

## Backend

- Runtime: Node.js + Express
- Language/Tools: TypeScript, tsx (hot reload), ESLint
- Security/Utils: Helmet, CORS, Morgan
- Database: Postgres with pgvector (via `pg` and `pgvector`), configured via `DATABASE_URL`

### Scripts (from `backend/`)

- `npm run dev` — start development server with hot reload
- `npm run build` — type-check and emit JS to `dist/`
- `npm start` — run built server from `dist/`
- `npm run lint` — run ESLint
- `npm run type-check` — TypeScript type checking
- Database utilities:
  - `npm run db:migrate` — run schema migrations
  - `npm run db:seed` — seed baseline data
  - `npm run db:seed:embeddings` — generate/seed embeddings
  - `npm run db:cleanup` — remove null/invalid embeddings
  - `npm run db:inspect` — inspect embeddings
  - `npm run db:test-search` — quick vector search check

### API Endpoints (summary)

- Health check
  - `GET /api/health`
- Chat
  - `POST /api/chat`
    - Body:
      ```json
      {
        "message": "Your question here",
        "conversationId": "optional-conversation-id"
      }
      ```
- Conversation history
  - `GET /api/chat/history/:conversationId`

## Frontend

- Framework: React 18 + Vite
- Styling: Tailwind CSS (+ tailwind-merge, tailwindcss-animate)
- UI: Uses shared components from `common-ui`

### Scripts (from `frontend/`)

- `npm run dev` — start Vite dev server (default http://localhost:5173)
- `npm run build` — type-check and build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Shared UI (`common-ui`)

A local package with reusable UI components/styles consumed by the frontend.

### Scripts (from `common-ui/`)

- `npm run dev` — develop/watch components
- `npm run build` — build the package

## 📦 Docker Commands

**Start all services:**
```bash
docker compose up -d
```

**Stop all services:**
```bash
docker compose down
```

**View logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

**Rebuild after code changes:**
```bash
docker compose up -d --build
```

**Access container shell:**
```bash
# Backend
docker exec -it rag-chatbot-backend sh

# Frontend
docker exec -it rag-chatbot-frontend sh

# Database
docker exec -it rag-chatbot-postgres psql -U postgres -d rag_chatbot
```

## 🚀 Production Deployment

### Deploy to Render.com

This project is pre-configured for deployment to Render.com using the `render.yaml` blueprint.

**Features:**
- ✅ Automatic database migrations on deployment
- ✅ PostgreSQL with pgvector extension
- ✅ Auto-scaling and health checks
- ✅ Separate backend and frontend services
- ✅ Environment variable management

**Steps:**

1. **Push your code to GitHub/GitLab**

2. **Create a new Blueprint Instance on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint Instance"
   - Connect your repository
   - Select branch (usually `main`)

3. **Configure environment variables:**
   - Render will auto-detect `render.yaml`
   - You'll be prompted to enter your `OPENAI_API_KEY`
   - All other variables are pre-configured

4. **Deploy:**
   - Click "Apply" to create all services
   - Render will:
     - Create PostgreSQL database with pgvector
     - Build and deploy backend with automatic migrations
     - Build and deploy frontend
     - Link services together

5. **Seed the database (optional):**

```bash
# Use Render shell (from backend service dashboard)
npm run db:seed
npm run db:seed:embeddings
```

6. **Access your deployed app:**
   - Frontend: `https://rag-chatbot-frontend.onrender.com`
   - Backend API: `https://rag-chatbot-backend.onrender.com`

**Cost Estimate (Render Free Tier):**
- 2 Web Services (frontend + backend): Free
- 1 PostgreSQL Database: Free (with limitations)
- Total: $0/month (with free tier limitations)

### Deploy to Other Platforms

The project includes Dockerfiles for both frontend and backend, making it easy to deploy to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Fly.io

**Key requirements:**
- PostgreSQL 14+ with pgvector extension
- Node.js 18+ runtime
- Set all required environment variables
- Ensure backend can access database
- Set `VITE_API_URL` build arg for frontend

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 16 with pgvector extension
- **Vector Search:** Cosine similarity with IVFFlat indexing
- **AI Integration:** OpenAI SDK (embeddings + chat completions)
- **Dev Tools:** tsx (watch mode), ESLint

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (ScrollArea, etc.)
- **Icons:** Lucide React

### Infrastructure
- **Monorepo:** npm workspaces
- **Containerization:** Docker + Docker Compose
- **Deployment:** Render.com (with Blueprint)
- **Web Server:** Nginx (production frontend)

## 📖 API Documentation

### Endpoints

**Health Check:**
- `GET /api/health` - Check API status and uptime

**Chat:**
- `POST /api/chat` - Send a message and get AI response with RAG
  - Body: `{ message: string, conversationId?: string }`
  - Returns: AI response with source citations and token usage

**History:**
- `GET /api/chat/history/:conversationId` - Get conversation history

**Document Management:**
- `POST /api/chat/ingest` - Ingest documents into vector database
  - Body: `{ documents: Array<{ content: string, metadata?: object }> }`

**Stats:**
- `GET /api/chat/stats` - Get vector database statistics

See `backend/README.md` for detailed API documentation with examples.

## 🧪 Database Utilities

The backend includes several utility scripts for database management:

```bash
cd backend

# Run migrations (creates tables, indexes, etc.)
npm run db:migrate

# Seed sample data
npm run db:seed

# Generate and seed embeddings for existing documents
npm run db:seed:embeddings

# Clean up null/invalid embeddings
npm run db:cleanup

# Inspect existing embeddings
npm run db:inspect

# Test vector search functionality
npm run db:test-search
```

## 🐛 Troubleshooting

### Common Issues

**1. Docker port conflicts:**
```bash
# Check what's using the port
lsof -i :5432  # or :3001, :3000

# Change ports in docker-compose.yml or .env files
```

**2. Database connection errors:**
```bash
# Ensure PostgreSQL is running
docker compose ps

# Check database logs
docker compose logs postgres

# Test connection manually
docker exec -it rag-chatbot-postgres psql -U postgres -d rag_chatbot
```

**3. OpenAI API errors:**
- Verify your API key is valid
- Check your OpenAI account has credits
- Ensure API key is properly set in `.env` or `.env.docker`

**4. Workspace script issues:**
```bash
# If root scripts fail, run directly in each directory:
cd backend && npm run dev
cd frontend && npm run dev
```

**5. Missing environment variables:**
```bash
# Backend requires these minimum variables:
OPENAI_API_KEY=sk-...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rag_chatbot
DB_USER=postgres
DB_PASSWORD=postgres
```

**6. Frontend can't reach backend:**
- Check `VITE_API_URL` in frontend `.env`
- For local dev: Should be `http://localhost:3001`
- For Docker: Set in `docker-compose.yml` build args

**7. Migrations not running:**
```bash
# Manually run migrations
cd backend
npm run db:migrate

# Or in Docker
docker exec -it rag-chatbot-backend sh
cd backend && npm run db:migrate
```

### Getting Help

1. Check backend logs: `docker compose logs backend`
2. Check frontend logs: `docker compose logs frontend`
3. Check database logs: `docker compose logs postgres`
4. Verify all environment variables are set correctly
5. Ensure Docker containers are healthy: `docker compose ps`

## 📚 Additional Documentation

- `backend/README.md` - Detailed backend documentation and API reference
- `backend/SETUP.md` - PostgreSQL and pgvector setup guide
- `backend/OPENAI_INTEGRATION.md` - OpenAI integration details and best practices
- `frontend/README.md` - Frontend component documentation
- `common-ui/README.md` - Shared UI component library docs
- `DOCKER_DEPLOYMENT.md` - Docker deployment guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT