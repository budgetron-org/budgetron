'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

import { household } from '@/db/household'
import { CreateHouseholdSchema } from '@/schemas/household'

export async function createHousehold(
  UNSAFE_data: z.infer<typeof CreateHouseholdSchema>,
) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    redirectToSignIn()
    return
  }

  const { error, data } = CreateHouseholdSchema.safeParse({
    ...UNSAFE_data,
    ownerId: appUserId,
  })

  if (error) {
    throw error
  }

  const householdEntry = await household.create({
    data: {
      icon: data.icon,
      name: data.name,
      currency: data.currency,
      owner: { connect: { id: appUserId } },
    },
  })

  return householdEntry
}
