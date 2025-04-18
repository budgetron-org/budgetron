import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import type { TransactionWithRelations } from '~/features/transactions/types'
import { getColumns } from '../_components/transaction-table-columns'

type UseTransactionsTableProps<Data> = Pick<
  TableOptions<Data>,
  'data' | 'getRowId' | 'meta'
>
export function useTransactionsTable<Data extends TransactionWithRelations>({
  data,
  getRowId,
  meta,
}: UseTransactionsTableProps<Data>) {
  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])
  // Selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const table = useReactTable({
    data,
    columns: useMemo(() => getColumns<Data>(), []),
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: { pageIndex: 0, pageSize: 50 },
      sorting,
      rowSelection,
    },
    onSortingChange: (args) => {
      setSorting(args)
      table.resetPageIndex()
    },
    onRowSelectionChange: setRowSelection,

    autoResetPageIndex: false,

    meta,
  })

  return { table }
}
