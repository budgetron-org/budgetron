import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { AuthScreenLayout } from './auth-screen-layout'

function ResetPasswordExpiredPage() {
  return (
    <AuthScreenLayout
      title="Reset password expired or invalid"
      subtitle="The link you used to reset your password has expired or is invalid. Please sign in or try again.">
      <Link href="/sign-in" className="mx-auto">
        <Button>Go back to Sign In</Button>
      </Link>
    </AuthScreenLayout>
  )
}

export { ResetPasswordExpiredPage }
