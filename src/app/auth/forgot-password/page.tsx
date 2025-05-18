import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { ForgotPasswordForm } from '~/features/auth/components/forgot-password-form'
import { redirectAuthenticated } from '~/features/auth/server'

async function ForgotPasswordPageImpl() {
  // Redirect to home if already signed in
  redirectAuthenticated()

  return <ForgotPasswordForm />
}

export default async function ForgotPasswordPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <ForgotPasswordPageImpl />
    </SuspenseBoundary>
  )
}
