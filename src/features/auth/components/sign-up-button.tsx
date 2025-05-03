import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'

type Props = ComponentProps<typeof Button> & {}

function SignUpButton(props: Props) {
  return (
    <Link href="sign-up">
      <Button {...props} />
    </Link>
  )
}

export { SignUpButton }
