# Build arguments
ARG PORT=3000
ARG CI=false

# ----------------------------------------
# Stage 0: Base image setup
# ----------------------------------------
# Start from a minimal Node Alpine image
# Add gcompat for compatibility and postgresql-client for pg_isready
FROM node:alpine AS base
RUN apk add --no-cache gcompat postgresql-client
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ----------------------------------------
# Stage 1: Install dependencies
# ----------------------------------------
FROM base AS deps
# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY drizzle/migrate/package.json ./drizzle/migrate/
# Enable corepack and install production + dev dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ----------------------------------------
# Stage 2: Build the application and DB migration tooling
# ----------------------------------------
FROM base AS builder

# Build-time ARGs and ENVs
ARG CI
ENV CI=${CI}
ENV DOCKER=true

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/drizzle/migrate/node_modules ./drizzle/migrate/node_modules

# Copy the full app source
COPY . .

# Build the Next.js app & tooling and prune dev dependencies
RUN corepack enable pnpm \
  && pnpm run build \
  && pnpm --filter drizzle-migrate build \
  && pnpm prune --prod --force

# ----------------------------------------
# Stage 3: Production runtime image
# ----------------------------------------
FROM base AS runner

# Runtime environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# ----------------------------------------
# Copy runtime assets from builder
# ----------------------------------------

# Static assets
COPY --from=builder /app/public ./public

# Next.js standalone server
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# ----------------------------------------
# Copy DB migration tooling
# ----------------------------------------

# Drizzle migrations and migration tooling
COPY --from=builder /app/drizzle/migrate/dist ./drizzle/migrate
COPY --from=builder /app/drizzle/migrations ./drizzle/migrations

# ----------------------------------------
# Entrypoint script
# ----------------------------------------

# Copy and ensure it's executable
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Default exposed port
EXPOSE ${PORT}

# Use the entrypoint script on container start
CMD ["./entrypoint.sh"]  
