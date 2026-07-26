# SentinelAI Deployment & Operations Guide

## 🐳 Docker Production Deployment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Start the full application stack:
   ```bash
   docker compose up --build -d
   ```

3. Verify service health:
   ```bash
   docker compose ps
   ```

Services included:
- `postgres`: PostgreSQL 15 Database (Healthcheck via `pg_isready`)
- `redis`: Redis 7 Cache & PubSub (Healthcheck via `redis-cli ping`)
- `backend`: FastAPI app (Waits for healthy DB and Redis)
- `frontend`: React Nginx bundle
