'use client'

import { useMemo } from 'react'

import { DataTable } from '~/components/table'
import { getCurrencyFormatter } from '~/lib/format'
import type { TransactionWithRelations } from '../types'
import { getColumns } from './transactions-table-columns'

type TransactionsTableProps = {
  data?: TransactionWithRelations[]
  isEditable?: boolean
  isLoading?: boolean
  isReadOnly?: boolean
  onDataUpdate?: (data: TransactionWithRelations[]) => void
}

function TransactionsTable({
  data = [],
  isEditable,
  isLoading,
  isReadOnly,
  onDataUpdate,
}: TransactionsTableProps) {
  const currencyFormatter = useMemo(() => getCurrencyFormatter('USD'), [])
  const columns = useMemo(
    () => getColumns<TransactionWithRelations>({ isReadOnly }),
    [isReadOnly],
  )
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={({ externalId, date }) =>
        externalId ?? `transaction-${date.getTime()}`
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      meta={{
        currencyFormatter,
        editable: isEditable
          ? {
              category: true,
              description: true,
              type: true,
            }
          : undefined,
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
      }}
    />
  )
}

export { TransactionsTable }
