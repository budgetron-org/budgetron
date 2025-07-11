import { z } from 'zod/v4'

import { CURRENCY_CODES } from '~/data/currencies'
import { db } from '~/server/db'
import { CurrencyRateTable } from '~/server/db/schema'

type CurrencyRateRow = typeof CurrencyRateTable.$inferInsert

// TODO: Should this be configurable?
const CURRENCY_RATE_URL = 'https://open.er-api.com/v6/latest/'
// Currently we store rates of all currencies with respect to the base currency.
// Then we can use the base currency to convert to any other currency.
// For example, if we have the base currency as USD
// You want INR → EUR:
// USD → EUR = 0.92
// USD → INR = 83.2
// So:
// rate(INR → EUR) = 0.92 / 83.2 = ~0.01105
// This means ₹1000 = €11.05
const BASE_CURRENCY = 'USD'

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
  // rates: z.record(z.enum(CURRENCY_CODES), z.number()), // Make sure we have all the supported currencies
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

  await db
    .insert(CurrencyRateTable)
    .values(
      CURRENCY_CODES
        // Exclude the base currency
        .filter((currency) => currency !== BASE_CURRENCY)
        .map<CurrencyRateRow>((currency) => {
          return {
            source: data.provider,
            sourceCurrency: data.base_code,
            targetCurrency: currency,
            rate: data.rates[currency].toString(),
            date: new Date(data.time_last_update_utc),
          }
        }),
    )
    .onConflictDoUpdate({
      target: [
        CurrencyRateTable.sourceCurrency,
        CurrencyRateTable.targetCurrency,
        CurrencyRateTable.date,
        CurrencyRateTable.source,
      ],
      set: {
        rate: CurrencyRateTable.rate,
        date: CurrencyRateTable.date,
        updatedAt: new Date(),
      },
    })
}

export { runCurrencyRateSync }
