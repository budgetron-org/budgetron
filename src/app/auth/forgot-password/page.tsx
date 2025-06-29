import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { AuthHeader } from '~/features/auth/components/auth-header'
import { ForgotPasswordForm } from '~/features/auth/components/forgot-password-form'
import { redirectAuthenticated } from '~/features/auth/server'
import { forgotPasswordFeatureFlag } from '~/server/flags'

async function ForgotPasswordPageImpl() {
  // Redirect to home if already signed in
  await redirectAuthenticated()

  // Check if forgot password feature is enabled
  const isForgotPasswordFeatureEnabled = await forgotPasswordFeatureFlag()
  if (!isForgotPasswordFeatureEnabled) {
    return (
      <div className="flex flex-col gap-6">
        <AuthHeader
          title="Password reset is not available"
          subtitle="Please contact support if you need to reset your password."
        />
        <Link href={PATHS.SIGN_IN} className="mx-auto">
          <Button>Go to Sign In</Button>
        </Link>
      </div>
    )
  }

  return <ForgotPasswordForm />
}

export default async function ForgotPasswordPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <ForgotPasswordPageImpl />
    </SuspenseBoundary>
  )
}
