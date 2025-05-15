import { endOfToday, subMonths } from 'date-fns'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { Skeleton } from '~/components/ui/skeleton'
import { SummaryCard } from '~/components/widgets/summary-card'
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
    <div className="grid h-full grid-cols-[minmax(30vw,max-content)_minmax(0,1fr)] gap-2">
      <div className="row-span-full h-full">
        <BankAccountsCard className="h-full" />
      </div>

      <div className="col-span-1 grid h-full auto-rows-min grid-cols-1 gap-2 overflow-y-auto">
        <SummaryCard
          title="Income"
          description="Last 6 months"
          type="income"
          data={monthlySummary}
        />
        <SummaryCard
          title="Spending"
          description="Last 6 months"
          type="spending"
          data={monthlySummary}
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-full grid-cols-2 grid-rows-3 gap-4">
          <Skeleton className="row-span-full h-full" />
          <Skeleton className="h-auto" />
          <Skeleton className="h-auto" />
          <Skeleton className="h-auto" />
        </div>
      }>
      <DashboardPageImpl />
    </Suspense>
  )
}
