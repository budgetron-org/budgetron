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
        <div
          className={cn(
            'flex items-center justify-center',
            fullScreenFallback && 'h-screen w-screen',
            !fullScreenFallback && 'h-full w-full',
          )}>
          {fallback ?? <IconLoader2 className="animate-spin" />}
        </div>
      }>
      {children}
    </Suspense>
  )
}

export { SuspenseBoundary }
