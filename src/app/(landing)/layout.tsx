import type { ReactNode } from 'react'
import { NavModeToggle } from '~/components/layout/nav-mode-toggle'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-screen items-center justify-center">
      <NavModeToggle className="absolute top-4 right-4" />
      {children}
    </div>
  )
}
