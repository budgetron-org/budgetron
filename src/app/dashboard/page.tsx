import {
  IconBriefcase,
  IconCoin,
  IconPigMoney,
  IconTrendingUp,
} from '@tabler/icons-react'
import { connection } from 'next/server'

import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { MultiCurrencyNotice } from '~/components/widgets/multi-currency-notice'
import { DashboardCashFlowChart } from '~/features/analytics/components/dashboard-cash-flow-chart'
import { DashboardSummaryCard } from '~/features/analytics/components/dashboard-summary-card'
import { requireAuthentication } from '~/features/auth/utils'
import { api } from '~/rpc/server'

async function DashboardPageImpl() {
  await requireAuthentication()
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

        {overviewSummary.convertedCurrencies.length > 0 && (
          <MultiCurrencyNotice
            baseCurrency={overviewSummary.baseCurrency}
            additionalCurrencies={overviewSummary.convertedCurrencies}
            currencyExchangeAttribution={
              overviewSummary.currencyExchangeAttribution
            }
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardSummaryCard
            title="Income"
            icon={<IconBriefcase />}
            baseCurrency={overviewSummary.baseCurrency}
            data={overviewSummary.data.INCOME}
          />
          <DashboardSummaryCard
            title="Expenses"
            icon={<IconCoin />}
            baseCurrency={overviewSummary.baseCurrency}
            data={overviewSummary.data.EXPENSE}
          />
          <DashboardSummaryCard
            title="Savings"
            icon={<IconPigMoney />}
            baseCurrency={overviewSummary.baseCurrency}
            data={overviewSummary.data.SAVINGS}
          />
          <DashboardSummaryCard
            title="Investments"
            icon={<IconTrendingUp />}
            baseCurrency={overviewSummary.baseCurrency}
            data={overviewSummary.data.INVESTMENT}
          />
        </div>
      </div>

      <DashboardCashFlowChart
        title="Cash flow at a glance"
        description={
          <div className="flex flex-col gap-2">
            <span className="flex flex-col">Showing last 6 months</span>
            {cashFlowSummary.convertedCurrencies.length > 0 && (
              <MultiCurrencyNotice
                baseCurrency={cashFlowSummary.baseCurrency}
                additionalCurrencies={cashFlowSummary.convertedCurrencies}
                currencyExchangeAttribution={
                  cashFlowSummary.currencyExchangeAttribution
                }
              />
            )}
          </div>
        }
        xAxisKey="period"
        data={cashFlowSummary.data}
      />
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
