import { account } from '@/db/account'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const { appUserId } = sessionClaims?.metadata ?? {}

  if (!userId || !appUserId) {
    return redirectToSignIn()
  }

  const accounts = await getAccountsForUser(appUserId)
  return Response.json(accounts)
}

export type GetAccountsResponse = Awaited<ReturnType<typeof getAccountsForUser>>

async function getAccountsForUser(id: string) {
  const accounts = await account.getAllForUser(id)
  return accounts
}
