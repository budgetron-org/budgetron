'use client'

import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'

interface BarChartProps<Data extends object> {
  config: ChartConfig
  data: Data[]
  xAxisKey: keyof Data
  barKeys: (keyof Data)[]
  xAxisFormatter?: (value: unknown) => string
  yAxisFormatter?: (value: unknown) => string
}

function BarChart<Data extends object>({
  config,
  data,
  xAxisKey,
  barKeys,
  xAxisFormatter,
  yAxisFormatter,
}: BarChartProps<Data>) {
  if (data.length === 0)
    return (
      <div className="flex aspect-auto h-full items-center justify-center">
        No data available
      </div>
    )

  return (
    <ChartContainer config={config} className="aspect-auto h-full">
      <RechartsBarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={String(xAxisKey)}
          tickFormatter={xAxisFormatter}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickFormatter={yAxisFormatter}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dashed"
              labelFormatter={xAxisFormatter}
              valueFormatter={yAxisFormatter}
            />
          }
        />
        {barKeys.map((key) => (
          <Bar
            key={String(key)}
            dataKey={String(key)}
            fill={`var(--color-${String(key)})`}
            radius={4}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}

export { BarChart }
