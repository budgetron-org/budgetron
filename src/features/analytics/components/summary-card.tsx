'use client'

import {
  useCallback,
  useMemo,
  type ComponentProps,
  type ComponentPropsWithoutRef,
} from 'react'

import { BarChart } from '~/components/ui/bar-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { type ChartConfig } from '~/components/ui/chart'
import { getCurrencyFormatter } from '~/lib/format'
import { formatMonthLabel, safeParseNumber } from '~/lib/utils'
import type { MonthlySummary } from '../types'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-2)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

// TODO: get currency from user settings
const currencyFormatter = getCurrencyFormatter('USD')

interface SummaryCardProps extends ComponentPropsWithoutRef<typeof Card> {
  data: MonthlySummary[]
  title: string
  description: string
  type: 'income' | 'expense'
}

function SummaryCard({
  data,
  title,
  description,
  type,
  ...props
}: SummaryCardProps) {
  const chartData = useMemo(
    () =>
      data.map((i) => ({
        month: i.month,
        expense: Math.abs(i.expense),
        income: i.income,
      })),
    [data],
  )
  const xAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['xAxisFormatter']>
  >((value) => formatMonthLabel(String(value)), [])
  const yAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['yAxisFormatter']>
  >((value) => currencyFormatter.format(safeParseNumber(value)), [])

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="h-[50vh]">
        <BarChart
          config={chartConfig}
          data={chartData}
          xAxisKey="month"
          barKeys={[type]}
          xAxisFormatter={xAxisFormatter}
          yAxisFormatter={yAxisFormatter}
        />
      </CardContent>
    </Card>
  )
}

export { SummaryCard }
