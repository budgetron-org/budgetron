import type { ReactNode } from 'react'

import { env } from '~/env/server'
import { getProvider } from './provider'
import { isEmailServiceEnabled } from './utils'

type SendEmailOptions = {
  to: string | string[]
  subject: string
  body: ReactNode
}

/**
 * Sends an email.
 * @param options The options for sending the email.
 * @returns The response from the email provider.
 */
async function sendEmail({ to, subject, body }: SendEmailOptions) {
  if (!isEmailServiceEnabled(env)) {
    throw new Error(
      'Cannot send email as email service is not enabled. Please contact support.',
    )
  }

  const { data, error } = await getProvider().emails.send({
    from: env.EMAIL_PROVIDER_FROM_EMAIL,
    to,
    subject,
    react: body,
  })

  if (error) throw new Error(error.message)
  return data
}

export { sendEmail }
