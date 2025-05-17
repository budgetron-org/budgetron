import { IconLoader2 } from '@tabler/icons-react'
import { Suspense } from 'react'
import { cn } from '~/lib/utils'

interface SuspenseBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  fullScreenFallback?: boolean
}

function SuspenseBoundary({
  children,
  fallback,
  fullScreenFallback,
}: SuspenseBoundaryProps) {
  return (
    <Suspense
      fallback={
        <div className={cn(fullScreenFallback && 'h-screen w-screen')}>
          {fallback ?? (
            <div className="flex h-full w-full items-center justify-center">
              <IconLoader2 className="animate-spin" />
            </div>
          )}
        </div>
      }>
      {children}
    </Suspense>
  )
}

export { SuspenseBoundary }
