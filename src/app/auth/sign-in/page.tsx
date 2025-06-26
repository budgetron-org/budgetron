import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { env } from '~/env/server'
import { SignInForm } from '~/features/auth/components/sign-in-form'
import { SignInWithGoogle } from '~/features/auth/components/sign-in-with-google'
import { SignInWithOAuth } from '~/features/auth/components/sign-in-with-oauth'
import { redirectAuthenticated } from '~/features/auth/server'
import { isGoogleAuthEnabled, isOAuthAuthEnabled } from '~/lib/utils'

async function SignInPageImpl() {
  // Redirect to home if already signed in
  await redirectAuthenticated()

  return (
    <SignInForm
      redirectAfterSignIn={PATHS.DASHBOARD}
      providers={[
        isGoogleAuthEnabled(env) && <SignInWithGoogle key="google" />,
        isOAuthAuthEnabled(env) && (
          <SignInWithOAuth key="oauth" providerName={env.OAUTH_PROVIDER_NAME} />
        ),
      ].filter(Boolean)}
    />
  )
}

export default async function SignInPage() {
  return (
    <SuspenseBoundary fullScreenFallback>
      <SignInPageImpl />
    </SuspenseBoundary>
  )
}
