import { date, decimal, pgTable, text, unique } from 'drizzle-orm/pg-core'

import { createdAt, currencyType, id, updatedAt } from '../utils'

const CurrencyRateTable = pgTable(
  'currency_rates',
  {
    id,
    sourceCurrency: currencyType().notNull(),
    targetCurrency: currencyType().notNull(),
    date: date({ mode: 'date' }).notNull(),
    rate: decimal().notNull(),
    source: text().notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [unique().on(t.sourceCurrency, t.targetCurrency, t.date, t.source)],
)

export { CurrencyRateTable }
