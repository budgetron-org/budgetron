'use client'

import { useCallback, type ComponentProps } from 'react'
import { BarChart } from '~/components/ui/bar-chart'
import { type ChartConfig } from '~/components/ui/chart'
import { getCurrencyFormatter } from '~/lib/format'
import { formatMonthLabel } from '~/lib/utils'
import type { BudgetDetails } from '../types'

const chartConfig = {
  average: {
    label: 'Average',
    color: 'var(--chart-8)',
  },
} satisfies ChartConfig

// TODO: get currency from user settings
const currencyFormatter = getCurrencyFormatter('USD', {
  maximumFractionDigits: 0,
})

interface BudgetSpendChartProps {
  budget: BudgetDetails['budgetSummary']
  data: BudgetDetails['monthlyAverages']
}

function BudgetSpendChart({ budget, data }: BudgetSpendChartProps) {
  const xAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['xAxisFormatter']>
  >((value) => formatMonthLabel(String(value)), [])
  const yAxisFormatter = useCallback<
    NonNullable<ComponentProps<typeof BarChart<typeof data>>['yAxisFormatter']>
  >(
    (value) =>
      currencyFormatter.format(
        value as BudgetDetails['monthlyAverages'][number]['average'],
      ),
    [],
  )

  return (
    <BarChart
      config={chartConfig}
      data={data}
      xAxisKey="month"
      xAxisFormatter={xAxisFormatter}
      yAxisFormatter={yAxisFormatter}
      yReferenceLineValue={budget.amountFloat}
      barKeys={['average']}
    />
  )
}

export { BudgetSpendChart }
