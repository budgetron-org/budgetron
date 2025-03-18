import { Button } from '@/components/ui/button'
import { SignUpButton as ClerkSignUpButton } from '@clerk/nextjs'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Button> & {}

export function SignUpButton(props: Props) {
  return (
    <ClerkSignUpButton>
      <Button {...props} />
    </ClerkSignUpButton>
  )
}
