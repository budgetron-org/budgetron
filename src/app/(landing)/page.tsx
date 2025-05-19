import { IconPigMoney } from '@tabler/icons-react'
import Link from 'next/link'

import { BrandLogo } from '~/components/ui/brand-logo'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { PATHS } from '~/data/routes'
import { SignInButton } from '~/features/auth/components/sign-in-button'
import { SignUpButton } from '~/features/auth/components/sign-up-button'
import { SignedIn } from '~/features/auth/components/signed-in'
import { SignedOut } from '~/features/auth/components/signed-out'
import { APP_VERSION } from '~/lib/version'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BrandLogo size="lg" />
      <div className="flex gap-4">
        <SignedIn fallback={<Skeleton className="h-9 w-48" />}>
          <Button variant="default" asChild>
            <Link href={PATHS.DASHBOARD}>
              Start tracking expenses <IconPigMoney />
            </Link>
          </Button>
        </SignedIn>
        <SignedOut fallback={<Skeleton className="h-9 w-48" />}>
          <SignInButton variant="secondary">Sign In</SignInButton>
          <SignUpButton variant="default">Join now</SignUpButton>
        </SignedOut>
      </div>
      <div className="absolute right-4 bottom-4 left-4">
        <div className="text-muted-foreground text-center text-sm">
          <p>© {new Date().getFullYear()} Budgetify. All rights reserved.</p>
          <p>Version: {APP_VERSION}</p>
        </div>
      </div>
    </div>
  )
}
