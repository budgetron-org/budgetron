import {
  Body,
  Container,
  Head,
  Html,
  Hr,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'
import type { ReactNode } from 'react'

import { BrandLogo } from '~/components/ui/brand-logo'
import { config } from './tailwind'

interface EmailLayoutProps {
  children: ReactNode
  previewText: string
}

function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind config={config}>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <BrandLogo />
            </Section>
            {children}
            <Section>
              <Text>
                Best regards,
                <br />
                The Budgetify Team
              </Text>
            </Section>
            <Hr />
            <Section>
              <Text className="text-muted-foreground">
                © {new Date().getFullYear()} Budgetify. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export { EmailLayout }
