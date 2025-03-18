import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonWrapper({
  children,
  isLoading,
}: {
  children: ReactNode
  isLoading?: boolean
}) {
  if (!isLoading) return children
  return (
    <Skeleton>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  )
}
