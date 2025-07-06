import type { ComponentProps } from 'react'

import { NavMain } from '~/components/layout/nav-main'
import { NavSecondary } from '~/components/layout/nav-secondary'
import { NavUser } from '~/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { BrandLogo } from '~/components/widgets/brand-logo'
import { PATHS } from '~/data/routes'
import { redirectToSignIn } from '~/features/auth/utils'
import { api } from '~/rpc/server'

async function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const session = await api.auth.session()
  if (!session?.user) redirectToSignIn()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <BrandLogo href={PATHS.DASHBOARD} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export { AppSidebar }
