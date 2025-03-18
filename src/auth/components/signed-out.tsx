import { SignedOut as ClerkSignedOut } from '@clerk/nextjs'
import type { ComponentProps } from 'react'

type ClerkSignedOutProps = ComponentProps<typeof ClerkSignedOut>

type Props = Pick<ClerkSignedOutProps, 'children'> & {}

export function SignedOut(props: Props) {
  return <ClerkSignedOut {...props} />
}
