import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '~/env/server'
import * as schema from './schema'

const db = drizzle({
  client: new Pool({
    connectionString: env.DB_URL,
  }),
  casing: 'snake_case',
  schema,
})

export { db }
