import { format } from 'date-fns'
import { desc, sql } from 'drizzle-orm'

import { createRPCErrorFromUnknownError } from '~/rpc/utils'
import { protectedProcedure } from '~/server/api/rpc'
import { db } from '~/server/db'
import { TransactionTable } from '~/server/db/schema'
import { AggregateByMonthInputSchema } from '../validators'

const aggregateByMonth = protectedProcedure
  .input(AggregateByMonthInputSchema)
  .handler(async ({ context, input }) => {
    const from = new Date(input.from.year, input.from.month)
    const to = new Date(input.to.year, input.to.month)

    try {
      const rows = await db
        .select({
          month: sql<string>`TO_CHAR(${TransactionTable.date}, 'YYYY-MM')`.as(
            'month',
          ),
          income:
            sql<number>`SUM(CASE WHEN ${TransactionTable.type} = 'income' THEN ${TransactionTable.amount} ELSE 0 END)`.as(
              'income',
            ),
          expense:
            sql<number>`SUM(CASE WHEN ${TransactionTable.type} = 'expense' THEN ${TransactionTable.amount} ELSE 0 END)`.as(
              'expense',
            ),
        })
        .from(TransactionTable)
        .where(
          sql`
              ${TransactionTable.userId} = ${context.session.user.id}
              AND ${TransactionTable.date} BETWEEN ${format(from, 'yyyy-MM-dd')} AND ${format(to, 'yyyy-MM-dd')}
            `,
        )
        .groupBy(sql`TO_CHAR(${TransactionTable.date}, 'YYYY-MM')`)
        .orderBy(desc(sql`TO_CHAR(${TransactionTable.date}, 'YYYY-MM')`))

      return rows
    } catch (error) {
      throw createRPCErrorFromUnknownError(error)
    }
  })

export { aggregateByMonth }
