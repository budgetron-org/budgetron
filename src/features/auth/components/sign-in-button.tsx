import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'

type SignInButtonProps = ComponentProps<typeof Button>

function SignInButton(props: SignInButtonProps) {
  return (
    <Link href="/sign-in">
      <Button {...props} />
    </Link>
  )
}

export { SignInButton }
