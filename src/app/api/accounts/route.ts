import { unauthorized } from 'next/navigation'

import { getCurrentUser } from '~/features/auth/service'
import { db } from '~/db'

export async function GET() {
  const { user } = await getCurrentUser()
  if (!user) unauthorized()

  const accounts = await getAccountsForUser(user.id)
  return Response.json(accounts)
}

export type GetAccountsResponse = Awaited<ReturnType<typeof getAccountsForUser>>

async function getAccountsForUser(userId: string) {
  return db.query.BankAccountTable.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
  })
}
