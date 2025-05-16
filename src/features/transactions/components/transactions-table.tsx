'use client'

import type { TableMeta } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { DataTable } from '~/components/table'
import { getCurrencyFormatter } from '~/lib/format'
import type { TransactionWithRelations } from '../types'
import { type ColumnId, getColumns } from './transactions-table-columns'

interface TransactionsTableProps {
  className?: string
  data?: TransactionWithRelations[]
  defaultColumnVisibility?: Partial<Record<ColumnId, boolean>>
  defaultEditable?: TableMeta<TransactionWithRelations>['editable']
  hasEditAction?: boolean
  hasDeleteAction?: boolean
  isLoading?: boolean
  onDataUpdate?: (data: TransactionWithRelations[]) => void
}

function TransactionsTable({
  className,
  data = [],
  defaultColumnVisibility,
  hasEditAction = true,
  hasDeleteAction = true,
  defaultEditable,
  isLoading,
  onDataUpdate,
}: TransactionsTableProps) {
  const columns = useMemo(() => getColumns<TransactionWithRelations>(), [])
  const [editable] = useState(defaultEditable)
  const meta = useMemo<TableMeta<TransactionWithRelations>>(
    () => ({
      actions: {
        edit: hasEditAction,
        delete: hasDeleteAction,
      },
      currencyFormatter: getCurrencyFormatter('USD'),
      editable,
      deleteRow(_, rowIndex) {
        onDataUpdate?.(data.filter((_, index) => index !== rowIndex))
      },
      updateCellData(rowIndex, columnId, value) {
        onDataUpdate?.(
          data.map((row, index) => {
            if (index === rowIndex) return { ...row, [columnId]: value }
            return row
          }),
        )
      },
    }),
    [hasEditAction, hasDeleteAction, editable, onDataUpdate, data],
  )

  return (
    <DataTable
      className={className}
      data={data}
      columns={columns}
      defaultColumnVisibility={defaultColumnVisibility}
      getRowId={({ externalId, date }) =>
        externalId ?? `transaction-${date.getTime()}`
      }
      isLoading={isLoading}
      meta={meta}
    />
  )
}

export { TransactionsTable }
