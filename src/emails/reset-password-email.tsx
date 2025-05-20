import { Button, Heading, Link, Section, Text } from '@react-email/components'

import { APP_NAME } from '~/lib/app-metadata'
import { EmailLayout } from './shared/email-layout'
import { capitalize } from 'lodash'

interface ResetPasswordEmailProps {
  name: string
  resetPasswordUrl: string
  resetPasswordUrlExpiresIn: number
}

function ResetPasswordEmail({
  name,
  resetPasswordUrl,
  resetPasswordUrlExpiresIn,
}: ResetPasswordEmailProps) {
  const previewText = 'Reset Password'
  return (
    <EmailLayout previewText={previewText}>
      <Heading>Reset Password</Heading>
      <Section>
        <Text>Hi {name},</Text>
        <Text>
          We received a request to reset the password for your{' '}
          <strong>{capitalize(APP_NAME)}</strong> account. If this was you,
          please click the button below to reset your password.
        </Text>
        <Button
          className="bg-primary text-primary-foreground rounded-lg p-3"
          href={resetPasswordUrl}>
          Reset Password
        </Button>
        <Text>
          or copy and paste the following link into your browser:{' '}
          <Link className="underline" href={resetPasswordUrl}>
            {resetPasswordUrl}
          </Link>
        </Text>
        <Text>
          This link will expire in{' '}
          <strong>{Math.floor(resetPasswordUrlExpiresIn / 60)} minutes</strong>.
        </Text>
        <Text>
          If you did not request a password reset, you can safely ignore this
          email.
        </Text>
        <Text>
          To keep your account safe, please do not forward this email to anyone.
        </Text>
      </Section>
    </EmailLayout>
  )
}

export { ResetPasswordEmail }

/**
 * Export for preview
 * Run `pnpm email:dev` to preview
 */
ResetPasswordEmail.PreviewProps = {
  name: 'John Doe',
  resetPasswordUrl: 'https://example.com/reset-password',
  resetPasswordUrlExpiresIn: 15 * 60,
} satisfies ResetPasswordEmailProps
export default ResetPasswordEmail
