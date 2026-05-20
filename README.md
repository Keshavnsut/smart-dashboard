# Smart Leads Dashboard

A production-ready full-stack leads dashboard built with the **MERN stack + TypeScript**.

## Features

- JWT authentication (stored in an **httpOnly cookie**)
- Role-based access control (**Admin / Sales**)
- Leads CRUD
- Advanced filtering + **regex search** (name/email)
- Backend pagination (**10 per page**)
- Debounced search UX
- Backend-generated **CSV export** (Admin only)
- Standardized API responses
- Docker + Docker Compose

## Roles & RBAC

- **First registered user becomes Admin**. All subsequent users become **Sales**.
- **Sales** users can only view/update leads they created.
- **Admin** users can view all leads, delete leads, and export CSV.

## Tech stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod, JWT, Helmet
- **Frontend**: React, Vite, TypeScript, Tailwind, TanStack Query, React Hook Form + Zod

## Local development

### Prereqs

- Node.js 22+
- MongoDB running locally (or a connection string)

### 1) Configure env

Create a backend env file:

- Copy `apps/backend/.env.example` → `apps/backend/.env`
- Set at least:
  - `MONGO_URI`
  - `JWT_SECRET` (must be **32+ chars**)

Frontend env is optional in dev because Vite proxies `/api` to the backend (see `apps/frontend/vite.config.ts`).

### 2) Install + run

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/health

## Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend (direct): http://localhost:4000
- MongoDB: mongodb://localhost:27017

> Note: `docker-compose.yml` sets `NODE_ENV=development` so cookies work over plain HTTP locally.

## API

Base path: `/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Leads

- `GET /leads`
  - Query params:
    - `status` (optional)
    - `source` (optional)
    - `search` (optional; regex search on `name` + `email`)
    - `sort=latest|oldest` (required)
    - `page` (required; 1-based)
- `POST /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `DELETE /leads/:id` (**Admin only**)
- `GET /leads/export/csv` (**Admin only**)

### Standard response shape

Success:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "pagination": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "...",
  "details": {}
}
```

### Pagination

All lead list responses include a `pagination` object:

```json
{
  "currentPage": 1,
  "totalPages": 3,
  "totalRecords": 24,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## Environment variables

### Backend (`apps/backend/.env`)

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (e.g. `1d`)
- `CORS_ORIGIN`

### Frontend (`apps/frontend/.env`)

- `VITE_API_BASE_URL` (optional; defaults to `/api`)

## Deployment / CI

This repo includes a GitHub Actions workflow (`.github/workflows/ci-deploy.yml`) that builds and pushes Docker images when commits are pushed to `main`.

Required GitHub repository secrets (used by the workflow):

- `DOCKER_REGISTRY` — e.g. `docker.io` or your registry hostname
- `DOCKER_USERNAME` — registry username
- `DOCKER_PASSWORD` — registry password or token
- `DOCKER_REPO` — repository path (e.g. `myorg/smart-leads`)

Optional SSH deploy secrets (to enable the `deploy` job):

- `SSH_HOST` — target server IP/hostname
- `SSH_USER` — username for SSH
- `SSH_PRIVATE_KEY` — private key (PEM) for SSH
- `SSH_PORT` — SSH port (defaults to `22`)
- `DEPLOY_PATH` — path on server where the `docker-compose.yml` lives (defaults to `/var/www/smart-dashboard`)

Workflow behavior:

- The `build-and-push` job builds `apps/backend` and `apps/frontend` images and pushes tags:
  - `${{ secrets.DOCKER_REGISTRY }}/${{ secrets.DOCKER_REPO }}:backend-${{ github.sha }}`
  - `${{ secrets.DOCKER_REGISTRY }}/${{ secrets.DOCKER_REPO }}:frontend-${{ github.sha }}`
- If `SSH_HOST` is set, the `deploy` job SSHes to the server and runs `docker compose pull` + `docker compose up -d` in `DEPLOY_PATH`.

Quick deploy (manual server steps):

1. On the server, clone or copy the repository where `docker-compose.yml` is present.
2. Create a production env file (`.env.production`) with the necessary environment variables (Mongo URI, JWT secret, etc.).
3. Pull images (adjust registry/repo/tag as used in your workflow) and restart:

```bash
docker compose pull
docker compose up -d --remove-orphans
```

Security notes:
- Do not commit secrets to the repo. Use GitHub Secrets or your cloud provider's secret manager.
- In production, set `NODE_ENV=production`, provide a strong `JWT_SECRET`, and use a managed MongoDB instance (MongoDB Atlas) with network rules.
