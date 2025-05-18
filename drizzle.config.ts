import { defineConfig } from 'drizzle-kit'
import { env } from './src/env/server'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL,
    ssl: false,
  },
  out: './src/server/db/migrations',
  schema: './src/server/db/schema.ts',
  casing: 'snake_case',
  strict: true,
})
