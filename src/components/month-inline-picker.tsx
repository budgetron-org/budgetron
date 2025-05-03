'use client'

import {
  format,
  formatISO,
  getMonth,
  getYear,
  isAfter,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { useCallback, useMemo } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const CURRENT_MONTH = startOfMonth(Date.now())

function generateMonthsGroupedByYear(start: Date, end: Date) {
  const months = [] as { year: number; months: Date[] }[]

  let currentYear: (typeof months)[number] = {
    year: getYear(end),
    months: [],
  }
  let currentDate = end
  while (isAfter(currentDate, start)) {
    if (getYear(currentDate) === currentYear.year) {
      currentYear.months.push(startOfMonth(currentDate))
    } else {
      months.push(currentYear)
      currentYear = {
        year: getYear(currentDate),
        months: [currentDate],
      }
    }
    currentDate = subMonths(currentDate, 1)
  }

  if (months.length && months[months.length - 1].year !== currentYear.year) {
    months.push(currentYear)
  }

  return months
}

type MonthInlinePickerProps = {
  value?: Date
  min: Date
  max?: Date
  onChange?: (value: Date) => void
}

function MonthInlinePicker({
  max = CURRENT_MONTH,
  min,
  onChange,
  value,
}: MonthInlinePickerProps) {
  const options = useMemo(
    () => generateMonthsGroupedByYear(min, max),
    [min, max],
  )

  const selectValue = useMemo(
    () => value && formatISO(startOfMonth(value)),
    [value],
  )
  const onSelectValueChange = useCallback(
    (value: string) => {
      onChange?.(parseISO(value))
    },
    [onChange],
  )

  return (
    <Select value={selectValue} onValueChange={onSelectValueChange}>
      <SelectTrigger className="w-40">
        <SelectValue
          className="!text-[length:inherit] !text-inherit"
          placeholder="Select a month"
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((year) => (
          <SelectGroup key={year.year}>
            <SelectLabel>{year.year}</SelectLabel>
            {year.months.map((month) => (
              <SelectItem key={getMonth(month)} value={formatISO(month)}>
                {format(month, 'LLLL, RRRR')}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

export { MonthInlinePicker }
