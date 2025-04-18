import { unauthorized } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'

export async function GET(request: NextRequest) {
  const { user } = await getCurrentUser()

  if (!user) unauthorized()

  const household = request.nextUrl.searchParams.get('household') ?? undefined
  const categories = await getCategoriesForHouseholdOrUser(user.id, household)

  return Response.json(categories)
}

export type GetCategoriesResponse = Awaited<
  ReturnType<typeof getCategoriesForHouseholdOrUser>
>

async function getCategoriesForHouseholdOrUser(
  userId: string,
  householdId?: string,
) {
  return db.query.CategoryTable.findMany({
    where: (t, { and, eq, isNull, or }) =>
      householdId
        ? or(
            eq(t.householdId, householdId),
            and(isNull(t.householdId), isNull(t.userId)),
          )
        : or(eq(t.userId, userId), and(isNull(t.userId))),
  })
}
