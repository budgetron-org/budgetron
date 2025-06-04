'use client'
import { format } from 'date-fns'
import { useMemo, type ComponentPropsWithoutRef } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'
import type { MonthlySummary } from '~/features/analytics/types'

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
        label: `${format(new Date(i.year, i.month), 'MMM yyyy')}`,
        expense: Math.abs(i.expense),
        income: i.income,
      })),
    [data],
  )
  const hasData = useMemo(
    () => chartData.length > 0 && chartData.some((i) => i[type] > 0),
    [chartData, type],
  )

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="h-[50vh]">
        {hasData && (
          <ChartContainer config={chartConfig} className="aspect-auto h-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey={type} fill={`var(--color-${type})`} radius={4} />
            </BarChart>
          </ChartContainer>
        )}
        {!hasData && (
          <div className="flex aspect-auto h-full items-center justify-center">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { SummaryCard }
