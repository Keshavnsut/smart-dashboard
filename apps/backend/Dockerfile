# syntax=docker/dockerfile:1

FROM node:22-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm ci -w @sld/backend

FROM node:22-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY --from=deps /app/apps/backend/package.json ./apps/backend/package.json

COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY apps/backend/src ./apps/backend/src

RUN npm run build -w @sld/backend

FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm ci --omit=dev -w @sld/backend

COPY --from=build /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend
EXPOSE 4000

CMD ["node", "dist/server.js"]
