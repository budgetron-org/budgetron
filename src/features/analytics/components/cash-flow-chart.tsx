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
import type { CashFlowReportData } from '~/features/analytics/types'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'

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

interface CashFlowChartProps extends ComponentPropsWithoutRef<typeof Card> {
  data: CashFlowReportData[]
  description: string
}

function CashFlowChart({ data, description, ...props }: CashFlowChartProps) {
  const yAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['yAxisFormatter']>
  >((value) => currencyFormatter.format(safeParseNumber(value)), [])

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <BarChart
          config={chartConfig}
          data={data}
          xAxisKey="period"
          barKeys={['income', 'expenses']}
          yAxisFormatter={yAxisFormatter}
        />
      </CardContent>
    </Card>
  )
}

export { CashFlowChart }
