'use client'

import { useQuery } from '@tanstack/react-query'
import { getMonth, getYear } from 'date-fns'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import type { GetAvailableDataRangeResponse } from '~/app/api/cash-flow/data-range-available/route'
import type { GetCashFlowStatsResponse } from '~/app/api/cash-flow/stats/route'
import { SkeletonWrapper } from '~/components/skeleton-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import type { TimeFrame, TimePeriod } from '~/types'
import { HistoryPeriodSelector } from './history-period-selector'

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

export function HistorySection() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>({
    month: getMonth(Date.now()),
    year: getYear(Date.now()),
  })

  const availableDataRange = useQuery<GetAvailableDataRangeResponse>({
    queryKey: ['available-data-range'],
    queryFn: ({ signal }) =>
      fetch('/api/cash-flow/data-range-available', { signal }).then((res) =>
        res.json(),
      ),
  })

  const chartStats = useQuery<GetCashFlowStatsResponse>({
    queryKey: ['cash-flow-stats', timeFrame, timePeriod.month, timePeriod.year],
    queryFn: ({ signal }) =>
      fetch(
        `/api/cash-flow/stats?timeFrame=${timeFrame}&month=${timePeriod.month}&year=${timePeriod.year}`,
        { signal },
      ).then((res) => res.json()),
  })

  const minPeriodSelector = useMemo(
    () =>
      availableDataRange.data ?? {
        month: getMonth(Date.now()),
        year: getYear(Date.now()),
      },
    [availableDataRange.data],
  )

  return (
    <div className="grid max-w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            <SkeletonWrapper isLoading={availableDataRange.isFetching}>
              <HistoryPeriodSelector
                timeFrame={timeFrame}
                onTimeFrameChange={setTimeFrame}
                timePeriod={timePeriod}
                onTimePeriodChange={setTimePeriod}
                min={minPeriodSelector}
              />
            </SkeletonWrapper>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SkeletonWrapper isLoading={chartStats.isFetching}>
            {(chartStats.data?.length ?? 0) > 0 && (
              <ChartContainer
                config={chartConfig}
                className="max-h-[50vh] w-full">
                <BarChart accessibilityLayer data={chartStats.data}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
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
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            )}
            {chartStats.data?.length === 0 && (
              <div className="flex h-[50vh] w-full items-center justify-center">
                No data available
              </div>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  )
}
