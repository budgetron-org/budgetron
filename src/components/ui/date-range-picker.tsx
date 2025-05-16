'use client'

import { IconCalendar, IconCheck } from '@tabler/icons-react'
import {
  endOfMonth,
  endOfToday,
  endOfYear,
  format,
  isEqual,
  isSameDay,
  max,
  min,
  startOfMonth,
  startOfToday,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'
import { type ComponentProps, useCallback, useId, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { DateInput } from '~/components/ui/date-input'
import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { cn } from '~/lib/utils'

type DateRangeRequired = Required<Partial<DateRange>>

// Define presets
const PRESETS = [
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' },
  { name: 'last3Months', label: 'Last 3 Months' },
  { name: 'last6Months', label: 'Last 6 Months' },
  { name: 'thisYear', label: 'This Year' },
  { name: 'lastYear', label: 'Last Year' },
] as const
type Preset = (typeof PRESETS)[number]['name']

function getRangeFromPreset(preset: Preset) {
  switch (preset) {
    case 'thisMonth':
      return {
        from: startOfMonth(startOfToday()),
        to: endOfToday(),
      }
    case 'lastMonth':
      return {
        from: startOfMonth(subMonths(startOfToday(), 1)),
        to: endOfMonth(subMonths(startOfToday(), 1)),
      }
    case 'last3Months':
      return {
        from: startOfMonth(subMonths(startOfToday(), 3)),
        to: endOfMonth(subMonths(startOfToday(), 1)),
      }
    case 'last6Months':
      return {
        from: startOfMonth(subMonths(startOfToday(), 6)),
        to: endOfMonth(subMonths(startOfToday(), 1)),
      }
    case 'thisYear':
      return {
        from: startOfYear(startOfToday()),
        to: endOfToday(),
      }
    case 'lastYear':
      return {
        from: startOfYear(subYears(startOfToday(), 1)),
        to: endOfYear(subYears(startOfToday(), 1)),
      }
    default:
      throw Error(`DateRangePicker - Unknown preset - ${preset}`)
  }
}

function getPresetFromRange(range: DateRange) {
  if (!range.from || !range.to) return undefined

  return PRESETS.find((preset) => {
    const presetRange = getRangeFromPreset(preset.name)
    return (
      isSameDay(range.from!, presetRange.from) &&
      isSameDay(range.to!, presetRange.to)
    )
  })
}

function isCompleteRange(range?: DateRange): range is DateRangeRequired {
  return !!range && !!range.from && !!range.to
}

function isEqualRange(leftRange?: DateRange, rightRange?: DateRange) {
  if (!leftRange || !rightRange) return leftRange === rightRange
  if (!isCompleteRange(leftRange) || !isCompleteRange(rightRange)) return false
  return (
    isEqual(leftRange.from, rightRange.from) &&
    isEqual(leftRange.to, rightRange.to)
  )
}

function getRangeFromValue(value?: DateRangeRequired | Preset) {
  if (typeof value === 'string') {
    return getRangeFromPreset(value)
  }
  return value
}

interface DateRangePickerProps
  extends Omit<
    ComponentProps<typeof Button>,
    'defaultValue' | 'value' | 'onChange'
  > {
  onChange?: (range: DateRangeRequired) => void
  defaultValue?: DateRangeRequired | Preset
  align?: 'start' | 'center' | 'end'
}

function DateRangePicker({
  align = 'end',
  className,
  defaultValue,
  onChange,
  ...props
}: DateRangePickerProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [range, setRange] = useState(getRangeFromValue(defaultValue))
  const [transientRange, setTransientRange] = useState<DateRange | undefined>(
    getRangeFromValue(defaultValue) ?? getRangeFromPreset('thisMonth'),
  )
  const [selectedPreset, setSelectedPreset] = useState<Preset | undefined>(
    transientRange ? getPresetFromRange(transientRange)?.name : undefined,
  )
  const [viewMonth, setViewMonth] = useState(
    transientRange?.from ?? startOfToday(),
  )

  const updateTransientRangeForPreset = useCallback((preset: Preset) => {
    const range = getRangeFromPreset(preset)
    setSelectedPreset(preset)
    setTransientRange(range)
    setViewMonth(range.from)
  }, [])

  const setTransientRangeAndPreset = useCallback((range?: DateRange) => {
    setTransientRange(range)
    if (range) {
      const preset = getPresetFromRange(range)
      setSelectedPreset(preset?.name)
    } else {
      setSelectedPreset(undefined)
    }
  }, [])

  const resetValues = useCallback(() => {
    setTransientRangeAndPreset(range)
  }, [setTransientRangeAndPreset, range])

  const isMobile = useIsMobile()

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues()
        }
        setIsOpen(open)
      }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-[250px]', className)}
          {...props}>
          <IconCalendar className="mr-2 h-4 w-4" />
          {range ? (
            <>
              {getPresetFromRange(range)?.label ??
                `${format(range.from, 'LLL dd, y')} - ${format(range.to, 'LLL dd, y')}`}
            </>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="flex w-auto gap-2">
        <div className="flex flex-col items-start gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant="link"
              onClick={() => {
                updateTransientRangeForPreset(preset.name)
              }}>
              {preset.label}
              <IconCheck
                className={cn(selectedPreset !== preset.name && 'opacity-0')}
              />
            </Button>
          ))}
        </div>
        <div className="grid auto-rows-min grid-cols-2 gap-2">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-startDate`}>Start date</Label>
            <DateInput
              id={`${id}-startDate`}
              value={transientRange?.from}
              onChange={(date) => {
                setTransientRangeAndPreset({
                  from: date,
                  to: max([date, transientRange?.to ?? date]),
                })
                setViewMonth(date)
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-endDate`}>End Date</Label>
            <DateInput
              id={`${id}-endDate`}
              value={transientRange?.to}
              onChange={(date) => {
                setTransientRangeAndPreset({
                  from: min([date, transientRange?.from ?? date]),
                  to: date,
                })
                setViewMonth(date)
              }}
            />
          </div>
          <Calendar
            className="col-span-2"
            mode="range"
            showOutsideDays={false}
            onSelect={setTransientRangeAndPreset}
            selected={transientRange}
            numberOfMonths={isMobile ? 1 : 2}
            month={viewMonth}
            onMonthChange={setViewMonth}
          />
          <div className="col-span-2 flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsOpen(false)
                resetValues()
              }}
              variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={
                !isCompleteRange(transientRange) ||
                isEqualRange(transientRange, range)
              }
              onClick={() => {
                setIsOpen(false)
                if (
                  isCompleteRange(transientRange) &&
                  !isEqualRange(transientRange, range)
                ) {
                  setRange(transientRange)
                  onChange?.(transientRange)
                }
              }}>
              Update
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
export type { DateRangeRequired }
