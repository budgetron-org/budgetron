import { auth } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

import { transaction } from '@/db/transaction'
import { GetOverviewStatsSchema } from '@/schemas/stats'

export async function GET(request: NextRequest) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  const {
    success,
    data: range,
    error,
  } = GetOverviewStatsSchema.safeParse({ from, to })

  if (!success) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const result = await getStatsOverviewFromRange(
    appUserId,
    range.from,
    range.to,
  )

  return NextResponse.json(result)
}

export type GetOverviewStatsResponse = Awaited<
  ReturnType<typeof getStatsOverviewFromRange>
>

async function getStatsOverviewFromRange(userId: string, from: Date, to: Date) {
  const totals = await transaction.getTotalsByTypeForUser(userId, from, to)
  return {
    expense:
      totals.find((t) => t.type === 'expense')?._sum.amount?.toNumber() ?? 0,
    income:
      totals.find((t) => t.type === 'income')?._sum.amount?.toNumber() ?? 0,
  }
}
