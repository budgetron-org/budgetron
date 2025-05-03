import { authClient } from '../client'

function useAuth() {
  const session = authClient.useSession()
  return { session }
}

export { useAuth }
