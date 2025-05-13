import { unescape } from 'lodash'
import { randomUUID } from 'node:crypto'

import type { TransactionWithRelations } from '~/features/transactions/types'
import { Ofx, Types, type StatementTransaction } from '~/lib/ofx-data-extractor'
import { safeParseCurrency } from '~/lib/utils'
import { categorizeTransactions } from '~/server/ai/service/categorize-transactions'
import {
  TransactionTypeEnum,
  type BankAccountTable,
  type GroupTable,
} from '~/server/db/schema'
import type { InferResultType } from '~/server/db/types'

async function parseTransactions(
  file: File,
  bankAccount: typeof BankAccountTable.$inferSelect,
  categories: InferResultType<'CategoryTable', undefined, { parent: true }>[],
  group: typeof GroupTable.$inferSelect | null = null,
): Promise<TransactionWithRelations[]> {
  const ofx = Ofx.fromBuffer(Buffer.from(await file.arrayBuffer()))

  const content = ofx.getContent()
  const type = ofx.getType()
  const transactions =
    type === Types.BANK
      ? ofx.getBankTransferList()
      : ofx.getCreditCardTransferList()
  const currency = safeParseCurrency(
    type === Types.BANK
      ? content.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.CURDEF
      : content.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.CURDEF,
  )

  const processedTransactions = transactions.map((t) => {
    const isExpense = t.TRNAMT < 0
    return {
      bankAccount,
      bankAccountId: bankAccount.id,
      group,
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

  const categorizedTransactions = await categorizeTransactions(
    processedTransactions,
    categories,
  )

  // fill in the categories for the parsed transactions
  const result = processedTransactions.map((t) => ({
    ...t,
    category: categorizedTransactions[t.externalId] ?? null,
  }))

  return result
}

function getDescription(txn: StatementTransaction, isExpense: boolean) {
  // clean any HTML parts
  return unescape(
    txn['NAME'] ?? txn.MEMO ?? `Unknown ${isExpense ? 'expense' : 'income'}`,
  )
}

export { parseTransactions }
