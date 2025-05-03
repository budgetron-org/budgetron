import type { ReactNode } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'

export default function SpendingPlanLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ScrollArea className="max-h-[calc(100%-var(--header-height))] flex-1 p-4">
      {children}
    </ScrollArea>
  )
}
