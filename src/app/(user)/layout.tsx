import type { ReactNode } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Header as DashboardHeader } from './_components/header'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <DashboardHeader />
        <ScrollArea className="max-h-[calc(100vh-64px)]" type="auto">
          <div className="box-border flex w-full flex-1 p-8">{children}</div>
        </ScrollArea>
      </div>
    </SidebarProvider>
  )
}
