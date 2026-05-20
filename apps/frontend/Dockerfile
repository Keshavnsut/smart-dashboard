# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/backend/package.json ./apps/backend/package.json

RUN npm ci -w @sld/frontend

COPY apps/frontend/index.html ./apps/frontend/index.html
COPY apps/frontend/vite.config.ts ./apps/frontend/vite.config.ts
COPY apps/frontend/tsconfig*.json ./apps/frontend/
COPY apps/frontend/postcss.config.cjs ./apps/frontend/postcss.config.cjs
COPY apps/frontend/tailwind.config.cjs ./apps/frontend/tailwind.config.cjs
COPY apps/frontend/public ./apps/frontend/public
COPY apps/frontend/src ./apps/frontend/src

RUN npm run build -w @sld/frontend

FROM nginx:1.27-alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
