import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { redirectUnauthenticated } from '~/features/auth/server'
import { BudgetsSummary } from '~/features/budgets/components/budgets-summary'

import { api } from '~/rpc/server'

async function BudgetsPageImpl() {
  await redirectUnauthenticated()

  const budgets = await api.budgets.summary()
  return <BudgetsSummary budgets={budgets} />
}

export default async function BudgetsPage() {
  return (
    <SuspenseBoundary>
      <BudgetsPageImpl />
    </SuspenseBoundary>
  )
}
