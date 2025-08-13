import { format } from 'date-fns'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { CurrencyCode } from '~/data/currencies'
import { formatAmount } from '~/lib/format'
import type { OverviewSummaryData } from '../types'

interface DashboardSummaryCardProps {
  title: string
  description?: string
  icon?: ReactNode
  baseCurrency: CurrencyCode
  data: OverviewSummaryData[keyof OverviewSummaryData]
}

function DashboardSummaryCard({
  title,
  description,
  icon,
  baseCurrency,
  data,
}: DashboardSummaryCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 text-xl">
          {title}
          {icon}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-3">
        <div className="grid flex-1 grid-cols-2 gap-4 p-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              THIS MONTH
            </span>

            <span>
              {formatAmount(data.thisMonth.baseCurrency, baseCurrency)}
            </span>
            <span className="text-muted-foreground text-sm">Total</span>

            {data.thisMonth.byCurrency.some(
              (i) => i.currency !== baseCurrency,
            ) && (
              <div className="text-muted-foreground flex flex-col py-2 text-sm">
                <span>Includes</span>
                {data.thisMonth.byCurrency.map((item) => (
                  <span key={item.currency}>
                    {formatAmount(item.amount, item.currency)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              YEAR TO DATE
            </span>
            <span>{formatAmount(data.ytd.baseCurrency, baseCurrency)}</span>
            <span className="text-muted-foreground text-sm">
              Total ({format(Date.now(), 'yyyy')})
            </span>

            {data.ytd.byCurrency.some((i) => i.currency !== baseCurrency) && (
              <div className="text-muted-foreground flex flex-col py-2 text-sm">
                <span>Includes</span>
                {data.ytd.byCurrency.map((item) => (
                  <span key={item.currency}>
                    <span>{formatAmount(item.amount, item.currency)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-accent grid flex-1 grid-cols-2 gap-4 rounded-lg p-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              6 MONTHS
            </span>
            <span>
              {formatAmount(data.sixMonthAvg.baseCurrency, baseCurrency)}
            </span>
            <span className="text-muted-foreground text-sm">Average</span>

            {data.sixMonthAvg.byCurrency.some(
              (i) => i.currency !== baseCurrency,
            ) && (
              <div className="text-muted-foreground flex flex-col py-2 text-sm">
                <span>Includes</span>
                {data.sixMonthAvg.byCurrency.map((item) => (
                  <span key={item.currency}>
                    <span>{formatAmount(item.amount, item.currency)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              LAST MONTH
            </span>
            <span>
              {formatAmount(data.lastMonth.baseCurrency, baseCurrency)}
            </span>
            <span className="text-muted-foreground text-sm">Total</span>

            {data.lastMonth.byCurrency.some(
              (i) => i.currency !== baseCurrency,
            ) && (
              <div className="text-muted-foreground flex flex-col py-2 text-sm">
                <span>Includes</span>
                {data.lastMonth.byCurrency.map((item) => (
                  <span key={item.currency}>
                    <span>{formatAmount(item.amount, item.currency)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { DashboardSummaryCard }
