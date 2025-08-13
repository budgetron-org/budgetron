import { db } from '~/server/db'

function getDomainFromUrl(url: string) {
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^./]+)\./)
  return match ? match[1] : ''
}

async function getCurrencyExchangeRateForUser(userId: string) {
  // get Base Currency from user settings and conversion rate
  const userSettings = await db.query.UserSettingsTable.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  })
  const baseCurrency = userSettings?.currency ?? 'USD'
  const exchangeRatesResult = await db.query.CurrencyRateTable.findMany({
    where: (t, { eq }) => eq(t.targetCurrency, baseCurrency),
  })

  // create a map of currency to conversion rate
  const exchangeRates = new Map(
    exchangeRatesResult.map((rate) => [rate.sourceCurrency, rate]),
  )

  return {
    baseCurrency,
    exchangeRates,
    ...(exchangeRatesResult[0]?.source && {
      currencyExchangeAttribution: {
        text: `(Exchange rates by ${getDomainFromUrl(
          exchangeRatesResult[0].source,
        )})`,
        url: exchangeRatesResult[0].source,
      },
    }),
  }
}

export { getCurrencyExchangeRateForUser }
