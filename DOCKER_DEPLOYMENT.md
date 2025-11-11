# Docker Deployment Guide

## Overview

This project is now fully configured for Docker Compose deployment from this monorepo. All services build and run correctly.

## Changes Made During Migration

### 1. Package Configuration
- **Frontend package.json**: Changed `"@render-rag-chatbot/common-ui": "workspace:*"` to `"*"` for Docker compatibility
- **All source files**: Updated imports from `@render-ai-templates/common-ui` to `@render-rag-chatbot/common-ui`
- **package-lock.json**: Regenerated to sync with updated package.json files

### 2. Dockerfiles Updated

#### Backend Dockerfile
- Uses `npm ci --verbose` for reliable, reproducible builds
- Multi-stage build: builder stage + production stage
- Production stage installs only production dependencies
- Consistent use of `node:20-alpine`

#### Frontend Dockerfile  
- Uses `npm ci --verbose` for reliable builds
- Builds common-ui first, then frontend
- Multi-stage build: builder (node) + production (nginx)
- Default VITE_API_URL set to `http://localhost:3001`
- Consistent use of `node:20-alpine`

### 3. Docker Compose Configuration
- Added `VITE_API_URL` build argument to frontend service
- All services use `.env.docker` for configuration
- Proper healthcheck on PostgreSQL with dependency in backend

## Quick Start

### Prerequisites
- Docker or Podman installed
- `.env.docker` file with required environment variables (especially `OPENAI_API_KEY`)

### Commands

```bash
# Build and start all services
docker-compose up --build -d

# Or with podman
podman compose up --build -d

# View logs
docker-compose logs -f
podman compose logs -f

# Stop all services
docker-compose down
podman compose down

# Stop and remove volumes (clears database)
docker-compose down -v
podman compose down -v

# Check service status
docker-compose ps
podman compose ps
```

## Services

Once running, the services are available at:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React UI (nginx) |
| Backend API | http://localhost:3001 | Express API |
| PostgreSQL | localhost:5432 | Database with pgvector |

## Environment Variables

Key variables in `.env.docker`:

### Required
- `OPENAI_API_KEY` - Your OpenAI API key for embeddings and chat

### Database
- `DB_PASSWORD` - PostgreSQL password (default: postgres)
- `DB_HOST` - Database host (default: postgres for Docker)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: rag_chatbot)

### API Configuration
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - Environment (default: production)
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:3000)

### OpenAI Settings
- `OPENAI_EMBEDDING_MODEL` - Embedding model (default: text-embedding-3-small)
- `OPENAI_CHAT_MODEL` - Chat model (default: gpt-4-turbo-preview)
- `OPENAI_TEMPERATURE` - Temperature (default: 0.7)
- `OPENAI_MAX_TOKENS` - Max tokens (default: 1000)

### RAG Settings
- `EMBEDDING_DIMENSION` - Embedding dimensions (default: 1536)
- `SIMILARITY_THRESHOLD` - Similarity threshold (default: 0.2)
- `MAX_SOURCES` - Max sources returned (default: 5)

## Monorepo Structure

```
rag-chatbot/
├── backend/          # Express API with RAG
│   ├── Dockerfile    # Multi-stage backend build
│   └── src/          # TypeScript source
├── frontend/         # React UI
│   ├── Dockerfile    # Multi-stage frontend build  
│   └── src/          # TypeScript/React source
├── common-ui/        # Shared UI components
│   └── src/          # Shared components
├── docker-compose.yml # Service orchestration
├── package.json      # Root workspace config
└── .env.docker       # Environment variables
```

## Build Process

### Backend Build Flow
1. Install all monorepo dependencies (`npm ci`)
2. Build backend TypeScript (`npm run build -w backend`)
3. Production stage: Install only production deps
4. Copy compiled JavaScript
5. Run `npm start` (executes `node dist/index.js`)

### Frontend Build Flow
1. Install all monorepo dependencies (`npm ci`)
2. Build common-ui library (`npm run build -w common-ui`)
3. Build frontend with Vite (`npm run build -w frontend`)
4. Production stage: Copy built files to nginx
5. Serve static files with nginx

## Troubleshooting

### Build Fails with "npm ci" Error
The lockfile may be out of sync. Regenerate it:
```bash
npm install
git add package-lock.json
```

### Container Name Already in Use
Remove old containers:
```bash
# Docker
docker rm -f rag-chatbot-postgres rag-chatbot-backend rag-chatbot-frontend

# Podman
podman rm -f rag-chatbot-postgres rag-chatbot-backend rag-chatbot-frontend
```

### Frontend Can't Reach Backend
Check that `VITE_API_URL` is set correctly in docker-compose.yml. For containers to communicate, use the service name:
```yaml
args:
  VITE_API_URL: http://backend:3001
```

For local browser access, use:
```yaml
args:
  VITE_API_URL: http://localhost:3001
```

### Database Connection Issues
1. Check PostgreSQL logs: `docker-compose logs postgres`
2. Verify healthcheck is passing: `docker-compose ps`
3. Ensure `.env.docker` has correct DB_PASSWORD

### Clear Cache and Rebuild
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build --no-cache
```

## Production Deployment

For production (e.g., Render.com):

1. Update `VITE_API_URL` to point to your production backend URL
2. Use environment-specific .env files
3. Set `NODE_ENV=production`
4. Configure proper database credentials
5. Enable SSL/TLS for database connections
6. Review security settings in backend (CORS, helmet, etc.)

See `render.yaml` for Render.com deployment configuration.

## Development vs Production

### Development (Local)
- Run without Docker: `npm run dev:backend` and `npm run dev:frontend`
- Hot reload enabled
- Source maps available
- Verbose logging

### Production (Docker)
- Optimized builds with minification
- No dev dependencies
- Multi-stage builds for smaller images
- Nginx for efficient static file serving
- Production-ready database with persistence

## Notes

- The `version` field in docker-compose.yml is obsolete but harmless
- All containers use node:20-alpine for consistency
- PostgreSQL uses the ankane/pgvector image for vector search support
- Frontend is served by nginx in production for better performance
- All builds use `npm ci` for reproducible, reliable installs

