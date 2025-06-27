'use client'

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar'
import { Skeleton } from '~/components/ui/skeleton'
import { PATHS } from '~/data/routes'
import { getPlaceHolderAvatarUrl } from '~/lib/utils'
import { api } from '~/rpc/client'
import type { User } from '~/server/auth'

function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const signOut = useMutation(
    api.auth.signOut.mutationOptions({
      onSuccess({ redirect }) {
        router.push(redirect)
      },

      context: {
        // We do not want batching for the auth calls as we need the server to set
        // auth tokens in the response header.
        skipBatch: true,
      },
    }),
  )

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-2" />
          <Skeleton className="h-2" />
        </div>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.image ?? getPlaceHolderAvatarUrl()}
                  alt={user.name}
                />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image ?? getPlaceHolderAvatarUrl()}
                    alt={user.name}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(PATHS.ACCOUNT)}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut.mutate({})}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavUser }
