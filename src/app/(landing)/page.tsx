import { HandCoinsIcon } from 'lucide-react'

import { BrandLogo } from '~/components/brand-logo'
import { SignInButton } from '~/features/auth/components/sign-in-button'
import { SignUpButton } from '~/features/auth/components/sign-up-button'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BrandLogo size="lg" />
      <div className="flex gap-4">
        <SignInButton variant="secondary">Sign In</SignInButton>
        <SignUpButton variant="default">
          Start tracking expenses <HandCoinsIcon />
        </SignUpButton>
      </div>
    </div>
  )
}
