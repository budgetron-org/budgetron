import type { ReactNode } from 'react'
import { AuthLayout as AuthLayoutComponent } from '~/features/auth/components/auth-layout'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutComponent>{children}</AuthLayoutComponent>
}
