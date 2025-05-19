# Build arguments
ARG PORT=3000
ARG CI=false

FROM node:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
# See https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
ARG CI
# Set CI environment variable
ENV CI=${CI}
# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1
# Make sure to use 0.0.0.0 as host
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE ${PORT}
CMD ["node", "server.js"]
