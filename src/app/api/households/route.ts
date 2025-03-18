import { auth } from '@clerk/nextjs/server'
import type { Household } from '@prisma/client'

import { household } from '@/db/household'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const households = await getHouseholdsForUser(appUserId)
  return Response.json(households)
}

export type GetHouseholdsResponse = Awaited<
  ReturnType<typeof getHouseholdsForUser>
>

async function getHouseholdsForUser(id: string) {
  const households = await household.getAllForUser(id)
  const categorized = households.reduce(
    (acc, value) => {
      if (value.ownerId === id) {
        acc.owned.push(value)
      } else {
        acc.member.push(value)
      }
      return acc
    },
    {
      owned: [] as Household[],
      member: [] as Household[],
    },
  )

  return [
    {
      label: 'Owned',
      households: categorized.owned,
    },
    {
      label: 'Member',
      households: categorized.member,
    },
  ]
}
