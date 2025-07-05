import { IconArrowLeft } from '@tabler/icons-react'
import { format, subMonths } from 'date-fns'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { TransactionsTable } from '~/components/widgets/transactions-table'
import { PATHS } from '~/data/routes'
import { redirectUnauthenticated } from '~/features/auth/server'
import { BudgetItemSummary } from '~/features/budgets/components/budget-item-summary'
import { BudgetSpendChart } from '~/features/budgets/components/budget-spend-chart'
import { api } from '~/rpc/server'

async function BudgetPageImpl({ budgetId }: { budgetId: string }) {
  await redirectUnauthenticated()
  const budgetDetails = await api.budgets.details({ id: budgetId })
  const title = budgetDetails.budgetSummary.parentCategoryName
    ? `${budgetDetails.budgetSummary.parentCategoryName} / ${budgetDetails.budgetSummary.categoryName}`
    : budgetDetails.budgetSummary.categoryName

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href={PATHS.BUDGETS}>
          <Button variant="ghost">
            <IconArrowLeft /> Back
          </Button>
        </Link>
        <h1 className="text-2xl">{title}</h1>
      </div>

      <div className="overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <BudgetItemSummary budget={budgetDetails.budgetSummary} extended />
          </div>

          <div className="text-xl font-semibold">
            {format(subMonths(new Date(), 12), 'MMMM yyyy')} -{' '}
            {format(new Date(), 'MMMM yyyy')}
          </div>

          <div className="h-[350px]">
            <BudgetSpendChart
              budget={budgetDetails.budgetSummary}
              data={budgetDetails.monthlyAverages}
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <TransactionsTable
              data={budgetDetails.transactions}
              showFilters
              defaultColumnVisibility={{
                actions: false,
                select: false,
              }}
              hasBulkDeleteAction={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ budgetId: string }>
}) {
  const { budgetId } = await params
  return (
    <SuspenseBoundary>
      <BudgetPageImpl budgetId={budgetId} />
    </SuspenseBoundary>
  )
}
