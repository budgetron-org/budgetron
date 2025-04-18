'use client'

import { format as formatFn } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

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
  onChange?: (value?: Date) => void
}

export function DatePicker({
  format = 'PPP',
  onChange,
  placeholder = 'Pick a date',
  value,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}>
          <CalendarIcon />
          {value ? formatFn(value, format) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
