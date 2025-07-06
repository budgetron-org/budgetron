import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { ResetPasswordExpiredPage } from '~/features/auth/components/reset-password-expired-page'
import { ResetPasswordForm } from '~/features/auth/components/reset-password-form'
import { redirectAuthenticated } from '~/features/auth/utils'
import type { NextServerPageProps } from '~/types/shared'

async function ResetPasswordPageImpl({
  searchParams,
}: Pick<NextServerPageProps, 'searchParams'>) {
  // Redirect to home if already signed in
  await redirectAuthenticated()

  // If there is no token or invalid token show the token expired page
  const searchParamsValue = await searchParams
  const token = searchParamsValue['token']
  const error = searchParamsValue['error']
  if (error || !token || typeof token !== 'string') {
    return <ResetPasswordExpiredPage />
  }

  return <ResetPasswordForm token={token} />
}

export default async function ResetPasswordPage({
  searchParams,
}: NextServerPageProps) {
  return (
    <SuspenseBoundary fullScreenFallback>
      <ResetPasswordPageImpl searchParams={searchParams} />
    </SuspenseBoundary>
  )
}
