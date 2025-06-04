'use client'

import { useMemo, type ComponentPropsWithoutRef } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import type { CashFlowReport } from '~/features/analytics/types'
import { getCurrencyFormatter } from '~/lib/format'

interface CashFlowSummaryCardProps
  extends ComponentPropsWithoutRef<typeof Card> {
  data?: CashFlowReport['summary']
}

function CashFlowSummaryCard({ data, ...props }: CashFlowSummaryCardProps) {
  const currencyFormatter = useMemo(() => getCurrencyFormatter('USD'), [])

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cash Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-md mb-2 font-semibold">Total</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Total Income
            </div>
            <div className="text-success text-lg font-bold">
              {data?.income ? currencyFormatter.format(data.income) : '-'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Total Expenses
            </div>
            <div className="text-destructive text-lg font-bold">
              {data?.expense ? currencyFormatter.format(data.expense) : '-'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Total Transfers
            </div>
            <div className="text-lg font-bold">
              {data?.transfer ? currencyFormatter.format(data.transfer) : '-'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Surplus
            </div>
            <div
              className={`text-lg font-bold ${
                (data?.surplus ?? 0) >= 0 ? 'text-success' : 'text-destructive'
              }`}>
              {data?.surplus ? currencyFormatter.format(data.surplus) : '-'}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <h3 className="text-md mb-2 font-semibold">Monthly Averages</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Income
            </div>
            <div className="text-success text-lg font-bold">
              {data?.monthlyAverageIncome
                ? currencyFormatter.format(data.monthlyAverageIncome)
                : '-'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Expenses
            </div>
            <div className="text-destructive text-lg font-bold">
              {data?.monthlyAverageExpense
                ? currencyFormatter.format(data.monthlyAverageExpense)
                : '-'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-sm font-medium">
              Surplus
            </div>
            <div
              className={`text-lg font-bold ${
                (data?.monthlyAverageSurplus ?? 0) >= 0
                  ? 'text-success'
                  : 'text-destructive'
              }`}>
              {data?.monthlyAverageSurplus
                ? currencyFormatter.format(data.monthlyAverageSurplus)
                : '-'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { CashFlowSummaryCard }
