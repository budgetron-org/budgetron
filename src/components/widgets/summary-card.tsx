'use client'
import { format } from 'date-fns'
import { useMemo, type ComponentPropsWithoutRef } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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
import { getCurrencyFormatter } from '~/lib/format'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-2)',
  },
  spending: {
    label: 'Spending',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

type SummaryCardProps = ComponentPropsWithoutRef<typeof Card> & {
  data: MonthlySummary[]
  title: string
  description: string
  type: 'income' | 'spending'
}

function SummaryCard({
  data,
  title,
  description,
  type,
  ...props
}: SummaryCardProps) {
  // TODO: Get from preferences
  const formatter = getCurrencyFormatter('USD')
  const chartData = useMemo(
    () =>
      data.map((i) => ({
        label: `${format(new Date(i.year, i.month), 'MMM yyyy')}`,
        spending: i.expense,
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

      <CardContent>
        {hasData && (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={true} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                dataKey={type}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => formatter.format(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey={type} fill={`var(--color-${type})`} radius={4} />
            </BarChart>
          </ChartContainer>
        )}
        {!hasData && (
          <div className="flex h-[50vh] w-full items-center justify-center">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { SummaryCard }
