import Image from 'next/image'
import type { ReactNode } from 'react'

import bannerImage from '~/../public/images/banner.jpg'
import { BrandLogo } from '~/components/ui/brand-logo'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <BrandLogo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={bannerImage}
          alt="Banner Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export { AuthLayout }
