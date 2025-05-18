import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { PATHS } from '~/data/routes'
import { AuthHeader } from './auth-header'

function SignUpRestrictedPage() {
  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Signups are currently disabled"
        subtitle="We’re not accepting new registrations at the moment. Please check back later or contact support if you need assistance."
      />
      <Link href={PATHS.SIGN_IN} className="mx-auto">
        <Button>Go back to Sign In</Button>
      </Link>
    </div>
  )
}

export { SignUpRestrictedPage }
