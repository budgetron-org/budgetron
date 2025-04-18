'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfMonth } from 'date-fns'
import { useMemo, useState } from 'react'

import type { GetTransactionsResponse } from '~/app/api/transactions/route'
import {
  DateRangePicker,
  type DateRangeRequired,
} from '~/components/ui/date-range-picker'
import { toUTCString } from '~/lib/utils'
import { useTransactionsTable } from '../_hooks/use-transactions-table'
import { TransactionsTable } from './transactions-table'

export function TransactionsSection() {
  // Date range
  const defaultRange = useMemo<DateRangeRequired>(
    () => ({ from: startOfMonth(Date.now()), to: endOfToday() }),
    [],
  )
  const [range, setRange] = useState(defaultRange)

  const { data, isFetching } = useQuery<GetTransactionsResponse>({
    initialData: [],
    queryKey: ['transactions', range.from, range.to],
    queryFn: ({ signal }) =>
      fetch(
        `/api/transactions?from=${toUTCString(range.from)}&to=${toUTCString(range.to)}`,
        { signal },
      ).then((res) => res.json()),
  })

  // For table
  const { table } = useTransactionsTable({
    data,
  })

  return (
    <div className="grid w-full gap-4">
      <DateRangePicker
        className="place-self-end"
        defaultValue={defaultRange}
        onUpdate={setRange}
      />
      <TransactionsTable table={table} isLoading={isFetching} />
    </div>
  )
}
