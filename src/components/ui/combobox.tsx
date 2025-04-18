'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type ComboboxProps = ComponentProps<typeof Button> & {
  data: { value: string; label: string }[]
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

function Combobox({
  className,
  data,
  placeholder,
  value,
  onChange,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          {...props}>
          {value
            ? data.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    if (currentValue !== value) {
                      onChange?.(currentValue)
                    }
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
