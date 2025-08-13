'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { MultiCurrencyNotice } from '~/components/widgets/multi-currency-notice'
import { api } from '~/rpc/client'
import type { CashFlowReportRange } from '../types'
import { CashFlowChart } from './cash-flow-chart'
import { CashFlowSummaryCard } from './cash-flow-summary-card'

const RANGE_DESCRIPTIONS = {
  this_month: 'This Month',
  last_3_months: 'Last 3 Months',
  last_6_months: 'Last 6 Months',
  ytd: 'Year To Date',
  '1_year': 'Last Year',
  all: 'All Time',
} as const satisfies Record<CashFlowReportRange, string>

function CashFlowReport() {
  const [range, setRange] = useState<CashFlowReportRange>('this_month')
  const { data, isPending } = useQuery(
    api.analytics.getCashFlowReport.queryOptions({ input: { range } }),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Showing report for</h2>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          defaultValue="this_month"
          onValueChange={(value) => setRange(value as CashFlowReportRange)}>
          <ToggleGroupItem className="min-w-max" value="this_month">
            {RANGE_DESCRIPTIONS.this_month}
          </ToggleGroupItem>
          <ToggleGroupItem className="min-w-max" value="last_3_months">
            {RANGE_DESCRIPTIONS.last_3_months}
          </ToggleGroupItem>
          <ToggleGroupItem className="min-w-max" value="ytd">
            {RANGE_DESCRIPTIONS.ytd}
          </ToggleGroupItem>
          <ToggleGroupItem className="min-w-max" value="1_year">
            {RANGE_DESCRIPTIONS['1_year']}
          </ToggleGroupItem>
          <ToggleGroupItem className="min-w-max" value="all">
            {RANGE_DESCRIPTIONS.all}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-4">
        {data && data?.convertedCurrencies.length > 0 && (
          <MultiCurrencyNotice
            baseCurrency={data.baseCurrency}
            additionalCurrencies={data.convertedCurrencies}
            currencyExchangeAttribution={data.currencyExchangeAttribution}
          />
        )}
        <SkeletonWrapper isLoading={isPending}>
          <CashFlowSummaryCard className="w-full" data={data?.summary} />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isPending}>
          <CashFlowChart
            data={data?.data ?? []}
            description={RANGE_DESCRIPTIONS[range]}
          />
        </SkeletonWrapper>
      </div>
    </div>
  )
}

export { CashFlowReport }
