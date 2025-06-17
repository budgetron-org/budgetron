import { IconPlus } from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { BudgetSummary } from '../types'
import { BudgetItem } from './budget-item'
import { CreateBudgetDialog } from './create-budget-dialog'

interface BudgetsSummaryProps {
  budgets: BudgetSummary[]
}

function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  if (budgets.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">No budgets found</CardTitle>
            <CardDescription>
              Looks like you don&apos;t have any budgets yet. Start by creating
              a budget.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <CreateBudgetDialog
              trigger={
                <Button variant="success" className="w-full">
                  Create budget
                </Button>
              }
              refreshOnSuccess
            />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-col justify-end gap-2 md:flex-row">
        <CreateBudgetDialog
          trigger={
            <Button variant="success">
              <IconPlus />
              Add
            </Button>
          }
          refreshOnSuccess
        />
      </div>
      <div className="min-h-0 flex-1">
        {budgets.map((budget) => (
          <BudgetItem key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  )
}

export { BudgetsSummary }
