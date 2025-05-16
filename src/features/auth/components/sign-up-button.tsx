import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'

type SignUpButtonProps = ComponentProps<typeof Button>

function SignUpButton(props: SignUpButtonProps) {
  return (
    <Link href="sign-up">
      <Button {...props} />
    </Link>
  )
}

export { SignUpButton }
