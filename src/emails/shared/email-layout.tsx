import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { capitalize } from 'lodash'
import type { ReactNode } from 'react'

import { APP_NAME } from '~/lib/app-metadata'
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
            <Row>
              <Column className="w-8 pr-2">
                <Img
                  src="https://ik.imagekit.io/raghavan/logo.png" // TODO: Use an environment variable?
                  alt={APP_NAME}
                  className="aspect-square size-8 overflow-hidden rounded-lg"
                />
              </Column>
              <Column>
                <Text className="text-lg font-bold">
                  {capitalize(APP_NAME)}
                </Text>
              </Column>
            </Row>
            {children}
            <Section>
              <Text>
                Best regards,
                <br />
                The {APP_NAME} Team
              </Text>
            </Section>
            <Hr />
            <Section>
              <Text className="text-muted-foreground">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export { EmailLayout }
