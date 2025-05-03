import { Suspense, type ReactNode } from 'react'
import { api } from '~/rpc/server'

async function SignedOutImpl({ children }: { children: ReactNode }) {
  const session = await api.auth.session()
  if (session) return null
  return children
}

function SignedOut({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  return (
    <Suspense fallback={fallback}>
      <SignedOutImpl>{children}</SignedOutImpl>
    </Suspense>
  )
}

export { SignedOut }
