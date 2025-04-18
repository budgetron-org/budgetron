import { sql } from 'drizzle-orm'

import { db } from '~/db'
import { TransactionTable } from '~/db/schema'
import { revalidateTransactionCache } from './cache'

export async function insertTransaction(
  data: typeof TransactionTable.$inferInsert,
) {
  const [transaction] = await db
    .insert(TransactionTable)
    .values(data)
    .onConflictDoUpdate({
      target: [TransactionTable.externalId],
      set: data,
    })
    .returning()
  if (transaction == null) throw new Error('Error creating new transaction')
  revalidateTransactionCache(transaction.userId)
  return transaction
}

export async function insertManyTransactions(
  data: (typeof TransactionTable.$inferInsert)[],
) {
  const transactions = await db
    .insert(TransactionTable)
    .values(data)
    .onConflictDoUpdate({
      target: [TransactionTable.externalId],
      set: {
        bankAccountId: sql.raw(
          `excluded.${TransactionTable.bankAccountId.name}`,
        ),
        amount: sql.raw(`excluded.${TransactionTable.amount.name}`),
        categoryId: sql.raw(`excluded.${TransactionTable.categoryId.name}`),
        currency: sql.raw(`excluded.${TransactionTable.currency.name}`),
        date: sql.raw(`excluded.${TransactionTable.date.name}`),
        description: sql.raw(`excluded.${TransactionTable.description.name}`),
        externalId: sql.raw(`excluded.${TransactionTable.externalId.name}`),
        householdId: sql.raw(`excluded.${TransactionTable.householdId.name}`),
        type: sql.raw(`excluded.${TransactionTable.type.name}`),
        updatedAt: sql.raw('now()'),
        userId: sql.raw(`excluded.${TransactionTable.userId.name}`),
      },
    })
    .returning()
  if (data.length !== 0 && transactions.length == 0)
    throw new Error('Error creating new transaction')
  revalidateTransactionCache()
  return transactions
}
