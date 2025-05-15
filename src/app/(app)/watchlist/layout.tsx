import type { ReactNode } from 'react'

export default function WatchlistLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-[calc(100%-var(--header-height))] flex-1 p-4">
      {children}
    </div>
  )
}
