import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '~/env/server'
import * as schema from './schema'

const db = drizzle({
  client: new Pool({
    host: env.DB_HOST,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  }),
  casing: 'snake_case',
  schema,
})

export { db }
