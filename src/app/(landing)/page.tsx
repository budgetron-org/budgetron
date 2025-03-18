import { HandCoinsIcon } from 'lucide-react'
import Link from 'next/link'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@/auth/components'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BrandLogo size="lg" />
      <div className="flex gap-4">
        <SignedIn>
          <Button asChild>
            <Link className="flex-1 font-semibold" href="/dashboard">
              Let&apos;s get started! <HandCoinsIcon />
            </Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton variant="secondary">Sign In</SignInButton>
          <SignUpButton variant="default">
            Start tracking expenses <HandCoinsIcon />
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  )
}
