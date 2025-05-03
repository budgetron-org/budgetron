'use client'

import { IconCalendar } from '@tabler/icons-react'
import { format as formatFn } from 'date-fns'
import { useState, type ComponentPropsWithoutRef } from 'react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type DatePickerProps = {
  format?: string
  placeholder?: string
  value?: Date
  onChange?: (value: Date) => void
} & Omit<ComponentPropsWithoutRef<typeof Button>, 'value' | 'onChange'>

function DatePicker({
  className,
  format = 'PPP',
  onChange,
  placeholder = 'Pick a date',
  value,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}>
          <IconCalendar />
          {value ? formatFn(value, format) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={value}
          selected={value}
          onSelect={(value) => {
            if (value) onChange?.(value)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
