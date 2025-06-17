import { endOfToday, subMonths } from 'date-fns'
import { connection } from 'next/server'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { SummaryCard } from '~/features/analytics/components/summary-card'
import { redirectUnauthenticated } from '~/features/auth/server'
import { BankAccountsCard } from '~/features/bank-accounts/components/bank-accounts-card'
import { api } from '~/rpc/server'

async function DashboardPageImpl() {
  await redirectUnauthenticated()
  await connection()

  const today = endOfToday()
  const [monthlySummary] = await Promise.all([
    api.analytics.getMonthlySummary({
      from: subMonths(today, 6),
      to: today,
    }),
  ])

  return (
    <div className="grid h-full grid-cols-1 gap-2 overflow-y-auto md:grid-cols-[minmax(30vw,max-content)_minmax(0,1fr)]">
      <div className="h-full md:row-span-full">
        <BankAccountsCard className="h-full" />
      </div>

      <div className="col-span-1 grid h-full auto-rows-min grid-cols-1 gap-2 md:overflow-y-auto">
        <SummaryCard
          title="Income"
          description="Last 6 months"
          type="income"
          data={monthlySummary}
        />
        <SummaryCard
          title="Expenses"
          description="Last 6 months"
          type="expense"
          data={monthlySummary}
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <SuspenseBoundary>
      <DashboardPageImpl />
    </SuspenseBoundary>
  )
}
