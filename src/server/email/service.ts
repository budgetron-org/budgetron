import type { ReactNode } from 'react'

import { env } from '~/env/server'
import { provider } from './provider'

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
  const { data, error } = await provider.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    react: body,
  })

  if (error) throw new Error(error.message)
  return data
}

export { sendEmail }
