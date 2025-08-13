import { Decimal } from 'decimal.js'
import { unescape } from 'lodash'
import { randomUUID } from 'node:crypto'
import { Ofx } from 'ofx-data-extractor'

import type { DetailedTransaction } from '~/features/transactions/types'
import { getCurrencyExchangeRateForUser } from '~/lib/currency-exchange'
import { safeParseCurrency } from '~/lib/utils'
import { categorizeTransactions } from '~/server/ai/service/categorize-transactions'
import {
  TransactionTypeEnum,
  type BankAccountTable,
  type GroupTable,
} from '~/server/db/schema'
import type { InferResultType } from '~/server/db/types'
import { currencyExchangeGenerator } from './exchange'
import type { CurrencyCode } from '~/data/currencies'

type ParseTransactionsOptions = {
  bankAccount: typeof BankAccountTable.$inferSelect
  categories: InferResultType<'CategoryTable', undefined, { parent: true }>[]
  file: File
  group?: typeof GroupTable.$inferSelect
  shouldAutoCategorize: boolean
  userId: string
}
async function parseTransactions({
  bankAccount,
  categories,
  file,
  group,
  shouldAutoCategorize,
  userId,
}: ParseTransactionsOptions) {
  const ofx = Ofx.fromBuffer(Buffer.from(await file.arrayBuffer()))

  const content = ofx.getContent()
  const type = ofx.getType()
  const transactions =
    type === 'BANK'
      ? ofx.getBankTransferList()
      : ofx.getCreditCardTransferList()
  const currency = safeParseCurrency(
    type === 'BANK'
      ? content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.CURDEF
      : content.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.CURDEF,
    bankAccount.currency,
  )

  // get Base Currency from user settings and conversion rate
  const {
    baseCurrency,
    exchangeRates: baseCurrencyExchangeRates,
    currencyExchangeAttribution,
  } = await getCurrencyExchangeRateForUser(userId)
  const convertCurrency = currencyExchangeGenerator({
    baseCurrency,
    baseCurrencyExchangeRates,
  })
  const convertedCurrencies = new Set<CurrencyCode>()

  const processedTransactions = transactions.map((t) => {
    const isExpense = t.TRNAMT < 0
    if (currency !== baseCurrency) {
      convertedCurrencies.add(currency)
    }
    return convertCurrency({
      id: randomUUID(),
      bankAccount,
      bankAccountId: bankAccount.id,
      fromBankAccount: null,
      fromBankAccountId: null,
      toBankAccount: null,
      toBankAccountId: null,
      group: group ?? null,
      groupId: group?.id ?? null,
      amount: new Decimal(`${t.TRNAMT}`)
        .absoluteValue()
        .toString() as Intl.StringNumericLiteral,
      cashFlow: isExpense ? 'OUT' : 'IN',
      currency,
      date: new Date(t.DTPOSTED),
      description: getDescription(t, isExpense),
      type: isExpense
        ? TransactionTypeEnum.enumValues[1]
        : TransactionTypeEnum.enumValues[0],
      externalId: `${bankAccount.id}-${t.FITID}`,
      category: null,
      categoryId: null,
      notes: null,
      tags: [],
      userId: bankAccount.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  const categorizedTransactions = shouldAutoCategorize
    ? await categorizeTransactions(processedTransactions, categories)
    : {}

  // fill in the categories for the parsed transactions
  const finalTransactions = processedTransactions.map((t) => ({
    ...t,
    category: categorizedTransactions[t.externalId!] ?? null,
    categoryId: categorizedTransactions[t.externalId!]?.id ?? null,
  }))

  return {
    baseCurrency,
    convertedCurrencies: Array.from(convertedCurrencies),
    transactions: finalTransactions satisfies DetailedTransaction[],
    currencyExchangeAttribution,
  }
}

function getDescription(txn: Record<string, string>, isExpense: boolean) {
  // clean any HTML parts
  return unescape(
    txn['NAME'] ?? txn.MEMO ?? `Unknown ${isExpense ? 'expense' : 'income'}`,
  )
}

export { parseTransactions }
