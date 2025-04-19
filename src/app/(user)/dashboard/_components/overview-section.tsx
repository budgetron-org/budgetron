'use client'

import { endOfMonth, startOfMonth } from 'date-fns'
import { LandmarkIcon, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { MonthInlinePicker } from '~/components/month-inline-picker'
import { buttonVariants } from '~/components/ui/button'
import { MONTH_PICKER_START } from '~/lib/constants'
import { getCurrencyFormatter } from '~/lib/format'
import { cn, safeParseNumber } from '~/lib/utils'
import { api } from '~/trpc/client'
import { StatCard } from './stat-card'

export function OverviewSection() {
  const [month, setMonth] = useState(new Date())
  const dateRange = useMemo(
    () => ({ from: startOfMonth(month), to: endOfMonth(month) }),
    [month],
  )

  // Data for the stats card based on the date picker value
  const stats = api.overview.stats.useQuery({
    from: dateRange.from,
    to: dateRange.to,
  })
  const formatter = useMemo(() => getCurrencyFormatter('USD'), [])

  const income = safeParseNumber(stats.data?.income, 0)
  const spending = safeParseNumber(stats.data?.expense, 0)
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
          isLoading={stats.isPending}
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
          isLoading={stats.isPending}
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
          isLoading={stats.isPending}
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
    </div>
  )
}
