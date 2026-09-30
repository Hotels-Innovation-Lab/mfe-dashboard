# One Dockerfile for every app:  docker build --build-arg APP=analytics -t mfe-analytics .
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
RUN npm install -g pnpm@12.3.4 turbo@2.11.5
WORKDIR /repo

# 1. Prune the monorepo down to the target app and its workspace dependencies.
FROM base AS pruner
ARG APP
COPY . .
RUN turbo prune @mfe/${APP} --docker

# 2. Install (cached on lockfile changes only), then build.
FROM base AS builder
ARG APP
COPY --from=pruner /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
RUN turbo run build --filter=@mfe/${APP}

# 3. Static files served by nginx.
FROM nginx:1.29-alpine
ARG APP
# Restrict in production, e.g. CORS_ORIGIN=https://dashboard.example.com
ENV CORS_ORIGIN="*"
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /repo/apps/${APP}/dist /usr/share/nginx/html
EXPOSE 80
