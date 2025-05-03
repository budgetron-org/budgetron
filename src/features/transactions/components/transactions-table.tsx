'use client'

import { DataTable } from '~/components/data-table'
import type { TransactionWithRelations } from '../types'
import { columns } from './transactions-table-columns'

type TransactionsTableProps = {
  data?: TransactionWithRelations[]
  isEditable?: boolean
  isLoading?: boolean
  onDataUpdate?: (data: TransactionWithRelations[]) => void
}

function TransactionsTable({
  data = [],
  isEditable,
  isLoading,
  onDataUpdate,
}: TransactionsTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={({ externalId, date }) =>
        externalId ?? `transaction-${date.getTime()}`
      }
      isLoading={isLoading}
      meta={{
        editable: isEditable
          ? {
              category: true,
              description: true,
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
