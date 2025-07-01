#!/bin/sh
set -e

MAX_WAIT=30
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

npx tsx ./drizzle/migrate.ts

echo "🚀 Starting server..."
exec node server.js
