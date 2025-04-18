import { unauthorized } from 'next/navigation'

import { db } from '~/db'
import { UserSettingsTable } from '~/db/schema'
import { getCurrentUser } from '~/features/auth/service'

export async function GET() {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const result = await getSettingsForUser(user.id)
  return Response.json(result)
}

export type GetUserSettingsResponse = Awaited<
  ReturnType<typeof getSettingsForUser>
>

async function getSettingsForUser(userId: string) {
  const found = db.query.UserSettingsTable.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  })
  if (found) return found

  // not found, so insert a new one and return
  const [inserted] = await db
    .insert(UserSettingsTable)
    .values({ userId, currency: 'USD' })
    .onConflictDoNothing()
    .returning()
  if (!inserted) throw Error('Unable to create new user settings')
  return inserted
}
