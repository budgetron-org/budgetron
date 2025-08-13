import type { RowData } from '@tanstack/react-table'
import type { CurrencyCode } from '~/data/currencies'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    actions?:
      | boolean
      | {
          edit?: boolean
          delete?: boolean
        }
    baseCurrency: CurrencyCode
    editable?: boolean | Partial<Record<keyof TData, boolean>>
    deleteRow?: (rowId: string, rowIndex: number) => void
    updateCellData?: (
      rowIndex: number,
      columnId: keyof TData,
      value: TData[keyof TData],
    ) => void
    updateRowData?: (rowIndex: number, value: TData) => void
  }
}
