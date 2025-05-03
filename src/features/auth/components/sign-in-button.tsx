import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'

type Props = ComponentProps<typeof Button> & {}

function SignInButton(props: Props) {
  return (
    <Link href="/sign-in">
      <Button {...props} />
    </Link>
  )
}

export { SignInButton }
