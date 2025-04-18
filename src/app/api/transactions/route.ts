import { unauthorized } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'
import { getCurrencyFormatter } from '~/lib/format'

export async function GET(request: NextRequest) {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data, error } = GetTransactionsSchema.safeParse({ from, to })

  if (error) {
    return Response.json(error.message, { status: 400 })
  }

  const transactions = await getTransactionsForUser(user.id, data.from, data.to)
  return Response.json(transactions)
}

export const GetTransactionsSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

export type GetTransactionsResponse = Awaited<
  ReturnType<typeof getTransactionsForUser>
>

async function getTransactionsForUser(userId: string, from: Date, to: Date) {
  const formatter = getCurrencyFormatter('USD')
  return db.query.TransactionTable.findMany({
    where: (t, { and, between, eq }) =>
      and(eq(t.userId, userId), between(t.date, from, to)),
    with: { bankAccount: true, category: true, household: true },
    orderBy: (t, { desc }) => [desc(t.date)],
    extras: (t, { sql }) => ({
      formattedAmount: sql<string>`${t.amount}`
        .mapWith({ mapFromDriverValue: (value) => formatter.format(value) })
        .as('formatted_amount'),
    }),
  })
}
