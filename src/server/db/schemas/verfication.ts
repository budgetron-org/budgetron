import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'

export const VerificationTable = pgTable('verifications', {
  id,
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt,
  updatedAt,
})
