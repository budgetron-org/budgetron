import type { ReactNode } from 'react'

function AccountPageContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6 p-2">{children}</div>
}

export { AccountPageContainer }
