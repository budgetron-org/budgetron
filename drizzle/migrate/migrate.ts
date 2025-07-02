import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { resolve } from 'node:path'
import { Pool } from 'pg'

if (process.argv.includes('--help')) {
  console.log(`
Usage:
  node migrate.js --db-url=postgres://... [options]

Options:
  --db-url=STRING              [required] Postgres connection string
  --migrations-folder=PATH     Path to migration .sql files (default: ./migrations)
  --migrations-schema=NAME     DB schema used for tracking (default: public)
  --migrations-table=NAME      DB table used for tracking (default: __drizzle_migrations)
`)
  process.exit(0)
}

function getArgValue(flag: string): string | null {
  const arg = process.argv.find((arg) => arg.startsWith(`--${flag}=`))
  return arg ? (arg.split('=')[1] ?? null) : null
}

const dbUrl = getArgValue('db-url')
const migrationsFolder = resolve(
  process.cwd(),
  getArgValue('migrations-folder') ?? './migrations',
)
const migrationsSchema = getArgValue('migrations-schema') ?? 'public'
const migrationsTable =
  getArgValue('migrations-table') ?? '__drizzle_migrations'

if (!dbUrl) {
  console.error(
    `❌ Missing required argument: --db-url\
    Usage: node migrate.js --db-url=postgres://... --migrations-folder=../migrations --migrations-schema=public --migrations-table=__drizzle_migrations`,
  )
  process.exit(1)
}

async function runMigration() {
  console.log('⏳ Running DB migration...')

  const db = drizzle({
    client: new Pool({
      connectionString: dbUrl!,
    }),
    casing: 'snake_case',
  })

  try {
    // TODO: Infer these from drizzle config
    await migrate(db, {
      migrationsFolder,
      migrationsSchema,
      migrationsTable,
    })
    console.log('✅ DB migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error(`❌ DB migration failed: ${error}`)
    process.exit(1)
  }
}

runMigration().catch((error) => {
  console.error(`❌ DB migration failed: ${error}`)
  process.exit(1)
})
