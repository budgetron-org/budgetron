import { and, eq, gte, lte, sql } from 'drizzle-orm'
import { toSnakeCase } from 'drizzle-orm/casing'

import { parseTransactions } from '~/lib/ofx-parser'
import { db } from '~/server/db'
import {
  BankAccountTable,
  CategoryTable,
  GroupTable,
  TransactionTable,
} from '~/server/db/schema'
import type { CategorySpend, MonthlySummary } from './types'

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
}
async function selectTransactions(filters: SelectTransactionFilters) {
  const conditions = [
    eq(TransactionTable.userId, filters.userId),
    filters.fromDate && gte(TransactionTable.date, filters.fromDate),
    filters.toDate && lte(TransactionTable.date, filters.toDate),
  ].filter(Boolean)

  return db.query.TransactionTable.findMany({
    with: {
      bankAccount: true,
      category: true,
      group: true,
    },
    where: and(...conditions),
    orderBy: [TransactionTable.date],
  })
}

type GetMonthlySummaryFilters = {
  userId: string
  from: Date
  to: Date
}
async function getMonthlySummary({
  from,
  to,
  userId,
}: GetMonthlySummaryFilters) {
  const result = await db.execute<MonthlySummary>(
    sql<MonthlySummary>`
      SELECT
        EXTRACT(MONTH FROM ${TransactionTable.date})::int AS month,
        EXTRACT(YEAR FROM ${TransactionTable.date})::int AS year,
        SUM(CASE WHEN ${TransactionTable.type} = 'income' THEN ${TransactionTable.amount} ELSE 0 END) AS income,
        SUM(CASE WHEN ${TransactionTable.type} = 'expense' THEN ${TransactionTable.amount} ELSE 0 END) AS expense
      FROM ${TransactionTable}
      WHERE ${TransactionTable.userId} = ${userId}
        AND ${TransactionTable.date} BETWEEN ${from} AND ${to}
      GROUP BY year, month
      ORDER BY year, month
    `,
  )

  return result.rows
}

type GetCategorySpendFilters = {
  userId: string
  from: Date
  to: Date
  limit: number
}
async function getCategorySpend({
  from,
  to,
  userId,
  limit,
}: GetCategorySpendFilters) {
  const result = await db.execute<CategorySpend>(
    sql<CategorySpend>`
      SELECT
        c.id AS "categoryId",
        c.name AS "categoryName",
        c.icon AS "categoryIcon",
        p.id AS "parentCategoryId",
        p.name AS "parentCategoryName",
        p.icon AS "parentCategoryIcon",
        SUM(t.amount) AS "total"
      FROM ${TransactionTable} t
      JOIN ${CategoryTable} c ON t.category_id = c.id
      LEFT JOIN ${CategoryTable} p ON c.parent_id = p.id
      WHERE t.user_id = ${userId}
        AND t.type = 'expense'
        AND t.date BETWEEN ${from} AND ${to}
      GROUP BY c.id, c.name, c.icon, p.id, p.name, p.icon
      ORDER BY total DESC
      LIMIT ${limit}
    `,
  )

  return result.rows
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

  return parseTransactions(file, bankAccount, group)
}

export {
  getCategorySpend,
  getMonthlySummary,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
}
