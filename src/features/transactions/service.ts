import {
  and,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  not,
  or,
  sql,
} from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'

import { db } from '~/server/db'
import {
  BankAccountTable,
  CategoryTable,
  GroupTable,
  TransactionTable,
} from '~/server/db/schema'
import type { TransactionCashFlow, TransactionWithRelations } from './types'
import { parseTransactions } from './utils'

async function insertTransaction(data: typeof TransactionTable.$inferInsert) {
  const [transaction] = await db
    .insert(TransactionTable)
    .values(data)
    .onConflictDoUpdate({
      target: [TransactionTable.externalId],
      set: data,
    })
    .returning()
  if (transaction == null) throw new Error('Error creating new transaction')
  return transaction
}

async function insertManyTransactions(
  data: (typeof TransactionTable.$inferInsert)[],
) {
  const transactions = await db
    .insert(TransactionTable)
    .values(data)
    .onConflictDoUpdate({
      target: [TransactionTable.externalId],
      set: {
        amount: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.amount.name)}`,
        ),
        bankAccountId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.bankAccountId.name)}`,
        ),
        fromBankAccountId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.fromBankAccountId.name)}`,
        ),
        toBankAccountId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.toBankAccountId.name)}`,
        ),
        categoryId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.categoryId.name)}`,
        ),
        currency: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.currency.name)}`,
        ),
        date: sql.raw(`excluded.${toSnakeCase(TransactionTable.date.name)}`),
        description: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.description.name)}`,
        ),
        externalId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.externalId.name)}`,
        ),
        groupId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.groupId.name)}`,
        ),
        type: sql.raw(`excluded.${toSnakeCase(TransactionTable.type.name)}`),
        updatedAt: sql.raw('now()'),
        userId: sql.raw(
          `excluded.${toSnakeCase(TransactionTable.userId.name)}`,
        ),
      },
    })
    .returning()
  if (data.length !== 0 && transactions.length == 0)
    throw new Error('Error creating new transaction')
  return transactions
}

type SelectTransactionFilters = {
  fromDate?: Date
  toDate?: Date
  userId: string
  categoryId?: string
}
async function selectTransactions(
  filters: SelectTransactionFilters,
): Promise<TransactionWithRelations[]> {
  const conditions = [
    eq(TransactionTable.userId, filters.userId),
    filters.fromDate && gte(TransactionTable.date, filters.fromDate),
    filters.toDate && lte(TransactionTable.date, filters.toDate),
    filters.categoryId && eq(TransactionTable.categoryId, filters.categoryId),
  ].filter(Boolean)

  const transactions = (await db.query.TransactionTable.findMany({
    with: {
      bankAccount: true,
      fromBankAccount: true,
      toBankAccount: true,
      category: {
        with: {
          parent: true,
        },
      },
      group: true,
    },
    extras: {
      cashFlow: sql<TransactionCashFlow>`
        CASE
          WHEN ${TransactionTable.type} = 'INCOME' THEN 'IN'
          WHEN ${TransactionTable.type} = 'EXPENSE' AND ${TransactionTable.amount} > 0 THEN 'OUT'
          WHEN ${TransactionTable.type} = 'EXPENSE' AND ${TransactionTable.amount} < 0 THEN 'IN'
          WHEN ${TransactionTable.type} = 'TRANSFER' AND ${TransactionTable.bankAccountId} = ${TransactionTable.toBankAccountId} THEN 'IN'
          WHEN ${TransactionTable.type} = 'TRANSFER' AND ${TransactionTable.bankAccountId} = ${TransactionTable.fromBankAccountId} THEN 'OUT'
          ELSE 'OUT'
        END
      `.as('cash_flow'),
    },
    where: and(...conditions),
    orderBy: [desc(TransactionTable.date)],
  })) satisfies TransactionWithRelations[]
  return transactions
}

type ParseOFXFileParams = {
  file: File
  bankAccountId: string
  groupId?: string
  shouldAutoCategorize: boolean
}
async function parseOFXFile({
  file,
  bankAccountId,
  groupId,
  shouldAutoCategorize,
}: ParseOFXFileParams) {
  // fetch bank account
  const [bankAccount] = await db
    .select()
    .from(BankAccountTable)
    .where(eq(BankAccountTable.id, bankAccountId))
    .limit(1)
  if (!bankAccount)
    throw new Error(
      `Unable to find the bank account with ID={${bankAccountId}}`,
    )

  // fetch group
  const [group] = groupId
    ? await db
        .select()
        .from(GroupTable)
        .where(eq(GroupTable.id, groupId))
        .limit(1)
    : []
  if (groupId && !group)
    throw new Error(`Unable to find the group with ID={${groupId}}`)

  // fetch categories
  const categories = await db.query.CategoryTable.findMany({
    with: {
      parent: true,
    },
    where: and(
      ...[
        or(
          ...[
            and(isNull(CategoryTable.userId), isNull(CategoryTable.groupId)),
            groupId && eq(CategoryTable.groupId, groupId),
            !groupId && eq(CategoryTable.userId, bankAccount.userId),
          ].filter(Boolean),
        ),
        // only want sub-categories
        not(isNull(CategoryTable.parentId)),
      ].filter(Boolean),
    ),
    orderBy: (t) => [t.name],
  })

  return parseTransactions({
    bankAccount,
    categories,
    file,
    group,
    shouldAutoCategorize,
  })
}

async function deleteTransaction(
  data: Pick<typeof TransactionTable.$inferSelect, 'id' | 'userId'>,
) {
  const [deleted] = await db
    .delete(TransactionTable)
    .where(
      and(
        eq(TransactionTable.id, data.id),
        eq(TransactionTable.userId, data.userId),
      ),
    )
    .returning()
  if (deleted == null) throw new Error('Error deleting transaction')
  return deleted
}

type DeleteManyTransactionsParams = {
  ids: (typeof TransactionTable.$inferSelect)['id'][]
  userId: (typeof TransactionTable.$inferSelect)['userId']
}
async function deleteManyTransactions({
  ids,
  userId,
}: DeleteManyTransactionsParams) {
  const deleted = await db
    .delete(TransactionTable)
    .where(
      and(
        inArray(TransactionTable.id, ids),
        eq(TransactionTable.userId, userId),
      ),
    )
    .returning()
  if (deleted.length === 0 && ids.length > 0)
    throw new Error('Error deleting transactions')
  if (deleted.length !== ids.length)
    throw new Error('Error deleting some transactions')
  return deleted
}

async function updateTransaction(
  data: Partial<Omit<typeof TransactionTable.$inferInsert, 'id' | 'userId'>> &
    Pick<typeof TransactionTable.$inferSelect, 'id' | 'userId'>,
) {
  const [transaction] = await db
    .update(TransactionTable)
    .set(data)
    .where(
      and(
        eq(TransactionTable.id, data.id),
        eq(TransactionTable.userId, data.userId),
      ),
    )
    .returning()
  if (transaction == null) throw new Error('Error creating new transaction')
  return transaction
}

export {
  deleteManyTransactions,
  deleteTransaction,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
  updateTransaction,
}
