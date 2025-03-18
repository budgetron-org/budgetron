import type { ReactNode } from 'react'

export default function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  )
}
