'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { type RefCallback, useState } from 'react'

import type { GetIconsResponse } from '~/app/api/icons/route'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useDebouncedState } from '~/hooks/use-debounced-state'

const PLACEHOLDER_ICON: IconName = 'ban'

type IconListProps = {
  icons: { name: IconName }[]
  selected?: IconName
  onSelect?: (value: IconName) => void
}
function IconList({ icons, onSelect }: IconListProps) {
  return (
    <div className="grid h-48 grid-cols-5 gap-4 overflow-y-auto">
      {icons.map((icon) => (
        <Tooltip key={icon.name}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              title={icon.name}
              onClick={() => onSelect?.(icon.name)}>
              <DynamicIcon name={icon.name} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{icon.name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

type IconPickerProps = {
  name?: string
  defaultValue?: IconName
  maxIcons?: number
  ref?: RefCallback<HTMLButtonElement>
  onBlur?: () => void
  onChange?: (value: IconName) => void
}
export function IconPicker({
  defaultValue,
  maxIcons = 50,
  onChange,
  ...props
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [search, setSearch] = useDebouncedState('', 500, { leading: true })
  const { data, status } = useQuery<GetIconsResponse>({
    queryKey: ['icons', search, maxIcons] as const,
    queryFn: ({ queryKey: [, query, limit], signal }) =>
      fetch(`/api/icons?query=${query}&limit=${limit}`, { signal }).then(
        (res) => res.json(),
      ),
  })

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        setSearch('')
      }}>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="outline" {...props}>
          <DynamicIcon name={value ?? PLACEHOLDER_ICON} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid gap-4 p-4">
        <Input
          aria-label="Search icons"
          placeholder="Search icons"
          onChange={(event) => {
            setSearch(event.target.value)
          }}
        />
        {status === 'success' && (
          <IconList
            icons={data}
            onSelect={(icon) => {
              setValue(icon)
              onChange?.(icon)
              setIsOpen(false)
            }}
          />
        )}
        {status === 'pending' && (
          <>
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </>
        )}
        {status === 'error' && (
          <Alert>
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Unable to load icons</AlertDescription>
          </Alert>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
