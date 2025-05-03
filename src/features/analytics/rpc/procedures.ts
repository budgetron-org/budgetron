import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import {
  getCategorySpend as getCategorySpendService,
  getMonthlySummary as getMonthlySummaryService,
} from '../service'
import { fillMissingMonthsSummary } from '../utils'
import {
  GetCategorySpendInputSchema,
  GetMonthlySummaryInputSchema,
} from '../validators'

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

export { getCategorySpend, getMonthlySummary }
