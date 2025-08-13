import { getYear } from 'date-fns'

import { getCurrencyFormatter } from '~/lib/format'
import type { BudgetSummary } from '../types'
import { cn } from '~/lib/utils'

// TODO: Get currency from user settings
const formatter = getCurrencyFormatter('USD')

interface BudgetItemSummaryProps {
  budget: BudgetSummary
  extended?: boolean
}

function BudgetItemSummary({ budget, extended }: BudgetItemSummaryProps) {
  return (
    <div className="flex flex-col gap-4 px-2 py-2">
      <div
        className={cn(
          'grid gap-2 px-4',
          extended ? 'grid-cols-4' : 'grid-cols-2',
        )}>
        {extended && (
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              1 YEAR
            </span>
            <span>{formatter.format(budget.oneYearAverage)}</span>
            <span className="text-muted-foreground text-sm">
              Monthly Average
            </span>
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold">
            3 MONTH
          </span>
          <span>{formatter.format(budget.last3MonthAverage)}</span>
          <span className="text-muted-foreground text-sm">Monthly Average</span>
        </div>

        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold">
            YEAR TO DATE
          </span>
          <span>{formatter.format(budget.ytdSpend)}</span>
          <span className="text-muted-foreground text-sm">
            {getYear(new Date())} Total Spend
          </span>
        </div>

        {extended && (
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-semibold">
              LAST MONTH
            </span>
            <span>{formatter.format(budget.lastMonthSpend)}</span>
            <span className="text-muted-foreground text-sm">
              Last Month Total Spend
            </span>
          </div>
        )}
      </div>

      <div className="bg-accent grid rounded-lg px-4 py-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold">
            THIS MONTH
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <span>{formatter.format(budget.thisMonthSpend)}</span>
              <span className="text-muted-foreground text-sm">
                Spent so far
              </span>
            </div>

            <div className="flex flex-col">
              <span>{formatter.format(budget.projectedSpend)}</span>
              <span className="text-muted-foreground text-sm">
                Projected Spend
              </span>
            </div>

            <div className="flex flex-col">
              <span>{formatter.format(budget.amount)}</span>
              <span className="text-muted-foreground text-sm">
                Budgeted Amount
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BudgetItemSummary }
