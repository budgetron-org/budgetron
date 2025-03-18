'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  SquareUserRound,
} from 'lucide-react'
import { type ComponentProps, useCallback } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function initials(fname: string, lname?: string) {
  return lname ? fname[0] + lname[0] : fname[0].repeat(2)
}

const USER_DEFAULTS = {
  firstName: 'User',
  lastName: undefined,
  fullName: 'User',
} as const

type Props = ComponentProps<typeof DropdownMenuTrigger> & {
  triggerType?: 'full' | 'iconOnly'
}

export function UserNav({
  triggerType = 'iconOnly',
  className,
  ...props
}: Props) {
  const { user } = useUser()
  const auth = useAuth()

  // menu item handlers
  const doLogout = useCallback(() => {
    auth.signOut({ redirectUrl: '/' })
  }, [auth])

  if (!user) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-2" />
          <Skeleton className="h-2" />
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className} {...props}>
        <Button variant="ghost" className="h-10 w-10 rounded-lg">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName ?? USER_DEFAULTS.fullName}
            />
            <AvatarFallback className="rounded-lg">
              {initials(
                user.firstName ?? USER_DEFAULTS.firstName,
                user.lastName ?? USER_DEFAULTS.lastName,
              )}
            </AvatarFallback>
          </Avatar>
          {triggerType === 'full' && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.fullName ?? ''}
                </span>
                <span className="truncate text-xs">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 p-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.imageUrl}
                alt={user.fullName ?? USER_DEFAULTS.fullName}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.fullName ?? USER_DEFAULTS.fullName}
              </span>
              <span className="truncate text-xs">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <SquareUserRound />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={doLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
