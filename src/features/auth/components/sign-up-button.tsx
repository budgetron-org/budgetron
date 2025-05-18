import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { PATHS } from '~/data/routes'

type SignUpButtonProps = ComponentProps<typeof Button>

function SignUpButton(props: SignUpButtonProps) {
  return (
    <Link href={PATHS.SIGN_UP}>
      <Button {...props} />
    </Link>
  )
}

export { SignUpButton }
