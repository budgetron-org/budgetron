import { capitalize } from 'lodash'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { BrandLogo } from '~/components/widgets/brand-logo'
import { PATHS } from '~/data/routes'
import { SignInButton } from '~/features/auth/components/sign-in-button'
import { SignUpButton } from '~/features/auth/components/sign-up-button'
import { SignedIn } from '~/features/auth/components/signed-in'
import { SignedOut } from '~/features/auth/components/signed-out'
import { APP_NAME, APP_VERSION } from '~/lib/app-metadata'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BrandLogo size="lg" />
      <div className="flex gap-4">
        <SignedIn fallback={<Skeleton className="h-9 w-48" />}>
          <Button variant="default" asChild>
            <Link href={PATHS.DASHBOARD}>Start tracking expenses</Link>
          </Button>
        </SignedIn>
        <SignedOut fallback={<Skeleton className="h-9 w-48" />}>
          <SignInButton variant="secondary">Sign In</SignInButton>
          <SignUpButton variant="default">Join now</SignUpButton>
        </SignedOut>
      </div>
      <div className="absolute right-4 bottom-4 left-4">
        <div className="text-muted-foreground text-center text-sm">
          <p>
            © {new Date().getFullYear()} {capitalize(APP_NAME)}. All rights
            reserved.
          </p>
          <p>
            Version: {APP_VERSION} (See{' '}
            <Link
              className="underline underline-offset-4"
              href={PATHS.CHANGELOG}>
              Changelog
            </Link>
            )
          </p>
        </div>
      </div>
    </div>
  )
}
