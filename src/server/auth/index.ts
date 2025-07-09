import { betterAuth } from 'better-auth'
import { authConfig } from './config'
import type { AwaitedReturnType } from '~/types/shared'

let _auth: ReturnType<typeof betterAuth<typeof authConfig>> | null = null

/**
 * We use a singleton pattern here to avoid creating multiple instances of the auth instance.
 * Also, we initialize the auth instance only when it is needed to avoid unnecessary initialization.
 * Initialization during build time will fail as the environment variables might not be available.
 * @returns The auth instance.
 */
function getAuth() {
  if (!_auth) {
    _auth = betterAuth(authConfig)
  }
  return _auth
}

// Types
type Auth = ReturnType<typeof getAuth>
type Session = Auth['$Infer']['Session']
type User = Session['user']
type UserAccount = AwaitedReturnType<Auth['api']['listUserAccounts']>[number]

export { getAuth }
export type { User, UserAccount }
