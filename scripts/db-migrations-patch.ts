/**
 * This script will drop the migration table and create a new one.
 * Then it will hard sync the migrations table with the migrations folder.
 * See https://github.com/drizzle-team/drizzle-orm/discussions/1604#discussioncomment-12194312
 */

import { type MigrationConfig, readMigrationFiles } from 'drizzle-orm/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { PgDialect, PgSession } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'
import drizzleConfig from '../drizzle.config'

const config = {
  ...drizzleConfig,
  migrationsFolder: drizzleConfig.out,
  migrationsTable: drizzleConfig.migrations?.table ?? '__drizzle_migrations',
  migrationsSchema: drizzleConfig.migrations?.schema ?? 'drizzle',
} as MigrationConfig

const db = drizzle({
  client: new Pool({
    connectionString: process.env.DB_URL!,
  }),
  casing: 'snake_case',
})

const migrations = readMigrationFiles(config)
const table_name = `${config.migrationsSchema}.${config.migrationsTable}`

async function main() {
  console.log('~..................¯\\_(ツ)_/¯..................~')
  console.log('Drizzle Migration Hardsync')
  console.log('~...............................................~')
  console.log(
    'If you `drizzle-kit push` you ruin the migration history.\r\nThis script will drop the migration table and create a new one.',
  )
  console.log('~...............................................~')
  console.log('~...............................................~')

  console.log(`... Dropping Existing Migration Table - ${table_name}`)
  // Drop the migration table if it exists
  await db.execute(`DROP TABLE IF EXISTS ${table_name}`)
  console.log('... Existing Migration Table Dropped')

  console.log(`... Creating Migration Table - ${table_name}`)
  // Since we pass no migrations, it only creates the table.
  const _db = db as typeof db & { dialect: PgDialect; session: PgSession }
  await _db.dialect.migrate([], _db.session, config)
  console.log(`... Migration Table Created - ${table_name}`)
  console.log(`... Inserting ${migrations.length} Migrations`)

  const promises: Promise<void>[] = []
  for (const migration of migrations) {
    console.log(`... Applying migration ${migration.hash}`)

    // Add migration hashes to migration table
    promises.push(
      db
        .execute(
          `INSERT INTO ${table_name} (hash, created_at) VALUES ('${migration.hash}', ${migration.folderMillis})`,
        )
        .then(() => console.log(`... Applied migration ${migration.hash}`)),
    )
  }

  await Promise.all(promises)

  console.log('~...............................................~')
  console.log('~.. Migration Hardsync Complete! ˶ᵔ ᵕ ᵔ˶........~')
  console.log('~...............................................~')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
