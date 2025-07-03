import { Button, Heading, Section, Text } from '@react-email/components'
import { capitalize } from 'lodash'

import { APP_NAME } from '~/lib/app-metadata'
import { EmailLayout } from './shared/email-layout'

interface WelcomeEmailProps {
  appUrl: string
  name: string
}

function WelcomeEmail({ appUrl, name }: WelcomeEmailProps) {
  const previewText = `Welcome to ${capitalize(APP_NAME)}!`

  return (
    <EmailLayout previewText={previewText}>
      <Heading>Welcome to {capitalize(APP_NAME)} 👋</Heading>
      <Section>
        <Text>Hi {name},</Text>
        <Text>
          We&apos;re thrilled to have you on board. With{' '}
          <strong>{capitalize(APP_NAME)}</strong>, you can take full control of
          your finances, track your spending, and stay on top of your budget
          with ease.
        </Text>
        <Text>
          To get started, simply sign in and begin setting up your accounts,
          categories, and budgets. If you ever need help, our support docs and
          community are here for you.
        </Text>
        <Button
          className="bg-primary text-primary-foreground cursor-pointer rounded-lg px-4 py-2 text-sm"
          href={appUrl}>
          Get Started
        </Button>
        <Text>
          We&apos;re excited to support your journey toward better financial
          clarity.
        </Text>
        <Text>Welcome aboard!</Text>
        <Text>– The {capitalize(APP_NAME)} Team</Text>
      </Section>
    </EmailLayout>
  )
}

export { WelcomeEmail }

/**
 * Export for preview
 * Run `pnpm email:dev` to preview
 */
WelcomeEmail.PreviewProps = {
  name: 'John Doe',
  appUrl: 'https://example.com',
} satisfies WelcomeEmailProps

export default WelcomeEmail
