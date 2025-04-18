'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

import { BrandLogo } from '~/components/brand-logo'
import { ModeToggle } from '~/components/mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '~/components/ui/sidebar'
import { APP_MAIN_NAV_LINKS } from '~/data/nav-links'
import { cn } from '~/lib/utils'

export function MainSideBar({
  className,
  ...props
}: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className={cn('p-2', className)} {...props}>
      <SidebarHeader>
        <div className="flex justify-items-stretch gap-2">
          <BrandLogo isIconOnly />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {APP_MAIN_NAV_LINKS.map((props) => (
              <SidebarMenuItem key={props.href}>
                <SidebarMenuButton isActive={pathname === props.href} asChild>
                  <Link {...props} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle className="self-end" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
