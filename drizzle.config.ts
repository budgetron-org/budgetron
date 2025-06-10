import { defineConfig } from 'drizzle-kit'

// assert the required env variables
console.assert(
  process.env.DB_URL,
  '❌ Incorrect environment variables: DB_URL is required',
)

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
    ssl: false,
  },
  out: './src/server/db/migrations',
  schema: './src/server/db/schema.ts',
  casing: 'snake_case',
  strict: true,
  migrations: {
    schema: 'public',
    table: 'drizzle_migrations',
  },
})
