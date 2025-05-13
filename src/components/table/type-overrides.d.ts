import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    currencyFormatter: Intl.NumberFormat
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
