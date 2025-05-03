import { ORPCError } from '@orpc/server'

import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  getCategorySpend as getCategorySpendService,
  getMonthlySummary as getMonthlySummaryService,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
} from '../service'
import { fillMissingMonthsSummary } from '../utils'
import {
  AddTransactionInputSchema,
  CreateManyTransactionsInputSchema,
  CreateTransactionSchema,
  GetByDateRangeInputSchema,
  GetCategorySpendInputSchema,
  GetMonthlySummaryInputSchema,
  ParseOFXInputSchema,
} from '../validators'

const create = protectedProcedure
  .input(AddTransactionInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const transaction = await insertTransaction({
        bankAccountId: input.bankAccountId,
        amount: input.amount,
        categoryId: input.categoryId,
        currency: 'USD',
        date: input.date,
        description: input.description,
        externalId: input.externalId,
        groupId: input.groupId,
        type: input.type,
        userId: session.user.id,
      })
      return transaction
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const createMany = protectedProcedure
  .input(CreateManyTransactionsInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session
    const { error, data } = CreateTransactionSchema.extend({
      userId: CreateTransactionSchema.shape.userId.default(user.id),
    })
      .array()
      .min(1)
      .safeParse(input)
    if (error) throw new ORPCError('BAD_REQUEST', { message: error.message })

    try {
      const transactions = await insertManyTransactions(data)
      return transactions
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getByDateRange = protectedProcedure
  .input(GetByDateRangeInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const transactions = await selectTransactions({
        userId: user.id,
        fromDate: input.from,
        toDate: input.to,
      })
      return transactions
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getCategorySpend = protectedProcedure
  .input(GetCategorySpendInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const result = await getCategorySpendService({
        ...input,
        userId: user.id,
      })
      return result
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getMonthlySummary = protectedProcedure
  .input(GetMonthlySummaryInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const summary = await getMonthlySummaryService({
        ...input,
        userId: user.id,
      })
      const filledSummary = fillMissingMonthsSummary(
        summary,
        input.from,
        input.to,
      )
      return filledSummary
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const parseOFX = protectedProcedure
  .input(ParseOFXInputSchema)
  .handler(async ({ input }) => {
    try {
      const transactions = await parseOFXFile(
        input.file,
        input.bankAccountId,
        input.groupId,
      )
      return transactions
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export {
  create,
  createMany,
  getByDateRange,
  getCategorySpend,
  getMonthlySummary,
  parseOFX,
}
