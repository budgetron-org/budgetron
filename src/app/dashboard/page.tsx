import {
  IconBriefcase,
  IconCoin,
  IconPigMoney,
  IconTrendingUp,
} from '@tabler/icons-react'
import { connection } from 'next/server'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { DashboardCashFlowChart } from '~/features/analytics/components/dashboard-cash-flow-chart'
import { DashboardSummaryCard } from '~/features/analytics/components/dashboard-summary-card'
import { redirectUnauthenticated } from '~/features/auth/server'
import { api } from '~/rpc/server'

async function DashboardPageImplNew() {
  await redirectUnauthenticated()
  await connection()

  const { cashFlowSummary, overviewSummary } =
    await api.analytics.getDashboardSummary()

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">
          Summary
          <p className="text-muted-foreground text-sm">
            Financial health at a glance
          </p>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title="Income"
            icon={<IconBriefcase />}
            data={overviewSummary.INCOME}
          />
          <DashboardSummaryCard
            title="Expenses"
            icon={<IconCoin />}
            data={overviewSummary.EXPENSE}
          />
          <DashboardSummaryCard
            title="Savings"
            icon={<IconPigMoney />}
            data={overviewSummary.SAVINGS}
          />
          <DashboardSummaryCard
            title="Investments"
            icon={<IconTrendingUp />}
            data={overviewSummary.INVESTMENT}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">
          Reports
          <p className="text-muted-foreground text-sm">Cash flow at a glance</p>
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardCashFlowChart
            title="Income"
            description="Last 6 months"
            xAxisKey="period"
            yAxisKey="income"
            data={cashFlowSummary.data}
          />
          <DashboardCashFlowChart
            title="Expenses"
            description="Last 6 months"
            xAxisKey="period"
            yAxisKey="expenses"
            data={cashFlowSummary.data}
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <SuspenseBoundary>
      <DashboardPageImplNew />
    </SuspenseBoundary>
  )
}
