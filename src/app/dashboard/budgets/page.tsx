import { IconPlus } from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { requireAuthentication } from '~/features/auth/utils'
import { BudgetItem } from '~/features/budgets/components/budget-item'
import { CreateBudgetDialog } from '~/features/budgets/components/create-budget-dialog'
import { api } from '~/rpc/server'

async function BudgetsPageImpl() {
  await requireAuthentication()
  const budgets = await api.budgets.summary()

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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-4">
          {budgets.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function BudgetsPage() {
  return (
    <SuspenseBoundary>
      <BudgetsPageImpl />
    </SuspenseBoundary>
  )
}
