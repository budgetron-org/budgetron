import { SignedIn as ClerkSignedIn } from '@clerk/nextjs'
import type { ComponentProps } from 'react'

type ClerkSignedInProps = ComponentProps<typeof ClerkSignedIn>

type Props = Pick<ClerkSignedInProps, 'children'> & {}

export function SignedIn(props: Props) {
  return <ClerkSignedIn {...props} />
}
