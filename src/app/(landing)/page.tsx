import { IconPigMoney } from '@tabler/icons-react'
import Link from 'next/link'

import { BrandLogo } from '~/components/ui/brand-logo'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { SignInButton } from '~/features/auth/components/sign-in-button'
import { SignUpButton } from '~/features/auth/components/sign-up-button'
import { SignedIn } from '~/features/auth/components/signed-in'
import { SignedOut } from '~/features/auth/components/signed-out'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BrandLogo size="lg" />
      <div className="flex gap-4">
        <SignedIn fallback={<Skeleton className="h-9 w-48" />}>
          <Button variant="default" asChild>
            <Link href="/dashboard">
              Start tracking expenses <IconPigMoney />
            </Link>
          </Button>
        </SignedIn>
        <SignedOut fallback={<Skeleton className="h-9 w-48" />}>
          <SignInButton variant="secondary">Sign In</SignInButton>
          <SignUpButton variant="default">Join now</SignUpButton>
        </SignedOut>
      </div>
    </div>
  )
}
