'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { capitalize } from 'lodash'
import { useMemo, useState } from 'react'

import type { GetBudgetStatsResponse } from '@/app/api/stats/budget/route'
import { MonthInlinePicker } from '@/components/month-inline-picker'
import { SkeletonWrapper } from '@/components/skeleton-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig } from '@/components/ui/chart'
import { chartColors } from '@/lib/colors'
import { MONTH_PICKER_START } from '@/lib/constants'
import {
  getCurrencyFormatter,
  getLocaleFromCurrency,
  getPercentFormatter,
} from '@/lib/format'
import { safeParseNumber, toTransactionType, toUTCString } from '@/lib/utils'
import { CategoriesStatsCard } from './categories-stats-card'
import { CategoriesStatsChart } from './categories-stats-chart'

type ChartData = {
  categoryId: string
  name: string
  icon: string
  amount: number
  fill: string
}

type BudgetSectionProps = {
  title: string
  type: 'income' | 'spending'
}

export function BudgetSection({ title, type }: BudgetSectionProps) {
  const [month, setMonth] = useState(new Date())
  const dateRange = useMemo(
    () => ({ from: startOfMonth(month), to: endOfMonth(month) }),
    [month],
  )

  const { data, isFetching } = useQuery<GetBudgetStatsResponse>({
    queryKey: ['stats-budget', type, month.getMonth(), month.getFullYear()],
    queryFn: ({ signal }) =>
      fetch(
        `/api/stats/budget?from=${toUTCString(dateRange.from)}&to=${toUTCString(dateRange.to)}&type=${toTransactionType(type)}`,
        { signal },
      ).then((res) => res.json()),
  })

  const chartConfig = useMemo<ChartConfig>(() => {
    if (!data) return {}
    const { categories, summary } = data
    return summary.reduce<ChartConfig>((acc, item, index) => {
      acc[item.categoryId] = {
        label: categories[item.categoryId]?.name ?? `Category ${index + 1}`,
        color: chartColors[index].var,
      }
      return acc
    }, {})
  }, [data])
  const chartData = useMemo<ChartData[]>(() => {
    if (!data) return []
    const { categories, summary } = data
    return summary
      .map<ChartData>((i) => {
        const category = categories[i.categoryId]

        return {
          categoryId: category.id,
          name: category.name,
          icon: category.icon,
          amount: safeParseNumber(i.amount),
          fill: `var(--color-${i.categoryId})`,
        }
      })
      .filter(Boolean)
  }, [data])

  const budgets = useMemo(() => {
    if (!data) return {}
    const { budgets } = data
    return Object.entries(budgets).reduce<Record<string, number>>(
      (acc, [key, value]) => {
        acc[key] = safeParseNumber(value.amount)
        return acc
      },
      {},
    )
  }, [data])

  const currencyFormatter = useMemo(() => getCurrencyFormatter('USD'), [])
  const percentageFormatter = useMemo(
    () => getPercentFormatter(getLocaleFromCurrency('USD')),
    [],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 text-2xl font-bold">
          {title} in{' '}
          <MonthInlinePicker
            min={MONTH_PICKER_START}
            value={month}
            onChange={setMonth}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="grid items-center justify-center gap-4 sm:grid-cols-1 md:grid-cols-2">
        <SkeletonWrapper isLoading={isFetching}>
          <CategoriesStatsChart
            totalTitle={`Total ${capitalize(type)}`}
            config={chartConfig}
            data={chartData}
            currencyFormatter={currencyFormatter}
            percentageFormatter={percentageFormatter}
            amountKey="amount"
            nameKey="name"
            iconKey="icon"
          />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={isFetching}>
          <CategoriesStatsCard
            title="Categories"
            data={chartData}
            budget={budgets}
            currencyFormatter={currencyFormatter}
            percentageFormatter={percentageFormatter}
            type={type}
          />
        </SkeletonWrapper>
      </CardContent>
    </Card>
  )
}
