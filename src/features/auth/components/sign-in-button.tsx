import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { PATHS } from '~/data/routes'

type SignInButtonProps = ComponentProps<typeof Button>

function SignInButton(props: SignInButtonProps) {
  return (
    <Link href={PATHS.SIGN_IN}>
      <Button {...props} />
    </Link>
  )
}

export { SignInButton }
