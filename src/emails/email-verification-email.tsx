import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { capitalize } from 'lodash'

import { APP_NAME } from '~/lib/app-metadata'
import { EmailLayout } from './shared/email-layout'

interface EmailVerificationEmailProps {
  name: string
  emailVerificationUrl: string
  emailVerificationUrlExpiresIn: number
}

function EmailVerificationEmail({
  name,
  emailVerificationUrl,
  emailVerificationUrlExpiresIn,
}: EmailVerificationEmailProps) {
  const previewText = 'Email Verification'
  return (
    <EmailLayout previewText={previewText}>
      <Heading>Email Verification</Heading>
      <Section>
        <Text>Hi {name},</Text>
        <Text>
          Thanks for signing up for <strong>{capitalize(APP_NAME)}</strong>! To
          complete your registration, please verify your email address by
          clicking the button below.
        </Text>
        <Button
          className="bg-primary text-primary-foreground rounded-lg p-3"
          href={emailVerificationUrl}>
          Verify Email
        </Button>
        <Text>
          or copy and paste the following link into your browser:{' '}
          <Link className="underline" href={emailVerificationUrl}>
            {emailVerificationUrl}
          </Link>
        </Text>
        <Text>
          This link will expire in{' '}
          <strong>
            {Math.floor(emailVerificationUrlExpiresIn / 60)} minutes
          </strong>
          .
        </Text>
        <Text>
          If you did not create an account, you can safely ignore this email.
        </Text>
        <Text>
          To keep your account safe, please do not forward this email to anyone.
        </Text>
      </Section>
    </EmailLayout>
  )
}

export { EmailVerificationEmail }

/**
 * Export for preview
 * Run `pnpm email:dev` to preview
 */
EmailVerificationEmail.PreviewProps = {
  name: 'John Doe',
  emailVerificationUrl: 'https://example.com/email-verification',
  emailVerificationUrlExpiresIn: 15 * 60,
} satisfies EmailVerificationEmailProps
export default EmailVerificationEmail
