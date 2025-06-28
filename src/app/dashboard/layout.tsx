import type { CSSProperties, ReactNode } from 'react'
import { AppHeader } from '~/components/layout/app-header'

import { AppSidebar } from '~/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="max-h-dvh max-w-screen overflow-hidden"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0">
        <AppHeader />
        <div className="max-h-[calc(100%-var(--header-height))] flex-1 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
