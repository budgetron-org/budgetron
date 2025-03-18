'use client'

import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import type { GetYTDSummaryResponse } from '@/app/api/stats/ytd-summary/route'
import { SkeletonWrapper } from '@/components/skeleton-wrapper'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { MONTH_NAMES } from '@/lib/constants'
import { safeParseNumber } from '@/lib/utils'
import type { MonthName } from '@/types'

type ChartData = {
  month: MonthName
  income: number
  expenses: number
}

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-2)',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function IncomeExpenseHistoryChart() {
  const { data, isFetching } = useQuery<GetYTDSummaryResponse>({
    queryKey: ['overview', 'history'],
    queryFn: ({ signal }) =>
      fetch('/api/stats/ytd-summary', { signal }).then((res) => res.json()),
  })

  const chartData = (data ?? []).map<ChartData>((i, index) => ({
    month: MONTH_NAMES[index],
    income: safeParseNumber(i.income),
    expenses: safeParseNumber(i.expense),
  }))

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Card>
        <CardHeader>
          <CardTitle>Year-to-date Income/Expenses</CardTitle>
          <CardDescription>January - December 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-54 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </SkeletonWrapper>
  )
}
