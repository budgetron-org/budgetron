import { getMonth, getYear } from 'date-fns'
import { unauthorized } from 'next/navigation'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'

export async function GET() {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const earliestMonth = await getAvailableDataRange(user.id)
  return Response.json(earliestMonth)
}

export type GetAvailableDataRangeResponse = Awaited<
  ReturnType<typeof getAvailableDataRange>
>

async function getAvailableDataRange(userId: string) {
  const earliestRecord = await db.query.TransactionTable.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    orderBy: (t, { asc }) => [asc(t.date)],
  })

  return {
    month: getMonth(earliestRecord?.date ?? Date.now()),
    year: getYear(earliestRecord?.date ?? Date.now()),
  }
}
