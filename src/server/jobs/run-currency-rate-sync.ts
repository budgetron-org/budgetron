import { Decimal } from 'decimal.js'
import { sql } from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'
import { z } from 'zod/v4'

import { CURRENCY_CODES } from '~/data/currencies'
import { db } from '~/server/db'
import { CurrencyRateTable } from '~/server/db/schema'

type CurrencyRateRow = typeof CurrencyRateTable.$inferInsert

// TODO: Should this be configurable?
const CURRENCY_RATE_URL = 'https://open.er-api.com/v6/latest/'
// Currently we fetch the exchange rate for a base currency
// and calculate all rates for all combinations of currencies
const BASE_CURRENCY = 'USD'
const UNIT_RATE = '1.0000000000' as Intl.StringNumericLiteral

const CurrencyRateResponseSchema = z.object({
  result: z.literal('success'), // failure will fail the parsing
  provider: z.string(),
  time_last_update_unix: z.number(),
  time_last_update_utc: z.string(),
  time_next_update_unix: z.number(),
  time_next_update_utc: z.string(),
  time_eol_unix: z.number(),
  base_code: z.literal(BASE_CURRENCY),
  rates: z.object(
    CURRENCY_CODES.reduce(
      (acc, currency) => {
        acc[currency] = z.number()
        return acc
      },
      {} as Record<(typeof CURRENCY_CODES)[number], z.ZodNumber>,
    ),
  ),
})

async function runCurrencyRateSync() {
  const response = await fetch(`${CURRENCY_RATE_URL}${BASE_CURRENCY}`)
  if (!response.ok) {
    throw new Error('Failed to fetch currency rates')
  }
  const json = await response.json()
  const { success, error, data } = CurrencyRateResponseSchema.safeParse(json)
  if (!success) {
    throw new Error(z.prettifyError(error))
  }

  // calculate all combination of exchange rates
  const rates = Object.entries(data.rates) as [
    (typeof CURRENCY_CODES)[number],
    number,
  ][]
  const rateCombinations: CurrencyRateRow[] = []
  // Some common values
  const source = data.provider
  const date = new Date(data.time_last_update_utc)
  // Calculate all combinations of exchange rates
  for (const [sourceCurrency, sourceRate] of rates) {
    for (const [targetCurrency, targetRate] of rates) {
      if (sourceCurrency === targetCurrency) {
        rateCombinations.push({
          source,
          sourceCurrency,
          targetCurrency,
          rate: UNIT_RATE,
          date,
        })
        continue
      }

      const rate = new Decimal(targetRate)
        .div(sourceRate)
        .toString() as Intl.StringNumericLiteral
      rateCombinations.push({
        source,
        sourceCurrency,
        targetCurrency,
        rate,
        date,
      })
    }
  }

  try {
    await db
      .insert(CurrencyRateTable)
      .values(rateCombinations)
      .onConflictDoUpdate({
        target: [
          CurrencyRateTable.sourceCurrency,
          CurrencyRateTable.targetCurrency,
          CurrencyRateTable.source,
        ],
        set: {
          rate: sql.raw(`excluded.${toSnakeCase(CurrencyRateTable.rate.name)}`),
          date: sql.raw(`excluded.${toSnakeCase(CurrencyRateTable.date.name)}`),
          updatedAt: sql.raw(`now()`),
        },
      })
  } catch (error) {
    console.error('Failed to sync currency rates', error)
  }
}

export { runCurrencyRateSync }
