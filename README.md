# RAG Chatbot Monorepo

Full‑stack Retrieval‑Augmented Generation (RAG) chatbot, organized as an npm workspaces monorepo with a TypeScript/Express backend, a React/Vite frontend, and a shared UI package.

## Repository Structure

```
.
├── backend/            # Express + TypeScript API (RAG + chat endpoints)
├── frontend/           # React + Vite app (chat UI)
├── common-ui/          # Shared UI components and styles
├── docker-compose.yml  # Local services (e.g., Postgres + pgvector)
├── render.yaml         # Deployment configuration
├── package.json        # Root workspaces + scripts
└── README.md
```

Note: Older docs referenced a nested `rag-chatbot/` folder. The current layout places `backend`, `frontend`, and `common-ui` at the repository root.

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, recommended for local Postgres + pgvector)

## Quick Start

1) Install dependencies (root):

```bash
npm install
```

2) Start database with Docker (optional but recommended):

```bash
# Launch services defined in docker-compose.yml
docker compose up -d
```

3) Configure backend environment:

```bash
cd backend
# If an example file exists
cp -n .env.example .env 2>/dev/null || true
# Then edit .env with your values
```

Minimum suggested variables (edit to match your setup):

```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=postgres://postgres:postgres@localhost:5432/rag
PORT=3001
```

4) Run the backend (choose one):

```bash
# From repo root using workspaces (if configured for your environment)
npm run dev:backend

# Or from inside the backend directory
cd backend && npm run dev
```

Backend will listen on http://localhost:3001

5) Run the frontend (choose one):

```bash
# From repo root using workspaces
npm run dev:frontend

# Or from inside the frontend directory
cd frontend && npm run dev
```

Frontend will start on http://localhost:5173 (default Vite port).

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

## Local Database via Docker

- Start services: `docker compose up -d`
- Stop services: `docker compose down`
- View logs: `docker compose logs -f`

The default compose file is intended to run Postgres with pgvector for local development. Ensure `DATABASE_URL` in `backend/.env` matches the compose settings.

## Deployment

- `render.yaml` contains infrastructure configuration for deploying on Render.com or similar platforms. Adjust as needed for your environment.

## Technology Stack

- Backend: Node.js, Express, TypeScript, pg/pgvector, OpenAI SDK
- Frontend: React, Vite, Tailwind CSS
- Monorepo: npm workspaces

## Troubleshooting

- Workspace script paths: if root scripts fail in your environment, run scripts inside each package directory instead.
- Ports in use: change `PORT` in `backend/.env` or Vite port via `--port`.
- Missing environment variables: ensure `OPENAI_API_KEY` and `DATABASE_URL` are set for backend features that require them.

## License

MIT