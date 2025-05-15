import { ORPCError } from '@orpc/server'

import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  deleteTransaction,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
  updateTransaction,
} from '../service'
import {
  AddTransactionInputSchema,
  CreateManyTransactionsInputSchema,
  CreateTransactionSchema,
  DeleteTransactionInputSchema,
  GetByCategoryInputSchema,
  GetByDateRangeInputSchema,
  ParseOFXInputSchema,
  UpdateTransactionInputSchema,
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

const _delete = protectedProcedure
  .input(DeleteTransactionInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await deleteTransaction({
        id: input.id,
        userId: session.user.id,
      })
      return bankAccount
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

const getByCategory = protectedProcedure
  .input(GetByCategoryInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const transactions = await selectTransactions({
        userId: user.id,
        fromDate: input.from,
        toDate: input.to,
        categoryId: input.categoryId,
      })
      return transactions
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const parseOFX = protectedProcedure
  .input(ParseOFXInputSchema)
  .handler(async ({ input }) => {
    try {
      const transactions = await parseOFXFile(input)
      return transactions
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const update = protectedProcedure
  .input(UpdateTransactionInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await updateTransaction({
        ...input,
        userId: session.user.id,
      })
      return bankAccount
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export {
  _delete,
  create,
  createMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
}
