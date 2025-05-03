import { Suspense, type ReactNode } from 'react'
import { api } from '~/rpc/server'

async function SignedInImpl({ children }: { children: ReactNode }) {
  const session = await api.auth.session()
  if (session) return children
  return null
}

function SignedIn({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  return (
    <Suspense fallback={fallback}>
      <SignedInImpl>{children}</SignedInImpl>
    </Suspense>
  )
}

export { SignedIn }
