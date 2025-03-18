'use client'

import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  format,
  isEqual,
  isSameDay,
  max,
  min,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subDays,
  subMonths,
} from 'date-fns'
import { CalendarIcon, CheckIcon } from 'lucide-react'
import { type ComponentProps, useCallback, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DateInput } from '@/components/ui/date-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export type DateRangeRequired = Required<Partial<DateRange>>

// Define presets
const PRESETS = [
  { name: 'today', label: 'Today' },
  { name: 'yesterday', label: 'Yesterday' },
  { name: 'last7', label: 'Last 7 days' },
  { name: 'last14', label: 'Last 14 days' },
  { name: 'last30', label: 'Last 30 days' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'lastWeek', label: 'Last Week' },
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' },
] as const
type Preset = (typeof PRESETS)[number]['name']

function getRangeFromPreset(preset: Preset) {
  switch (preset) {
    case 'today':
      return {
        from: startOfToday(),
        to: endOfToday(),
      }
    case 'yesterday':
      return {
        from: startOfYesterday(),
        to: endOfYesterday(),
      }
    case 'last7':
      return {
        from: subDays(startOfToday(), 6), // as today is inclusive
        to: endOfToday(),
      }
    case 'last14':
      return {
        from: subDays(startOfToday(), 13), // as today is inclusive
        to: endOfToday(),
      }
    case 'last30':
      return {
        from: subDays(startOfToday(), 29), // as today is inclusive
        to: endOfToday(),
      }
    case 'thisWeek':
      return {
        from: startOfWeek(startOfToday()),
        to: endOfToday(),
      }
    case 'lastWeek':
      return {
        from: startOfWeek(subDays(startOfToday(), 7)),
        to: endOfWeek(subDays(startOfToday(), 7)),
      }
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

type DateRangePickerProps = Omit<
  ComponentProps<typeof Button>,
  'defaultValue' | 'value'
> & {
  onUpdate?: (range: DateRangeRequired) => void
  defaultValue?: DateRangeRequired
  align?: 'start' | 'center' | 'end'
}

function DateRangePicker({
  align = 'end',
  className,
  defaultValue,
  onUpdate,
  ...props
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [range, setRange] = useState(defaultValue)
  const [transientRange, setTransientRange] = useState<DateRange | undefined>(
    defaultValue ?? { from: startOfToday(), to: startOfToday() },
  )
  const [selectedPreset, setSelectedPreset] = useState<Preset | undefined>(
    transientRange ? getPresetFromRange(transientRange)?.name : undefined,
  )

  const updateTransientRangeForPreset = useCallback((preset: Preset) => {
    const range = getRangeFromPreset(preset)
    setSelectedPreset(preset)
    setTransientRange(range)
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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range ? (
            <>
              {format(range.from, 'LLL dd, y')} -{' '}
              {format(range.to, 'LLL dd, y')}
            </>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto">
        <div className="grid gap-2">
          <div className="flex gap-2">
            <div className="grid gap-2">
              <div className="flex gap-2">
                <DateInput
                  value={transientRange?.from}
                  onChange={(date) =>
                    setTransientRangeAndPreset({
                      from: date,
                      to: max([date, transientRange?.to ?? date]),
                    })
                  }
                />
                <div className="self-center py-1">-</div>
                <DateInput
                  value={transientRange?.to}
                  onChange={(date) =>
                    setTransientRangeAndPreset({
                      from: min([date, transientRange?.from ?? date]),
                      to: date,
                    })
                  }
                />
              </div>

              {/* Preset selection in Mobile */}
              <div className="flex md:hidden">
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    updateTransientRangeForPreset(value as Preset)
                  }}>
                  <SelectTrigger className="mx-auto mb-2 w-[180px]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Calendar
                  mode="range"
                  showOutsideDays={false}
                  onSelect={setTransientRangeAndPreset}
                  selected={transientRange}
                  numberOfMonths={isMobile ? 1 : 2}
                  defaultMonth={startOfMonth(
                    transientRange?.from ?? Date.now(),
                  )}
                />
              </div>
            </div>

            {/* Preset select in Desktop */}
            <div className="hidden flex-col items-end gap-2 md:flex">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="link"
                  onClick={() => {
                    updateTransientRangeForPreset(preset.name)
                  }}>
                  {preset.label}
                  <CheckIcon
                    className={cn(
                      selectedPreset !== preset.name && 'opacity-0',
                    )}
                  />
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
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
                  onUpdate?.(transientRange)
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
