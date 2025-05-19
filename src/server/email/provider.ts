import { Resend } from 'resend'
import { env } from '~/env/server'

/**
 * Email provider.
 * We are using Resend here as it is free and easy to use.
 * This can be replaced with any other email provider.
 * Note: Using a different email provider will require changes in the server/email/service.ts file.
 */
let _provider: Resend | null = null

/**
 * We use a singleton pattern here to avoid creating multiple instances of the email provider.
 * Also, we initialize the provider only when it is needed to avoid unnecessary initialization.
 * Initialization during build time will fail as the environment variables might not be available.
 * @returns The email provider.
 */
function getProvider() {
  if (!_provider) {
    _provider = new Resend(env.EMAIL_PROVIDER_API_KEY)
  }
  return _provider
}

export { getProvider }
