import { createAuthClient } from 'better-auth/react'
import { env } from '~/env/client'

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  basePath: env.NEXT_PUBLIC_BASE_PATH,
})

export { authClient }
