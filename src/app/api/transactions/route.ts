import { auth } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

import { transaction } from '@/db/transaction'
import { getCurrencyFormatter } from '@/lib/format'
import { GetTransactionsSchema } from '@/schemas/transaction'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data, error } = GetTransactionsSchema.safeParse({ from, to })

  if (error) {
    return Response.json(error.message, { status: 400 })
  }

  const transactions = await getTransactionsForUser(
    appUserId,
    data.from,
    data.to,
  )
  return Response.json(transactions)
}

export type GetTransactionsResponse = Awaited<
  ReturnType<typeof getTransactionsForUser>
>

async function getTransactionsForUser(id: string, from: Date, to: Date) {
  type TransactionGetPayload = Prisma.TransactionGetPayload<{
    include: { account: true; category: true; household: true }
  }>
  const formatter = getCurrencyFormatter('USD')
  const transactions = (await transaction.findAll({
    where: {
      userId: id,
      date: {
        gte: from,
        lte: to,
      },
    },
    include: {
      account: true,
      category: true,
      household: true,
    },
    orderBy: {
      date: 'desc',
    },
  })) as unknown as TransactionGetPayload[]

  return transactions.map((t) => ({
    ...t,
    amount: t.amount.toString(),
    formattedAmount: formatter.format(
      t.amount.toString() as Intl.StringNumericLiteral,
    ),
  }))
}
