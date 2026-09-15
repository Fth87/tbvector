# syntax=docker/dockerfile:1.7

FROM oven/bun:1.4.0 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .

ARG PUBLIC_R2_VIDEO_BASE_URL
ENV PUBLIC_R2_VIDEO_BASE_URL=$PUBLIC_R2_VIDEO_BASE_URL

RUN bun run check && bun run build

FROM caddy:2.10-alpine AS runtime

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://127.0.0.1/ || exit 1
