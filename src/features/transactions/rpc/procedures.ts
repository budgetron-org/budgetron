import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  deleteManyTransactions,
  deleteTransaction,
  insertManyTransactions,
  insertTransaction,
  parseOFXFile,
  selectTransactions,
  updateTransaction,
} from '../service'
import {
  CreateManyTransactionsInputSchema,
  CreateTransactionInputSchema,
  DeleteManyTransactionsInputSchema,
  DeleteTransactionInputSchema,
  GetByCategoryInputSchema,
  GetByDateRangeInputSchema,
  ParseOFXInputSchema,
  UpdateTransactionInputSchema,
} from '../validators'

const create = protectedProcedure
  .input(CreateTransactionInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const transaction = await insertTransaction({
        amount: input.amount as Intl.StringNumericLiteral,
        bankAccountId: input.bankAccountId,
        categoryId: input.categoryId,
        currency: input.currency,
        date: input.date,
        description: input.description,
        externalId: input.externalId,
        fromBankAccountId: input.fromBankAccountId,
        groupId: input.groupId,
        notes: input.notes,
        tags: input.tags,
        toBankAccountId: input.toBankAccountId,
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

    try {
      const transactions = await insertManyTransactions(
        input.map((t) => ({
          amount: t.amount as Intl.StringNumericLiteral,
          bankAccountId: t.bankAccountId,
          categoryId: t.categoryId,
          currency: t.currency,
          date: t.date,
          description: t.description,
          externalId: t.externalId,
          fromBankAccountId: t.fromBankAccountId,
          groupId: t.groupId,
          notes: t.notes,
          tags: t.tags,
          toBankAccountId: t.toBankAccountId,
          type: t.type,
          userId: user.id,
        })),
      )
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

const deleteMany = protectedProcedure
  .input(DeleteManyTransactionsInputSchema)
  .handler(async ({ context, input }) => {
    const session = context.session

    try {
      const bankAccount = await deleteManyTransactions({
        ids: input.map((t) => t.id),
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
      const result = await selectTransactions({
        userId: user.id,
        fromDate: input.from,
        toDate: input.to,
      })
      return result
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getByCategory = protectedProcedure
  .input(GetByCategoryInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const result = await selectTransactions({
        userId: user.id,
        fromDate: input.from,
        toDate: input.to,
        categoryId: input.categoryId,
      })
      return result
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const parseOFX = protectedProcedure
  .input(ParseOFXInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session
    try {
      const promises = input.files.map((file) =>
        parseOFXFile({
          bankAccountId: input.bankAccountId,
          file,
          shouldAutoCategorize: input.shouldAutoCategorize,
          groupId: input.groupId,
          userId: user.id,
        }),
      )
      const result = await Promise.all(promises)
      return {
        baseCurrency: result[0]!.baseCurrency,
        convertedCurrencies: Array.from(
          new Set(result.map((r) => r.convertedCurrencies).flat()),
        ),
        transactions: result
          .map((r) => r.transactions)
          .flat()
          .sort((a, b) => b.date.getTime() - a.date.getTime()),
        currencyExchangeAttribution: result[0]!.currencyExchangeAttribution,
      }
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const update = protectedProcedure
  .input(UpdateTransactionInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const bankAccount = await updateTransaction({
        amount: input.amount as Intl.StringNumericLiteral,
        bankAccountId: input.bankAccountId,
        categoryId: input.categoryId,
        currency: input.currency,
        date: input.date,
        description: input.description,
        externalId: input.externalId,
        fromBankAccountId: input.fromBankAccountId,
        groupId: input.groupId,
        id: input.id,
        notes: input.notes,
        tags: input.tags,
        toBankAccountId: input.toBankAccountId,
        type: input.type,
        userId: user.id,
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
  deleteMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
}
