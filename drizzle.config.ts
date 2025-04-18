import { env } from '~/env/server'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    host: env.DB_HOST,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: false,
  },
  out: './src/server/db/migrations',
  schema: './src/server/db/schema.ts',
  casing: 'snake_case',
  strict: true,
})
