import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  getCategoryReport,
  getMonthlySummary as getMonthlySummaryService,
} from '../service'
import { fillMissingMonthsSummary } from '../utils'
import {
  GetCategorySpendIncomeInputSchema,
  GetMonthlySummaryInputSchema,
} from '../validators'

const getCategoryIncome = protectedProcedure
  .input(GetCategorySpendIncomeInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const result = await getCategoryReport({
        ...input,
        userId: user.id,
        type: 'INCOME',
      })
      return result
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

const getCategorySpend = protectedProcedure
  .input(GetCategorySpendIncomeInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const result = await getCategoryReport({
        ...input,
        userId: user.id,
        type: 'EXPENSE',
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

export { getCategoryIncome, getCategorySpend, getMonthlySummary }
