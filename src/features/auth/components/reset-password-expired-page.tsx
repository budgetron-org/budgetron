import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { AuthHeader } from './auth-header'
import { PATHS } from '~/data/routes'

function ResetPasswordExpiredPage() {
  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Reset password expired or invalid"
        subtitle="The link you used to reset your password has expired or is invalid. Please sign in or try again."
      />
      <Link href={PATHS.SIGN_IN} className="mx-auto">
        <Button>Go back to Sign In</Button>
      </Link>
    </div>
  )
}

export { ResetPasswordExpiredPage }
