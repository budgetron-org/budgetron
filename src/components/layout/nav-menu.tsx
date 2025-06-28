'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FunctionComponent } from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar'

function isCurrentPath(item: Item, pathname: string) {
  // if the item is the dashboard, then do a strict match
  if (item.url === '/dashboard') {
    return pathname === item.url
  }
  // otherwise, do a prefix match as we want to treat child paths as
  // selected
  return pathname.startsWith(item.url)
}

type Item = {
  title: string
  url: string
  icon: FunctionComponent
  isSelected?: boolean
}
function NavMenu({ className, items }: { className?: string; items: Item[] }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isCurrentPath(item, pathname)}
                asChild>
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export { NavMenu }
