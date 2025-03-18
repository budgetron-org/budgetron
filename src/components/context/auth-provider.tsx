import { ClerkProvider } from '@clerk/nextjs'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider waitlistUrl="/auth/waitlist">{children}</ClerkProvider>
}
