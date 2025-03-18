import { category } from '@/db/category'
import { auth } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const household = request.nextUrl.searchParams.get('household') ?? undefined
  const categories = await getCategoriesForHouseholdOrUser(appUserId, household)

  return Response.json(categories)
}

export type GetCategoriesResponse = Awaited<
  ReturnType<typeof getCategoriesForHouseholdOrUser>
>

async function getCategoriesForHouseholdOrUser(
  userId: string,
  householdId?: string,
) {
  const categories = householdId
    ? await category.getAllForHousehold(householdId)
    : await category.getAllForUser(userId)
  return categories
}
