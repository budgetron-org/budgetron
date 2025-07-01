import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

async function runMigration() {
  console.log('⏳ Running DB migration...')

  // assert the required env variables
  console.assert(
    process.env.DB_URL,
    '❌ Incorrect environment variables: DB_URL is required',
  )

  const db = drizzle({
    client: new Pool({
      connectionString: process.env.DB_URL,
    }),
    casing: 'snake_case',
  })

  try {
    // TODO: Infer these from drizzle config
    await migrate(db, {
      migrationsFolder: './migrations',
      migrationsSchema: 'public',
      migrationsTable: '__drizzle_migrations',
    })
    console.log('✅ DB migration completed successfully')
  } catch (error) {
    console.error(`❌ DB migration failed: ${error}`)
  }
}

runMigration().catch((error) =>
  console.error(`❌ DB migration failed: ${error}`),
)
