import { customType, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { CurrencyCode } from '~/data/currencies'

/**
 * Common schema columns
 */
const id = uuid().primaryKey().defaultRandom()
const createdAt = timestamp().notNull().defaultNow()
const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

const currencyType = customType<{ data: CurrencyCode }>({
  dataType() {
    return 'text'
  },
})

export { createdAt, currencyType, id, updatedAt }
