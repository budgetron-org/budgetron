import { Resend } from 'resend'
import { env } from '~/env/server'

/**
 * Email provider.
 * We are using Resend here as it is free and easy to use.
 * This can be replaced with any other email provider.
 * Note: Using a different email provider will require changes in the server/email/service.ts file.
 */
const provider = new Resend(env.RESEND_API_KEY)

export { provider }
