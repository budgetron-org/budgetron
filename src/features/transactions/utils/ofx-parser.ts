import { unescape } from 'lodash'
import { randomUUID } from 'node:crypto'

import type { TransactionWithRelations } from '~/features/transactions/types'
import { Ofx } from 'ofx-data-extractor'
import { safeParseCurrency } from '~/lib/utils'
import { categorizeTransactions } from '~/server/ai/service/categorize-transactions'
import {
  TransactionTypeEnum,
  type BankAccountTable,
  type GroupTable,
} from '~/server/db/schema'
import type { InferResultType } from '~/server/db/types'

type ParseTransactionsOptions = {
  bankAccount: typeof BankAccountTable.$inferSelect
  categories: InferResultType<'CategoryTable', undefined, { parent: true }>[]
  file: File
  group?: typeof GroupTable.$inferSelect
  shouldAutoCategorize: boolean
}
async function parseTransactions({
  bankAccount,
  categories,
  file,
  group,
  shouldAutoCategorize,
}: ParseTransactionsOptions): Promise<TransactionWithRelations[]> {
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
  )

  const processedTransactions = transactions.map((t) => {
    const isExpense = t.TRNAMT < 0
    return {
      bankAccount,
      bankAccountId: bankAccount.id,
      group: group ?? null,
      groupId: group?.id ?? null,
      amount: Math.abs(t.TRNAMT).toString(),
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
      tags: null,
      id: randomUUID(),
      userId: bankAccount.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies TransactionWithRelations
  })

  const categorizedTransactions = shouldAutoCategorize
    ? await categorizeTransactions(processedTransactions, categories)
    : {}

  // fill in the categories for the parsed transactions
  const result = processedTransactions.map((t) => ({
    ...t,
    category: categorizedTransactions[t.externalId] ?? null,
  }))

  return result
}

function getDescription(txn: Record<string, string>, isExpense: boolean) {
  // clean any HTML parts
  return unescape(
    txn['NAME'] ?? txn.MEMO ?? `Unknown ${isExpense ? 'expense' : 'income'}`,
  )
}

export { parseTransactions }
