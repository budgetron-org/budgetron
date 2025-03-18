'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { LandmarkIcon, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { GetOverviewStatsResponse } from '@/app/api/stats/overview/route'
import { MonthInlinePicker } from '@/components/month-inline-picker'
import { buttonVariants } from '@/components/ui/button'
import { MONTH_PICKER_START } from '@/lib/constants'
import { getCurrencyFormatter } from '@/lib/format'
import { cn, toUTCString } from '@/lib/utils'
import { IncomeExpenseHistoryChart } from './income-expense-history-chart'
import { StatCard } from './stat-card'

export function OverviewSection() {
  const [month, setMonth] = useState(new Date())
  const dateRange = useMemo(
    () => ({ from: startOfMonth(month), to: endOfMonth(month) }),
    [month],
  )

  // Data for the stats card based on the date picker value
  const { data: statsData, isFetching } = useQuery<GetOverviewStatsResponse>({
    queryKey: ['overview', 'stats', dateRange.from, dateRange.to] as const,
    queryFn: ({ signal }) =>
      fetch(
        `/api/stats/overview?from=${toUTCString(dateRange.from)}&to=${toUTCString(dateRange.to)}`,
        {
          signal,
        },
      ).then((res) => res.json()),
  })
  const formatter = useMemo(() => getCurrencyFormatter('USD'), [])

  const income = statsData?.income ?? 0
  const spending = statsData?.expense ?? 0
  const savings = income - spending

  // Data for Year-to-Date bar chart

  return (
    <div className="grid h-full w-full gap-4">
      <h3 className="flex gap-2 text-2xl font-semibold">
        For{' '}
        <MonthInlinePicker
          min={MONTH_PICKER_START}
          value={month}
          onChange={setMonth}
        />
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          isLoading={isFetching}
          title="Total income"
          icon={
            <TrendingUp
              className={cn(
                buttonVariants({ variant: 'custom', size: 'icon' }),
                'text-success bg-success/10 cursor-default p-2',
              )}
            />
          }
          formatter={formatter}
          value={income}
        />

        <StatCard
          isLoading={isFetching}
          title="Total spending"
          icon={
            <TrendingDown
              className={cn(
                buttonVariants({ variant: 'custom', size: 'icon' }),
                'text-destructive bg-destructive/10 cursor-default p-2',
              )}
            />
          }
          formatter={formatter}
          value={spending}
        />

        <StatCard
          isLoading={isFetching}
          title="Savings"
          icon={
            <LandmarkIcon
              className={cn(
                buttonVariants({ variant: 'custom', size: 'icon' }),
                'text-alternate bg-alternate/10 cursor-default p-2',
              )}
            />
          }
          formatter={formatter}
          value={savings}
        />
      </div>
      <h3 className="flex gap-2 text-2xl font-semibold">This Year</h3>
      <IncomeExpenseHistoryChart />
    </div>
  )
}
