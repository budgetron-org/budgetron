'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import {
  Fragment,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { Button } from '~/components/ui/button'
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import type { CurrencyCode } from '~/data/currencies'
import type { CategoryReportData } from '~/features/analytics/types'
import { formatAmount } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'

type ChartItem = {
  category: string
  total: number
  fill: string
  opacity: number

  item: CategoryReportData
}

function useChartDataAndConfig(
  data: CategoryReportData[],
  selectedCategory: string,
) {
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
        total: safeParseNumber(item.total.baseCurrency),
        fill: `var(--color-${key})`,
        opacity: selectedCategory === '' || selectedCategory === key ? 1 : 0.3,
        item,
      })

      chartConfig[key] = {
        label,
        color,
      }
    })

    return { chartData, chartConfig }
  }, [data, selectedCategory])
}

function useGroupedCategories(data: CategoryReportData[]) {
  return useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; children: { id: string; name: string }[] }
    >()

    for (const category of data) {
      if (!category.parentCategoryId || !category.parentCategoryName) {
        // We should never get the top level categories here
        // if we do get them, we should ignore them
        continue
      }

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

interface CategoryReportCategoryPickerProps {
  chartId: string
  chartConfig: ChartConfig
  data: CategoryReportData[]
  selectedCategory: string
  onCategorySelect?: (category: string | undefined) => void
}

function CategoryReportCategoryPicker({
  chartId,
  chartConfig,
  data,
  selectedCategory,
  onCategorySelect,
}: CategoryReportCategoryPickerProps) {
  const categories = useGroupedCategories(data)
  if (categories.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedCategory}
        onValueChange={(value) => {
          onCategorySelect?.(value)
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
      {selectedCategory && (
        <Button
          className="h-7 rounded-lg"
          variant="outline"
          onClick={() => {
            onCategorySelect?.(undefined)
          }}>
          Clear
        </Button>
      )}
    </div>
  )
}

interface CategoryReportChartProps {
  baseCurrency: CurrencyCode
  chartConfig: ChartConfig
  chartData: ChartItem[]
  chartId: string
  chartTitle: string
  selectedCategory: string
}

function CategoryReportChart({
  baseCurrency,
  chartData,
  chartConfig,
  chartId,
  chartTitle,
  selectedCategory,
}: CategoryReportChartProps) {
  const totalAmount = useMemo(() => {
    return formatAmount(
      chartData.reduce((acc, curr) => acc + curr.total, 0),
      baseCurrency,
    )
  }, [baseCurrency, chartData])
  const activeIndex = useMemo(() => {
    return chartData.findIndex((item) => item.category === selectedCategory)
  }, [selectedCategory, chartData])
  const centerContent = useMemo(() => {
    const item = chartData.find((item) => item.category === selectedCategory)
    if (!item) return { title: chartTitle, value: totalAmount }
    return {
      title:
        chartConfig[selectedCategory as keyof typeof chartConfig]?.label ??
        'Category Total',
      value: formatAmount(item.total, baseCurrency),
    }
  }, [
    baseCurrency,
    chartData,
    chartConfig,
    chartTitle,
    selectedCategory,
    totalAmount,
  ])
  return (
    <ChartContainer
      id={chartId}
      config={chartConfig}
      className="aspect-auto h-[450px] flex-1 md:aspect-square">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              valueFormatter={(value) =>
                formatAmount(value as ChartItem['total'], baseCurrency)
              }
            />
          }
        />

        <Pie
          data={chartData}
          dataKey="total"
          nameKey="category"
          innerRadius="30%"
          outerRadius="65%"
          activeIndex={activeIndex}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
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
                      y={(viewBox.cy ?? 0) - (viewBox.outerRadius ?? 0) - 45}
                      className="fill-foreground invisible text-xl font-semibold md:visible">
                      {centerContent.title}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-sm font-semibold md:text-xl">
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
  )
}

interface CategoryReportChartLegendProps {
  baseCurrency: CurrencyCode
  chartData: ChartItem[]
  chartConfig: ChartConfig
}

function CategoryReportChartLegend({
  baseCurrency,
  chartData,
  chartConfig,
}: CategoryReportChartLegendProps) {
  return (
    <div className="grid auto-rows-min grid-cols-[min-content_minmax(0,1fr)] gap-4">
      {chartData.map((item) => (
        <Fragment key={item.category}>
          <div
            style={{ backgroundColor: item.fill }}
            className="aspect-square size-4 self-center rounded-sm"
          />
          <div className="text-muted-foreground flex justify-between gap-4">
            {chartConfig[item.category]?.label}
            <div className="text-foreground flex shrink items-center gap-2">
              {item.item.total.byCurrency.some(
                (i) => i.currency !== baseCurrency,
              ) && (
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle
                      size={16}
                      className="text-muted-foreground"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <h2 className="font-semibold">Includes</h2>
                    <ul className="list-inside list-disc">
                      {item.item.total.byCurrency.map((entry) => (
                        <li key={entry.currency}>
                          {formatAmount(entry.amount, entry.currency)}
                          {entry.currency !== baseCurrency && (
                            <span className="text-muted-foreground ml-1">
                              (
                              {formatAmount(
                                entry.convertedAmount,
                                baseCurrency,
                              )}
                              )
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              )}
              {formatAmount(item.total, baseCurrency)}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

interface CategoryReportCardProps
  extends ComponentPropsWithoutRef<typeof Card> {
  baseCurrency: CurrencyCode
  chartTitle: string
  data: CategoryReportData[]
  title: string
  description?: string
  onCategorySelect?: (categoryId: string | undefined) => void
}
function CategoryReportCard({
  baseCurrency,
  data,
  chartTitle,
  title,
  description,
  onCategorySelect,
  ...props
}: CategoryReportCardProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const { chartConfig, chartData } = useChartDataAndConfig(
    data,
    selectedCategory,
  )
  const chartId = useId()

  return (
    <Card {...props} data-chart={chartId}>
      <ChartStyle id={chartId} config={chartConfig} />
      <CardHeader className="grid gap-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CategoryReportCategoryPicker
          chartId={chartId}
          chartConfig={chartConfig}
          data={data}
          selectedCategory={selectedCategory}
          onCategorySelect={(value) => {
            onCategorySelect?.(value)
            setSelectedCategory(value ?? '')
          }}
        />
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <CategoryReportChart
              baseCurrency={baseCurrency}
              chartConfig={chartConfig}
              chartData={chartData}
              chartId={chartId}
              chartTitle={chartTitle}
              selectedCategory={selectedCategory}
            />
            <CategoryReportChartLegend
              baseCurrency={baseCurrency}
              chartData={chartData}
              chartConfig={chartConfig}
            />
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
