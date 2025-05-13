'use client'

import { SelectLabel } from '@radix-ui/react-select'
import {
  Fragment,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { CategoryReport } from '~/features/analytics/types'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'

type ChartItem = { category: string; total: number; fill: string }

function useChartDataAndConfig(data: CategoryReport[]) {
  return useMemo(() => {
    const chartData: ChartItem[] = []
    const chartConfig: ChartConfig = {
      total: {
        label: 'Total',
      },
    }

    data.forEach((item, index) => {
      const key = item.categoryId
      const label =
        item.parentCategoryName && item.categoryName
          ? `${item.parentCategoryName} / ${item.categoryName}`
          : item.categoryName
      const color = `var(--chart-${index + 1})`

      chartData.push({
        category: key,
        total: safeParseNumber(item.total),
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

function useGroupedCategories(data: CategoryReport[]) {
  return useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; children: { id: string; name: string }[] }
    >()

    for (const category of data) {
      if (!map.has(category.parentCategoryId)) {
        map.set(category.parentCategoryId, {
          id: category.parentCategoryId,
          name: category.parentCategoryName,
          children: [],
        })
      }

      map.get(category.parentCategoryId)!.children.push({
        id: category.categoryId,
        name: category.categoryName,
      })
    }

    return Array.from(map.values())
  }, [data])
}

type CategoryReportCardProps = ComponentPropsWithoutRef<typeof Card> & {
  data: CategoryReport[]
  title: string
  description?: string
  onCategorySelect?: (categoryId: string) => void
}
function CategoryReportCard({
  data,
  title,
  description,
  onCategorySelect,
  ...props
}: CategoryReportCardProps) {
  const { chartConfig, chartData } = useChartDataAndConfig(data)
  const chartId = useId()
  const categories = useGroupedCategories(data)

  const formatter = useMemo(() => getCurrencyFormatter('USD'), [])
  const totalAmount = useMemo(() => {
    return formatter.format(
      chartData.reduce((acc, curr) => acc + curr.total, 0),
    )
  }, [chartData, formatter])

  const [selectedCategory, setSelectedCategory] = useState<string>()
  const activeIndex = useMemo(() => {
    return chartData.findIndex((item) => item.category === selectedCategory)
  }, [selectedCategory, chartData])
  const centerContent = useMemo(() => {
    const item = chartData.find((item) => item.category === selectedCategory)
    if (!item) return { title: 'Total Spending', value: totalAmount }
    return {
      title:
        chartConfig[selectedCategory as keyof typeof chartConfig]?.label ??
        'Category Total',
      value: formatter.format(item.total),
    }
  }, [chartData, chartConfig, formatter, selectedCategory, totalAmount])

  return (
    <Card {...props} data-chart={chartId}>
      <ChartStyle id={chartId} config={chartConfig} />
      <CardHeader className="grid gap-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {categories.length > 0 && (
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              onCategorySelect?.(value)
              setSelectedCategory(value)
            }}>
            <SelectTrigger
              className="h-7 w-[150px] rounded-lg pl-2.5"
              aria-label="Select category to filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent align="end" className="p-4" data-chart={chartId}>
              <ChartStyle id={chartId} config={chartConfig} />
              {categories.map((category) => (
                <SelectGroup key={category.id}>
                  <SelectLabel>{category.name}</SelectLabel>
                  {category.children.map((subcategory) => {
                    const config =
                      chartConfig[subcategory.id as keyof typeof chartConfig]
                    if (!config) {
                      return null
                    }
                    return (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="flex h-3 w-3 shrink-0 rounded-sm"
                            style={{
                              backgroundColor: `var(--color-${subcategory.id})`,
                            }}
                          />
                          {subcategory.name}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <div className="flex flex-col md:flex-row">
            <ChartContainer
              id={chartId}
              config={chartConfig}
              className="flex-1">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      valueFormatter={(value) =>
                        formatter.format(safeParseNumber(value))
                      }
                    />
                  }
                />

                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={150}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) - 170}
                              className="fill-foreground text-xl font-semibold">
                              {centerContent.title}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-semibold">
                              {centerContent.value}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid auto-rows-min grid-cols-[min-content_minmax(0,1fr)] gap-4">
              {chartData.map((item, index) => (
                <Fragment key={item.category}>
                  <div
                    className={`bg-(--chart-${index + 1}) aspect-square size-6 rounded-md`}
                  />
                  <div className="text-muted-foreground flex justify-between gap-2">
                    {chartConfig[item.category]?.label}
                    <span className="text-foreground shrink">
                      {formatter.format(item.total)}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
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

export { CategoryReportCard }
