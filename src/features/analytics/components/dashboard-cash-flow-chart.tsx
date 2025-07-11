'use client'

import {
  useCallback,
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

// TODO: get currency from user settings
const currencyFormatter = getCurrencyFormatter('USD', {
  maximumFractionDigits: 0,
})

interface DashboardCashFlowChartProps<
  Data extends { income: number; expenses: number },
> extends ComponentPropsWithoutRef<typeof Card> {
  data: Data[]
  title: string
  description: string
  xAxisKey: keyof Data
  yAxisKey: keyof Data
}

function DashboardCashFlowChart<
  Data extends { income: number; expenses: number },
>({
  data,
  title,
  description,
  xAxisKey,
  yAxisKey,
  ...props
}: DashboardCashFlowChartProps<Data>) {
  const yAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['yAxisFormatter']>
  >(
    (value) =>
      currencyFormatter.format(value as Data['expenses'] | Data['income']),
    [],
  )

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="h-[50vh]">
        <BarChart
          config={chartConfig}
          data={data}
          xAxisKey={xAxisKey}
          barKeys={[yAxisKey]}
          yAxisFormatter={yAxisFormatter}
        />
      </CardContent>
    </Card>
  )
}

export { DashboardCashFlowChart }
