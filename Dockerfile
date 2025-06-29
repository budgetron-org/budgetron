# Build arguments
ARG PORT=3000
ARG CI=false

# Stage 0: Base image
FROM node:alpine AS base
# See https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
# Also add postgresql-client for db migrations
RUN apk add --no-cache gcompat postgresql-client
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
ARG CI
# Set CI environment variable
ENV CI=${CI}
# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm \
  && pnpm run build \
  && pnpm prune --prod

# Stage 3: Production server
FROM base AS runner
ENV NODE_ENV=production
# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1
# Make sure to use 0.0.0.0 as host
ENV HOSTNAME=0.0.0.0
# Copy the production build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy the DB migration related files
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/server/db/migrations ./src/server/db/migrations

EXPOSE ${PORT}

# Copy and use entrypoint script (make sure it's executable)
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
CMD ["./entrypoint.sh"]
