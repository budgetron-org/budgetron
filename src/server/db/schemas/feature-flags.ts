import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'

const FeatureFlagsTable = pgTable('feature_flags', {
  id,
  name: text().notNull(),
  description: text().notNull(),
  enabled: boolean().notNull().default(false),
  domains: text().array().notNull().default([]),
  createdAt,
  updatedAt,
})

export { FeatureFlagsTable }
