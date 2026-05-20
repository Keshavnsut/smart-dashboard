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
- `COOKIE_SECURE` (`true` | `false`) (optional; defaults to `true` when `NODE_ENV=production`)
- `CORS_ORIGIN`

### Frontend (`apps/frontend/.env`)

- `VITE_API_BASE_URL` (optional; defaults to `/api`)

## Deployment

### Render (recommended)

This repo is configured for Render Docker web services using `render.yaml`.

#### Option A: Blueprint deploy (fastest)

1. Push `main` with latest `render.yaml`.
2. In Render, create a Blueprint from the repo.
3. Set backend secret env vars when prompted:
   - `MONGO_URI`
   - `JWT_SECRET`

`render.yaml` already defines:
- backend service (`smart-dashboard-backend`) with `initialDeployHook: node dist/scripts/seed.js`
- frontend service (`smart-dashboard-frontend`) with `API_HOSTPORT=smart-dashboard-backend:4000`

#### Option B: Create services manually

Backend web service (Docker):
- Dockerfile path: `apps/backend/Dockerfile`
- Docker context: `.`
- Env vars:
  - `NODE_ENV=production`
  - `PORT=4000`
  - `MONGO_URI=<your atlas uri>`
  - `JWT_SECRET=<32+ char secret>`
  - `COOKIE_SECURE=true`

Frontend web service (Docker):
- Dockerfile path: `apps/frontend/Dockerfile`
- Docker context: `.`
- Env vars:
  - `PORT=80`
  - `API_HOSTPORT=smart-dashboard-backend:4000`

Important for frontend proxy:
- `API_HOSTPORT` must be backend host:port only.
- Do not include `http://` or `https://` unless intentionally using public URL routing.
- Do not include trailing `/`.

If using backend public hostname instead of internal service DNS:
- Use `API_HOSTPORT=<backend-host>.onrender.com:443`.

### Render troubleshooting

- `502 Bad Gateway` from frontend:
  - Backend may be sleeping on free tier. Wake it by visiting backend URL once.
  - Confirm `API_HOSTPORT` points to backend, not frontend.
  - Frontend nginx is configured with `proxy_ssl_server_name on` and longer timeouts for cold starts.

- `508 Loop Detected`:
  - Frontend is proxying to itself.
  - Fix `API_HOSTPORT` to backend service host.

- Mongo auth errors on backend:
  - Verify Atlas username/password.
  - Percent-encode special characters in password.
  - Ensure Atlas network access allows Render.

### Seeded admin account (initial deploy)

On first successful backend deploy, seed creates:
- Email: `admin@example.com`
- Password: `Password123!`

Change this password after first login.

## CI (GitHub Actions)

This repo includes `.github/workflows/ci-deploy.yml` to build and push Docker images from `main`.

Optional registry secrets:
- `DOCKER_REGISTRY`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `DOCKER_REPO`

Optional SSH deploy secrets:
- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PORT` (default `22`)
- `DEPLOY_PATH` (default `/var/www/smart-dashboard`)

Manual server deploy command:

```bash
docker compose -f docker-compose.prod.yml up -d --remove-orphans --build
```

Security notes:
- Do not commit secrets.
- Use strong `JWT_SECRET` and managed MongoDB with proper network rules.
