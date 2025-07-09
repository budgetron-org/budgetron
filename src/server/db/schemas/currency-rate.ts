import { date, decimal, pgTable, text, unique } from 'drizzle-orm/pg-core'

import { createdAt, id, updatedAt } from '../utils'

const CurrencyRateTable = pgTable(
  'currency_rates',
  {
    id,
    from: text().notNull(),
    to: text().notNull(),
    date: date({ mode: 'date' }).notNull(),
    rate: decimal().notNull(),
    source: text().notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.from, t.to, t.date, t.source)],
)

export { CurrencyRateTable }
