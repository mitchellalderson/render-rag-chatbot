# RAG Chatbot Monorepo

A full-stack Retrieval-Augmented Generation (RAG) chatbot example with OpenAI integration. Built as an npm workspaces monorepo with TypeScript/Express backend, React/Vite frontend, PostgreSQL with pgvector, and a shared UI component library.

## 📋 Table of Contents

- [Deploy to Render](#-deploy-to-render)
- [Features](#-features)
- [Repository Structure](#-repository-structure)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Docker Commands](#-docker-commands)
- [Troubleshooting](#-troubleshooting)
- [Additional Documentation](#-additional-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Deploy to Render

This project is pre-configured for one-click deployment to Render.com using the included `render.yaml` blueprint.

**What you get:**
- ✅ Automatic database migrations on deployment
- ✅ PostgreSQL with pgvector extension
- ✅ Auto-scaling and health checks
- ✅ Separate backend and frontend services
- ✅ Environment variable management

**Deployment steps:**

1. **Fork this repository to your GitHub account**

2. **Create a new Blueprint Instance on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint Instance"
   - Connect your forked repository
   - Select branch (usually `main`)

3. **Configure environment variables:**
   - Render will auto-detect `render.yaml`
   - You'll be prompted to enter your `OPENAI_API_KEY` ([Get one here](https://platform.openai.com/api-keys))
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
   - Frontend: `https://your-app-name-frontend.onrender.com`
   - Backend API: `https://your-app-name-backend.onrender.com`

**Cost Estimate (Render Free Tier):**
- 2 Web Services (frontend + backend): Free
- 1 PostgreSQL Database: Free (with limitations)
- Total: $0/month (with free tier limitations)

## ✨ Features

- 🤖 **RAG-Powered Responses** - Semantic search over document knowledge base using vector embeddings
- 💬 **Conversation History** - Persistent multi-turn conversations with context awareness
- 📚 **Source Citations** - Shows which documents informed each response
- 🎯 **Real-time Token Usage** - Visual context window usage tracking
- 🚀 **Easy Deployment** - One-click Render.com deployment with automated migrations

## 📁 Repository Structure

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

## 🚀 Quick Start with Docker

**Requirements:**
- Docker & Docker Compose
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

**Setup:**

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

4. **Access the application:**

Open http://localhost:3000 in your browser

5. **Seed the database with sample data (optional):**

```bash
docker exec -it rag-chatbot-backend sh
cd backend
npm run db:seed
npm run db:seed:embeddings
exit
```

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
```

**Rebuild after code changes:**
```bash
docker compose up -d --build
```

## 🐛 Troubleshooting

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
```

**3. OpenAI API errors:**
- Verify your API key is valid at https://platform.openai.com/api-keys
- Check your OpenAI account has credits
- Ensure API key is properly set in `.env.docker` or environment variables

**4. Frontend can't reach backend:**
- For local dev: Frontend should connect to `http://localhost:3001`
- For Docker: Check `VITE_API_URL` in `docker-compose.yml` build args
- For Render: Services are auto-linked via `render.yaml`

**Getting more help:**
1. Check service logs: `docker compose logs <service-name>`
2. Verify all environment variables are set correctly
3. Ensure Docker containers are healthy: `docker compose ps`
4. See detailed troubleshooting in `backend/README.md`

## 📚 Additional Documentation

- `backend/README.md` - Detailed backend documentation and API reference
- `backend/SETUP.md` - PostgreSQL and pgvector setup guide
- `backend/OPENAI_INTEGRATION.md` - OpenAI integration details and best practices
- `frontend/README.md` - Frontend component documentation
- `common-ui/README.md` - Shared UI component library docs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
