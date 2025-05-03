'use client'

import { useMemo, type ComponentPropsWithoutRef } from 'react'
import { Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'
import type { CategorySpend } from '~/features/transactions/types'

type ChartItem = { category: string; total: number; fill: string }

function useChartDataAndConfig(data: CategorySpend[]) {
  return useMemo(() => {
    const chartData: ChartItem[] = []
    const chartConfig: ChartConfig = {}

    data.forEach((item, index) => {
      const key = item.categoryId
      const label =
        item.parentCategoryName && item.categoryName
          ? `${item.parentCategoryName} / ${item.categoryName}`
          : item.categoryName
      const color = `var(--chart-${index})`

      chartData.push({
        category: key,
        total: item.total,
        fill: `var(--color-${key})`,
      })

      chartConfig[key] = {
        label,
        color,
      }
    })

    return { chartData, chartConfig }
  }, [data])
}

type CategorySpendCardProps = ComponentPropsWithoutRef<typeof Card> & {
  data: CategorySpend[]
  title: string
  description: string
}
function CategorySpendCard({
  data,
  title,
  description,
  ...props
}: CategorySpendCardProps) {
  const { chartConfig, chartData } = useChartDataAndConfig(data)
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={40}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="browser" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
        {chartData.length === 0 && (
          <div className="flex h-[50vh] w-full items-center justify-center">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { CategorySpendCard }
