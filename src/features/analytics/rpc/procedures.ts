import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  getCashFlowReport as getCashFlowReportService,
  getCategoryReport,
  getOverviewSummary,
} from '../service'
import {
  GetCashFlowReportInputSchema,
  GetCategorySpendIncomeInputSchema,
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

const getDashboardSummary = protectedProcedure.handler(async ({ context }) => {
  const { user } = context.session

  try {
    const cashFlowSummary = await getCashFlowReportService({
      range: 'last_6_months',
      userId: user.id,
    })
    const overviewSummary = await getOverviewSummary({
      userId: user.id,
    })
    return {
      cashFlowSummary,
      overviewSummary,
    }
  } catch (error) {
    throw createRPCErrorFromUnknownError(error)
  }
})

const getCashFlowReport = protectedProcedure
  .input(GetCashFlowReportInputSchema)
  .handler(async ({ context, input }) => {
    const { user } = context.session

    try {
      const result = await getCashFlowReportService({
        ...input,
        userId: user.id,
      })
      return result
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export {
  getCashFlowReport,
  getCategoryIncome,
  getCategorySpend,
  getDashboardSummary,
}
