import { IconLoader2 } from '@tabler/icons-react'
import { Suspense } from 'react'

type SuspenseBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function SuspenseBoundary({ children, fallback }: SuspenseBoundaryProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="flex h-full w-full items-center justify-center">
            <IconLoader2 className="animate-spin" />
          </div>
        )
      }>
      {children}
    </Suspense>
  )
}

export { SuspenseBoundary }
