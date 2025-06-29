import { env } from '~/env/server'

type Env = typeof env

/**
 * Checks if the email service is enabled by checking if all the required environment variables are set.
 * @returns True if the email service is enabled, false otherwise.
 */
function isEmailServiceEnabled(env: Env): env is Env & {
  EMAIL_PROVIDER_API_KEY: string
  EMAIL_PROVIDER_FROM_EMAIL: string
} {
  return (
    env.EMAIL_PROVIDER_API_KEY != null && env.EMAIL_PROVIDER_FROM_EMAIL != null
  )
}

export { isEmailServiceEnabled }
