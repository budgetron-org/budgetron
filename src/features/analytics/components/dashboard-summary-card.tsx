import { format } from 'date-fns'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { getCurrencyFormatter } from '~/lib/format'
import type { OverviewSummary } from '../types'

// TODO: Make this configurable
const formatter = getCurrencyFormatter('USD')

interface DashboardSummaryCardProps {
  title: string
  description?: string
  icon?: ReactNode
  data?: OverviewSummary[keyof OverviewSummary]
}

function DashboardSummaryCard({
  title,
  description,
  icon,
  data,
}: DashboardSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 text-xl">
          {title}
          {icon}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-3">
        <div className="grid grid-cols-2 gap-4 p-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              THIS MONTH
            </span>
            <span>{formatter.format(data?.thisMonth ?? 0)}</span>
            <span className="text-muted-foreground text-sm">Total</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              YEAR TO DATE
            </span>
            <span>{formatter.format(data?.ytd ?? 0)}</span>
            <span className="text-muted-foreground text-sm">
              Total ({format(Date.now(), 'yyyy')})
            </span>
          </div>
        </div>

        <div className="bg-accent grid grid-cols-2 gap-4 rounded-lg p-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              6 MONTHS
            </span>
            <span>{formatter.format(data?.sixMonthAvg ?? 0)}</span>
            <span className="text-muted-foreground text-sm">Average</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              LAST MONTH
            </span>
            <span>{formatter.format(data?.lastMonth ?? 0)}</span>
            <span className="text-muted-foreground text-sm">Total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { DashboardSummaryCard }
