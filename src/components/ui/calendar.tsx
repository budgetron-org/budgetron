'use client'

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
} from '@tabler/icons-react'
import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-start pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex absolute gap-1 right-3 z-10',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer',
        ),
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100',
        ),
        range_start:
          'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        range_end:
          'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
        today: 'bg-accent text-accent-foreground rounded-md',
        outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Chevron = ChevronIcons[orientation ?? 'left']
          return <Chevron className={cn('size-4', className)} {...props} />
        },
      }}
      {...props}
    />
  )
}

const ChevronIcons = {
  up: IconChevronUp,
  down: IconChevronDown,
  left: IconChevronLeft,
  right: IconChevronRight,
}

export { Calendar }
