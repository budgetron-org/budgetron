'use client'

import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ReferenceLine,
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
  xAxisValueFormatter?: (value: unknown) => string
  yAxisFormatter?: (value: unknown) => string
  yAxisValueFormatter?: (value: unknown) => string
  xReferenceLineValue?: number | string
  yReferenceLineValue?: number | string
}

function BarChart<Data extends object>({
  config,
  data,
  xAxisKey,
  barKeys,
  xAxisFormatter,
  xAxisValueFormatter,
  yAxisFormatter,
  yAxisValueFormatter,
  xReferenceLineValue,
  yReferenceLineValue,
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
              labelFormatter={xAxisValueFormatter ?? xAxisFormatter}
              valueFormatter={yAxisValueFormatter ?? yAxisFormatter}
            />
          }
        />
        {xReferenceLineValue && (
          <ReferenceLine
            x={xReferenceLineValue}
            stroke="red"
            label={{
              value: xReferenceLineValue,
              formatter: xAxisValueFormatter ?? xAxisFormatter,
            }}
            ifOverflow="extendDomain"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
        )}
        {yReferenceLineValue && (
          <ReferenceLine
            y={yReferenceLineValue}
            // extendDomain not working in React 19
            // Workaround: set yAxisId to 0
            // See: https://github.com/recharts/recharts/issues/5500
            yAxisId={0}
            stroke="red"
            label={{
              value: yReferenceLineValue,
              formatter: yAxisFormatter,
              position: 'insideTopLeft',
            }}
            ifOverflow="extendDomain"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />
        )}
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
