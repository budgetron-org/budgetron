'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useMemo,
  useState,
} from 'react'

import type { GetHouseholdsResponse } from '@/app/api/households/route'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useHousehold } from '@/hooks/use-household'
import { PERSONAL_ICON, PERSONAL_LABEL } from '@/lib/constants'
import { cn, safeParseLucideIcon } from '@/lib/utils'
import { CreateHouseholdDialog } from './create-household-dialog'

function findHousehold(data: GetHouseholdsResponse, id: string) {
  for (const group of data) {
    for (const household of group.households) {
      if (household.id === id) return household
    }
  }
}

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>
type HouseholdSwitcherProps = PopoverTriggerProps & {}

export function HouseholdSwitcher({ className }: HouseholdSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [showNewHouseholdDialog, setShowNewHouseholdDialog] = useState(false)
  const closeDialog = useCallback(() => {
    setOpen(false)
    setShowNewHouseholdDialog(false)
  }, [])

  const { currentHouseholdId, setCurrentHousehold } = useHousehold()
  const { data, status } = useQuery<GetHouseholdsResponse>({
    queryKey: ['households'],
    queryFn: ({ signal }) =>
      fetch('/api/households', { signal }).then((res) => res.json()),
  })

  const selectedHousehold = useMemo(() => {
    if (status !== 'success' || !currentHouseholdId) return undefined
    return findHousehold(data, currentHouseholdId)
  }, [currentHouseholdId, data, status])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label={
            status === 'success' ? 'Select a household' : 'Loading households'
          }
          // TODO: Support for households
          disabled={true}
          className={cn('w-full max-w-[200px] justify-between', className)}>
          {status !== 'success' ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <>
              <DynamicIcon
                name={safeParseLucideIcon(
                  selectedHousehold?.icon ?? PERSONAL_ICON,
                )}
              />
              <span className="overflow-hidden text-ellipsis">
                {selectedHousehold?.name ?? PERSONAL_LABEL}
              </span>
            </>
          )}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search households..." />
          <CommandList>
            <CommandEmpty>
              {status !== 'success'
                ? 'Loading households...'
                : 'No household found.'}
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setCurrentHousehold(undefined)
                  setOpen(false)
                }}
                className="cursor-pointer text-sm">
                <DynamicIcon name={PERSONAL_ICON} />
                {PERSONAL_LABEL}
                <Check
                  className={cn(
                    'ml-auto',
                    currentHouseholdId === undefined
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
              </CommandItem>
            </CommandGroup>
            {status === 'success' &&
              data.map(
                (group) =>
                  group.households.length > 0 && (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.households.map((household) => (
                        <CommandItem
                          key={household.id}
                          onSelect={() => {
                            setCurrentHousehold(household.id)
                            setOpen(false)
                          }}
                          className="cursor-pointer text-sm">
                          <DynamicIcon
                            name={safeParseLucideIcon(household.icon)}
                          />
                          {household.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              currentHouseholdId === household.id
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
              )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CreateHouseholdDialog
                trigger={
                  <CommandItem
                    onSelect={() => {
                      setShowNewHouseholdDialog(true)
                    }}
                    className="cursor-pointer">
                    <PlusCircle className="h-5 w-5" />
                    Create Household
                  </CommandItem>
                }
                open={showNewHouseholdDialog}
                onOpenChange={setShowNewHouseholdDialog}
                onSuccess={closeDialog}
                onCancel={closeDialog}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
