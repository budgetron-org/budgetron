import { userSettings } from '@/db/user-settings'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (!userId) {
    return redirectToSignIn()
  }

  const result = await getSettingsForUser(
    sessionClaims.metadata.appUserId,
    userId,
  )

  return Response.json(result)
}

export type GetUserSettingsResponse = Awaited<
  ReturnType<typeof getSettingsForUser>
>

async function getSettingsForUser(id: string | undefined, clerkId: string) {
  // If this is the first time the user is created, the app id will not
  // yet be available in the sessionClaims. So, use the clerkId instead.
  const userConnect = id !== undefined ? { id } : { clerkId }

  const result = await userSettings.findOrCreate({
    where: { userId: id },
    data: {
      user: { connect: userConnect },
      currency: 'USD',
    },
    select: { currency: true },
  })

  return result
}
