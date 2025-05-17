import { redirect } from 'next/navigation'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { ForgotPasswordForm } from '~/features/auth/components/forgot-password-form'
import { api } from '~/rpc/server'

async function ForgotPasswordPageImpl() {
  // Redirect to home if already signed in
  const session = await api.auth.session()
  if (session?.user) redirect('/dashboard')

  return <ForgotPasswordForm />
}

export default async function ForgotPasswordPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <ForgotPasswordPageImpl />
    </SuspenseBoundary>
  )
}
