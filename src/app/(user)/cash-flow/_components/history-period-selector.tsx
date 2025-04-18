import { format, getMonth, getYear, isAfter } from 'date-fns'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { TimeFrame, TimePeriod } from '~/types'
import { useMemo } from 'react'
import { range } from 'lodash'

const current = {
  month: getMonth(Date.now()),
  year: getYear(Date.now()),
}

type HistoryPeriodSelectorProps = {
  timeFrame: TimeFrame
  onTimeFrameChange: (value: TimeFrame) => void
  timePeriod: TimePeriod
  onTimePeriodChange: (value: TimePeriod) => void
  min: TimePeriod
  max?: TimePeriod
}

export function HistoryPeriodSelector({
  timeFrame,
  onTimeFrameChange,
  timePeriod,
  onTimePeriodChange,
  min,
  max = current,
}: HistoryPeriodSelectorProps) {
  assertMinMax(min, max)

  return (
    <div className="flex items-center justify-start gap-4">
      <Tabs
        value={timeFrame}
        onValueChange={(value) => onTimeFrameChange(value as TimeFrame)}>
        <TabsList>
          <TabsTrigger value="month" className="cursor-pointer">
            Month
          </TabsTrigger>
          <TabsTrigger value="year" className="cursor-pointer">
            Year
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <MonthYearSelector
        value={timePeriod}
        onValueChange={onTimePeriodChange}
        granularity={timeFrame}
        min={min}
        max={max}
      />
    </div>
  )
}

type MonthYearSelectorProps = {
  value: TimePeriod
  onValueChange: (value: TimePeriod) => void
  granularity: TimeFrame
  min: TimePeriod
  max: TimePeriod
}
function MonthYearSelector({
  value,
  onValueChange,
  granularity,
  min,
  max,
}: MonthYearSelectorProps) {
  const years = useMemo(() => range(min.year, max.year + 1), [min, max])

  const months = range(0, 12)
  const enabledMonths = useMemo(() => {
    // if current selected year is neither min year nor max year then we will
    // have full months range
    if (value.year > min.year && value.year < max.year) return range(0, 12)

    // if min and max is the same as the current year, then use month range from min and max
    if (value.year === min.year && value.year === max.year)
      return range(min.month, max.month + 1)

    // if current selected year is min, then pick the months from min to 11
    if (value.year === min.year) return range(min.month, 12)
    // if current selected year is max, then pick the months from 0 to max + 1
    if (value.year === max.year) return range(0, max.month + 1)

    // as a catch all, return full range
    return range(0, 12)
  }, [value.year, max, min])

  return (
    <>
      {granularity === 'month' && (
        <Select
          value={value.month.toString()}
          onValueChange={(month) =>
            onValueChange({ ...value, month: Number.parseInt(month) })
          }>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem
                key={month}
                value={month.toString()}
                disabled={!enabledMonths.includes(month)}>
                {format(new Date(value.year, month, 1), 'MMMM')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={value.year.toString()}
        onValueChange={(year) =>
          onValueChange({ ...value, year: Number.parseInt(year) })
        }>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {format(new Date(year, value.month, 1), 'yyyy')}
            </SelectItem>
          ))}
        </SelectContent>{' '}
      </Select>
    </>
  )
}

function assertMinMax(min: TimePeriod, max: TimePeriod) {
  const dMin = new Date(min.year, min.month)
  const dMax = new Date(max.year, max.month)

  if (isAfter(dMin, dMax))
    throw new Error('min time period is after max time period')
}
