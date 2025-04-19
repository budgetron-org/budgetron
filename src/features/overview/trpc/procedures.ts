import { TRPCError } from '@trpc/server'
import { APIError } from 'better-auth/api'
import { format } from 'date-fns'
import { sql } from 'drizzle-orm'

import { protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/db'
import { TransactionTable } from '~/server/db/schema'
import { OverviewStatesSchema } from '../validators'

const stats = protectedProcedure
  .input(OverviewStatesSchema)
  .query(async ({ input, ctx }) => {
    try {
      const rows = await db
        .select({
          type: TransactionTable.type,
          total: sql<number>`sum(${TransactionTable.amount})`.as('total'),
        })
        .from(TransactionTable)
        .where(
          sql`
              ${TransactionTable.userId} = ${ctx.session.user.id}
              AND ${TransactionTable.date} >= ${format(input.from, 'yyyy-MM-dd')}
              AND ${TransactionTable.date} <= ${format(input.to, 'yyyy-MM-dd')}
            `,
        )
        .groupBy(TransactionTable.type)

      let expense = 0
      let income = 0

      for (const row of rows) {
        if (row.type === 'expense') expense += Number(row.total)
        if (row.type === 'income') income += Number(row.total)
      }

      return {
        expense: expense.toFixed(2),
        income: income.toFixed(2),
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unknown Error: Please try again',
      })
    }
  })

export { stats }
