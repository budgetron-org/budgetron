'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfYear } from 'date-fns'
import { useState } from 'react'

import { DateRangePicker } from '~/components/ui/date-range-picker'
import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import { api } from '~/rpc/client'
import { CategoryReportCard } from './category-report-card'
import { CategoryTransactionsTable } from './category-transactions-table'
import { format } from 'date-fns'

interface CategoriesReportProps {
  reportFor: 'income' | 'spending'
}

function CategoriesReport({ reportFor }: CategoriesReportProps) {
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
          <DateRangePicker
            className="w-full md:w-[250px]"
            defaultValue="thisYear"
            onChange={setReportRange}
          />
        </div>
      </div>
      <SkeletonWrapper isLoading={isPending}>
        <CategoryReportCard
          data={data ?? []}
          chartTitle={
            reportFor === 'income' ? 'Total Income' : 'Total Spending'
          }
          title={
            reportFor === 'income'
              ? 'Income by Category'
              : 'Spending by Category'
          }
          description={`Showing report for ${reportFor} from ${format(reportRange.from, 'MMMM d, yyyy')} to ${format(reportRange.to, 'MMMM d, yyyy')}`}
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

export { CategoriesReport }
