import { Button } from '@/components/ui/button'
import { SignInButton as ClerkSignInButton } from '@clerk/nextjs'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Button> & {}

export function SignInButton(props: Props) {
  return (
    <ClerkSignInButton>
      <Button {...props} />
    </ClerkSignInButton>
  )
}
