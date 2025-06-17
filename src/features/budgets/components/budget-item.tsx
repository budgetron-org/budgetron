import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { PATHS } from '~/data/routes'
import type { BudgetSummary } from '../types'
import { BudgetItemOptions } from './budget-item-options'
import { BudgetItemSummary } from './budget-item-summary'

function BudgetItem({ budget }: { budget: BudgetSummary }) {
  const title = budget.parentCategoryName
    ? `${budget.parentCategoryName} / ${budget.categoryName}`
    : budget.categoryName
  return (
    <Card className="w-full md:w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4 md:items-center">
          <div className="flex min-w-0 flex-col items-start gap-2 md:flex-row md:items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-full truncate text-xl">{title}</div>
              </TooltipTrigger>
              <TooltipContent>{title}</TooltipContent>
            </Tooltip>
            <Link href={PATHS.BUDGETS + `/${budget.id}`}>
              <Button variant="outline">
                Show details
                <IconArrowRight />
              </Button>
            </Link>
          </div>
          <BudgetItemOptions budget={budget} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <BudgetItemSummary budget={budget} />
      </CardContent>
    </Card>
  )
}

export { BudgetItem }
