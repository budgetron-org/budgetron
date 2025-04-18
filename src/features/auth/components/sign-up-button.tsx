import Link from 'next/link'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'

type Props = ComponentProps<typeof Button> & {}

export function SignUpButton(props: Props) {
  return (
    <Link href="sign-up">
      <Button {...props} />
    </Link>
  )
}
