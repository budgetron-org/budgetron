import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { capitalize } from 'lodash'

import { APP_NAME } from '~/lib/app-metadata'
import { EmailLayout } from './shared/email-layout'

interface DeleteAccountEmailProps {
  name: string
  deleteAccountUrl: string
  deleteAccountUrlExpiresIn: number
}

function DeleteAccountEmail({
  name,
  deleteAccountUrl,
  deleteAccountUrlExpiresIn,
}: DeleteAccountEmailProps) {
  const previewText = 'Delete Account'
  return (
    <EmailLayout previewText={previewText}>
      <Heading>Delete Account</Heading>
      <Section>
        <Text>Hi {name},</Text>
        <Text>
          We received a request to delete your{' '}
          <strong>{capitalize(APP_NAME)}</strong> account. If this was you,
          please click the button below to delete your account.
        </Text>
        <Button
          className="bg-primary text-primary-foreground rounded-lg p-3"
          href={deleteAccountUrl}>
          Delete Account
        </Button>
        <Text>
          or copy and paste the following link into your browser:{' '}
          <Link className="underline" href={deleteAccountUrl}>
            {deleteAccountUrl}
          </Link>
        </Text>
        <Text>
          This link will expire in{' '}
          <strong>{Math.floor(deleteAccountUrlExpiresIn / 60)} minutes</strong>.
        </Text>
        <Text>
          <strong>Important:</strong> Please note that this action is
          irreversible and cannot be undone. You will not be able to recover
          your account and all your data will be permanently deleted.
        </Text>
        <Text>
          If you did not request an account deletion, you can safely ignore this
          email.
        </Text>
        <Text>
          To keep your account safe, please do not forward this email to anyone.
        </Text>
      </Section>
    </EmailLayout>
  )
}

export { DeleteAccountEmail }

/**
 * Export for preview
 * Run `pnpm email:dev` to preview
 */
DeleteAccountEmail.PreviewProps = {
  name: 'John Doe',
  deleteAccountUrl: 'https://example.com/delete-account',
  deleteAccountUrlExpiresIn: 15 * 60,
} satisfies DeleteAccountEmailProps
export default DeleteAccountEmail
