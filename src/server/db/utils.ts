import { timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Common schema columns
 */
const id = uuid().primaryKey().defaultRandom()
const createdAt = timestamp().notNull().defaultNow()
const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export { id, createdAt, updatedAt }
