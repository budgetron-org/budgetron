'use client'

import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { ChartContainer, type ChartConfig } from '~/components/ui/chart'
import { safeParseLucideIcon, safeParseNumber } from '~/lib/utils'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useCallback, useMemo, useState, type ComponentProps } from 'react'

type Data = Record<string, unknown>

type CategoriesStatsChartProps<D extends Data> = {
  amountKey: keyof D
  config: ChartConfig
  currencyFormatter: Intl.NumberFormat
  data: D[]
  iconKey: keyof D
  nameKey: keyof D
  percentageFormatter: Intl.NumberFormat
  totalTitle: string
}

export function CategoriesStatsChart<D extends Data>({
  amountKey,
  config,
  currencyFormatter,
  data,
  iconKey,
  nameKey,
  percentageFormatter,
  totalTitle,
}: CategoriesStatsChartProps<D>) {
  const [activeIndex, setActiveIndex] = useState<number>()
  const totalAmount = useMemo(() => {
    return data.reduce((acc, item) => safeParseNumber(item[amountKey]) + acc, 0)
  }, [amountKey, data])

  const onMouseEnterSegment = useCallback<
    NonNullable<ComponentProps<typeof Pie>['onMouseEnter']>
  >((_, index) => {
    setActiveIndex(index)
  }, [])
  const onMouseLeaveSegment = useCallback<
    NonNullable<ComponentProps<typeof Pie>['onMouseLeave']>
  >(() => {
    setActiveIndex(undefined)
  }, [])

  const renderActiveShape = useCallback(
    ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
      <g>
        <Sector {...props} outerRadius={outerRadius + 10} />
        <Sector
          {...props}
          outerRadius={outerRadius + 25}
          innerRadius={outerRadius + 12}
        />
      </g>
    ),
    [],
  )

  if (data.length === 0) {
    return (
      <div className="mx-auto flex w-full items-center justify-center">
        No data available
      </div>
    )
  }

  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square w-full max-w-[500px]">
      <PieChart>
        <Pie
          data={data}
          dataKey={amountKey as string}
          nameKey={nameKey as string}
          cx="50%"
          cy="50%"
          innerRadius={120}
          strokeWidth={5}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onMouseEnterSegment}
          onMouseLeave={onMouseLeaveSegment}>
          <Label
            className="text-muted-foreground text-xl"
            position="center"
            fill="currentColor"
            content={({ viewBox }) => {
              if (viewBox == null || !('cx' in viewBox) || !('cy' in viewBox)) {
                return null
              }

              const { cx = 0, cy = 0 } = viewBox

              if (activeIndex != null) {
                const categoryData = data[activeIndex]
                const name = categoryData[nameKey] as string
                const amount = safeParseNumber(categoryData[amountKey])
                const icon = safeParseLucideIcon(
                  categoryData[iconKey] as string,
                )

                return (
                  <>
                    {icon && (
                      <>
                        <circle
                          cx={cx}
                          cy={cy - 45}
                          r={25}
                          fill={categoryData['fill'] as string}></circle>
                        <DynamicIcon
                          name={icon}
                          size={30}
                          x={cx - 15}
                          y={cy - 60}
                          color="white"
                        />
                      </>
                    )}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle">
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-foreground text-2xl font-semibold">
                        {name}
                      </tspan>

                      <tspan
                        x={cx}
                        y={cy + 30}
                        className="fill-muted-foreground text-sm">
                        {currencyFormatter.format(amount)}
                      </tspan>

                      <tspan
                        x={cx}
                        y={cy + 50}
                        className="fill-muted-foreground text-sm">
                        {percentageFormatter.format(amount / totalAmount)} of{' '}
                        {totalTitle.toLowerCase()}
                      </tspan>
                    </text>
                  </>
                )
              }

              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle">
                  <tspan
                    x={cx}
                    y={cy - 15}
                    className="fill-muted-foreground text-lg">
                    {totalTitle}
                  </tspan>

                  <tspan
                    x={cx}
                    y={cy + 15}
                    className="fill-foreground text-3xl font-bold">
                    {currencyFormatter.format(totalAmount)}
                  </tspan>
                </text>
              )
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
