import type { CurrencyCode } from '~/data/currencies'
import { mul } from '~/lib/currency-operations'
import type { CurrencyRateTable } from '~/server/db/schema'
import type { DetailedTransaction, TransactionWithRelations } from '../types'

type CurrencyExchangeGeneratorOptions = {
  baseCurrency: CurrencyCode
  baseCurrencyExchangeRates: Map<
    CurrencyCode,
    typeof CurrencyRateTable.$inferSelect
  >
}

function currencyExchangeGenerator<
  T extends TransactionWithRelations & Pick<DetailedTransaction, 'cashFlow'>,
>({
  baseCurrency,
  baseCurrencyExchangeRates,
}: CurrencyExchangeGeneratorOptions) {
  return (transaction: T) => {
    // If the transaction is in baseCurrency no need to convert
    if (transaction.currency === baseCurrency) {
      return {
        ...transaction,
        currencyExchangeDetails: {
          hasConversionRate: true,
          amountInBaseCurrency: transaction.amount,
          baseCurrency,
          conversionRate: '1.0000000000',
          date: new Date(),
        },
      } satisfies DetailedTransaction
    }
    const conversionRate = baseCurrencyExchangeRates.get(transaction.currency)
    // If there is no conversion rate use 0 in base currency
    if (!conversionRate) {
      return {
        ...transaction,
        currencyExchangeDetails: {
          hasConversionRate: false,
          amountInBaseCurrency: '0',
          baseCurrency,
          conversionRate: '0',
          date: new Date(),
        },
      } satisfies DetailedTransaction
    }

    // otherwise convert
    return {
      ...transaction,
      currencyExchangeDetails: {
        hasConversionRate: true,
        amountInBaseCurrency: mul(transaction.amount, conversionRate.rate),
        baseCurrency,
        conversionRate: conversionRate.rate,
        date: conversionRate.date,
      },
    } satisfies DetailedTransaction
  }
}

export { currencyExchangeGenerator }
