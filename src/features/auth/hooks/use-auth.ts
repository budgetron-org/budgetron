import { authClient } from '../client'

export function useAuth() {
  const session = authClient.useSession()
  return {
    authClient,
    session,
  }
}
