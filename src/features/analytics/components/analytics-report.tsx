'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfYear } from 'date-fns'
import { useState } from 'react'

import { DateRangePicker } from '~/components/ui/date-range-picker'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { CategoryReportCard } from '~/components/widgets/category-report-card'
import { CategoryTransactionsTable } from '~/components/widgets/category-transactions-table'
import { api } from '~/rpc/client'

interface AnalyticsReportProps {
  title: string
  description?: string
  reportFor: 'income' | 'spending'
}

function AnalyticsReport({
  description,
  title,
  reportFor,
}: AnalyticsReportProps) {
  const [reportRange, setReportRange] = useState({
    from: startOfYear(Date.now()),
    to: endOfToday(),
  })
  const { data, isPending } = useQuery(
    (reportFor === 'income'
      ? api.analytics.getCategoryIncome.queryOptions
      : api.analytics.getCategorySpend.queryOptions)({
      input: {
        from: reportRange.from,
        to: reportRange.to,
        limit: 100,
      },
    }),
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex gap-4">
          <DateRangePicker defaultValue="thisYear" onChange={setReportRange} />
        </div>
      </div>
      <SkeletonWrapper isLoading={isPending}>
        <CategoryReportCard
          data={data ?? []}
          title={title}
          description={description}
          onCategorySelect={setSelectedCategoryId}
        />
      </SkeletonWrapper>
      {selectedCategoryId && (
        <CategoryTransactionsTable
          categoryId={selectedCategoryId}
          from={reportRange.from}
          to={reportRange.to}
        />
      )}
    </div>
  )
}

export { AnalyticsReport }
