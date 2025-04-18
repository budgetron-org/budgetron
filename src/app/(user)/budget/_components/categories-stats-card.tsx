'use client'

import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { chartColors } from '~/lib/colors'
import { cn } from '~/lib/utils'
import { CategoryIcon } from './category-icon'

type CategoriesStatsCardProps = {
  title: string
  data: { categoryId: string; name: string; icon: string; amount: number }[]
  budget?: Record<string, number>
  currencyFormatter: Intl.NumberFormat
  percentageFormatter: Intl.NumberFormat
  type: 'income' | 'spending'
}

export function CategoriesStatsCard({
  title,
  data,
  budget,
  currencyFormatter,
  percentageFormatter,
  type,
}: CategoriesStatsCardProps) {
  const total = useMemo(
    () => data.reduce((sum, item) => item.amount + sum, 0),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="@container grid gap-4">
          {data.length === 0 ? (
            <div>No data available</div>
          ) : (
            data.map(({ amount, categoryId, icon, name }, index) => {
              const percent = total !== 0 ? amount / total : 0
              const categoryBudget = budget?.[categoryId]
              const percentBudget = (amount / (categoryBudget ?? amount)) * 100
              return (
                <div key={categoryId} className="flex items-center gap-2">
                  <div className="flex h-full items-center gap-2">
                    <div
                      className={cn(
                        'min-h-full w-1',
                        chartColors[index].bgColor,
                      )}
                    />
                    <CategoryIcon
                      icon={icon}
                      className={chartColors[index].bgColor}
                    />
                  </div>

                  {/* Content for md container and below */}
                  <div className="grid flex-1 items-center gap-0.5 @lg:hidden">
                    <span className="leading-tight">{name}</span>

                    {categoryBudget !== undefined && (
                      <>
                        <span className="flex justify-between text-xs">
                          <span>
                            {currencyFormatter.format(amount)} of{' '}
                            {currencyFormatter.format(categoryBudget)}{' '}
                          </span>
                          <span className="text-muted-foreground">
                            ({percentageFormatter.format(percent)})
                          </span>
                        </span>
                        <Progress
                          indicatorClassName={cn(
                            amount > categoryBudget && 'bg-destructive',
                          )}
                          aria-valuenow={percentBudget}
                          value={Math.min(percentBudget, 100)}
                        />
                      </>
                    )}
                    {categoryBudget === undefined && (
                      <>
                        <span className="text-xs">
                          {currencyFormatter.format(amount)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {percentageFormatter.format(percent)} of total {type}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Content for lg container and above */}
                  <div className="hidden flex-1 grid-cols-2 items-center gap-2 @lg:grid">
                    <div className="flex h-full items-center justify-between">
                      <span>{name}</span>
                      {categoryBudget && amount > categoryBudget && (
                        <span className="text-destructive grid justify-items-end whitespace-nowrap">
                          {currencyFormatter.format(amount - categoryBudget)}{' '}
                          OVER
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1">
                      {categoryBudget !== undefined && (
                        <>
                          <span className="flex justify-between">
                            <span>
                              {currencyFormatter.format(amount)} of{' '}
                              {currencyFormatter.format(categoryBudget)}{' '}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              ({percentageFormatter.format(percent)})
                            </span>
                          </span>
                          <Progress
                            indicatorClassName={cn(
                              amount > categoryBudget && 'bg-destructive',
                            )}
                            aria-valuenow={percentBudget}
                            value={Math.min(percentBudget, 100)}
                          />
                        </>
                      )}

                      {categoryBudget === undefined && (
                        <>
                          <span>{currencyFormatter.format(amount)}</span>
                          <span className="text-muted-foreground text-sm">
                            {percentageFormatter.format(percent)} of total{' '}
                            {type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
