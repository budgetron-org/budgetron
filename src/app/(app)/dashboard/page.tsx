import { endOfMonth, endOfToday, startOfMonth, subMonths } from 'date-fns'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { Skeleton } from '~/components/ui/skeleton'
import { redirectUnauthenticated } from '~/features/auth/server'
import { BankAccountsCard } from '~/features/bank-accounts/components/bank-accounts-card'
import { CategorySpendCard } from '~/features/dashboard/components/category-spend-card'
import { SummaryCard } from '~/features/dashboard/components/summary-card'
import { api } from '~/rpc/server'

async function DashboardPageImpl() {
  await redirectUnauthenticated()
  await connection()

  const today = endOfToday()
  const [monthlySummary, categorySpend] = await Promise.all([
    api.transactions.getMonthlySummary({
      from: subMonths(today, 6),
      to: today,
    }),
    api.transactions.getCategorySpend({
      from: startOfMonth(today),
      to: endOfMonth(today),
      limit: 5,
    }),
  ])

  return (
    <div className="grid h-full grid-cols-2 gap-2 lg:grid-cols-3">
      <div className="row-span-full h-full">
        <BankAccountsCard className="h-full" />
      </div>

      <div className="col-span-1 grid h-full auto-rows-min grid-cols-1 gap-2 overflow-y-auto lg:col-span-2 lg:grid-cols-2">
        <CategorySpendCard
          title="Top Spending Categories"
          description="This Month"
          data={categorySpend}
        />
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
