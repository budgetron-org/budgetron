#!/bin/sh
set -e

# Configurable max wait time (default: 30s)
MAX_WAIT="${MAX_WAIT:-30}"
count=0

echo "⏳ Waiting for database using DB_URL..."

until pg_isready -d "$DB_URL"; do
  count=$((count + 1))
  if [ "$count" -ge "$MAX_WAIT" ]; then
    echo "❌ DB unavailable after ${MAX_WAIT}s, exiting."
    exit 1
  fi
  sleep 1
done

echo "📦 Running DB migration..."
node drizzle/migrate/migrate.js \
  --db-url="$DB_URL" \
  --migrations-folder="drizzle/migrations" \
  --migrations-schema="public" \
  --migrations-table="__drizzle_migrations"

echo "✅ DB migration completed."

echo "🚀 Starting server..."
exec node server.js
