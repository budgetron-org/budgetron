import { and, desc, eq, gte, isNull, lte, not, or, sql } from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'

import { db } from '~/server/db'
import {
  BankAccountTable,
  CategoryTable,
  GroupTable,
  TransactionTable,
} from '~/server/db/schema'
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
async function selectTransactions(filters: SelectTransactionFilters) {
  const conditions = [
    eq(TransactionTable.userId, filters.userId),
    filters.fromDate && gte(TransactionTable.date, filters.fromDate),
    filters.toDate && lte(TransactionTable.date, filters.toDate),
    filters.categoryId && eq(TransactionTable.categoryId, filters.categoryId),
  ].filter(Boolean)

  return db.query.TransactionTable.findMany({
    with: {
      bankAccount: true,
      category: true,
      group: true,
    },
    where: and(...conditions),
    orderBy: [desc(TransactionTable.date)],
  })
}

async function parseOFXFile(
  file: File,
  bankAccountId: string,
  groupId?: string,
) {
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

  return parseTransactions(file, bankAccount, categories, group)
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

async function updateTransaction(
  data: Partial<Omit<typeof TransactionTable.$inferInsert, 'id' | 'userId'>> &
    Pick<typeof TransactionTable.$inferSelect, 'id' | 'userId'>,
) {
  const [transaction] = await db
    .update(TransactionTable)
    .set({
      amount: data.amount,
      bankAccountId: data.bankAccountId,
      categoryId: data.categoryId,
      currency: data.currency,
      date: data.date,
      description: data.description,
      notes: data.notes,
      tags: data.tags,
      type: data.type,
    })
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
  deleteTransaction,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
  updateTransaction,
}
