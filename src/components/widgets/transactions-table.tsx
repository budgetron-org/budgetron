'use client'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type TableMeta,
  type VisibilityState,
} from '@tanstack/react-table'
import { capitalize } from 'lodash'
import { useId, useMemo, useState } from 'react'

import { DataTable } from '~/components/table'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { MultiSelect } from '~/components/ui/multi-select'
import type { TransactionWithRelations } from '~/features/transactions/types'
import { getCurrencyFormatter } from '~/lib/format'
import { cn } from '~/lib/utils'
import { getColumns, type ColumnId } from './transactions-table-columns'

interface TransactionsTableProps {
  className?: string
  data?: TransactionWithRelations[]
  defaultColumnVisibility?: Partial<Record<ColumnId, boolean>>
  defaultEditable?: TableMeta<TransactionWithRelations>['editable']
  hasEditAction?: boolean
  hasDeleteAction?: boolean
  isLoading?: boolean
  onDataUpdate?: (data: TransactionWithRelations[]) => void
  showFilters?: boolean
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
  showFilters = true,
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
      updateRowData(rowIndex, value) {
        onDataUpdate?.(
          data.map((row, index) => {
            if (index === rowIndex) return value
            return row
          }),
        )
      },
    }),
    [hasEditAction, hasDeleteAction, editable, onDataUpdate, data],
  )

  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])
  // Column filtering
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility ?? {},
  )
  // Selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const table = useReactTable({
    autoResetPageIndex: false,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: ({ externalId, id }) => externalId ?? `transaction-${id}`,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (args) => {
      setSorting(args)
      table.resetPageIndex()
    },
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
  })

  // base id for filters
  const baseId = useId()
  // data for filters
  const { accounts, categories, tags, types } = useMemo(() => {
    const acc = data.reduce(
      (acc, transaction) => {
        // add unique accounts
        if (
          transaction.bankAccount &&
          !acc.accounts.has(transaction.bankAccount.id)
        )
          acc.accounts.set(transaction.bankAccount.id, {
            label: transaction.bankAccount.name,
            value: transaction.bankAccount.id,
          })

        // add unique categories
        if (
          transaction.category &&
          !acc.categories.has(transaction.category.id)
        )
          acc.categories.set(transaction.category.id, {
            label: transaction.category.name,
            value: transaction.category.id,
          })

        // add unique types
        if (!acc.types.has(transaction.type))
          acc.types.set(transaction.type, {
            label: capitalize(transaction.type),
            value: transaction.type,
          })

        // add unique tags
        if (transaction.tags)
          transaction.tags.forEach((tag) => {
            if (!acc.tags.has(tag))
              acc.tags.set(tag, {
                label: tag,
                value: tag,
              })
          })

        return acc
      },
      {
        accounts: new Map(),
        categories: new Map(),
        tags: new Map(),
        types: new Map(),
      } as {
        accounts: Map<string, { label: string; value: string }>
        categories: Map<string, { label: string; value: string }>
        tags: Map<string, { label: string; value: string }>
        types: Map<string, { label: string; value: string }>
      },
    )
    return {
      accounts: Array.from(acc.accounts.values()),
      categories: Array.from(acc.categories.values()),
      tags: Array.from(acc.tags.values()),
      types: Array.from(acc.types.values()),
    }
  }, [data])

  return (
    <div className="flex h-full flex-col gap-2">
      {showFilters && (
        <div className="flex items-start gap-2">
          <div className="grid gap-2">
            <Label htmlFor={`${baseId}-description-filter`}>Description</Label>
            <Input
              id={`${baseId}-description-filter`}
              placeholder="Filter by description"
              value={
                (table.getColumn('description')?.getFilterValue() ??
                  '') as string
              }
              onChange={(e) =>
                table.getColumn('description')?.setFilterValue(e.target.value)
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${baseId}-type-filter`}>Type</Label>
            <MultiSelect
              id={`${baseId}-type-filter`}
              placeholder="Filter by type"
              options={types}
              value={
                (table.getColumn('type')?.getFilterValue() ?? []) as string[]
              }
              onValueChange={(value) => {
                table.getColumn('type')?.setFilterValue(value)
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${baseId}-account-filter`}>Account</Label>
            <MultiSelect
              id={`${baseId}-account-filter`}
              placeholder="Filter by account"
              options={accounts}
              value={
                (table.getColumn('bankAccount')?.getFilterValue() ??
                  []) as string[]
              }
              onValueChange={(value) => {
                table.getColumn('bankAccount')?.setFilterValue(value)
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${baseId}-category-filter`}>Category</Label>
            <MultiSelect
              id={`${baseId}-category-filter`}
              placeholder="Filter by category"
              options={categories}
              value={
                (table.getColumn('category')?.getFilterValue() ??
                  []) as string[]
              }
              onValueChange={(value) => {
                table.getColumn('category')?.setFilterValue(value)
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${baseId}-tag-filter`}>Tag</Label>
            <MultiSelect
              id={`${baseId}-tag-filter`}
              placeholder="Filter by tag"
              options={tags}
              value={
                (table.getColumn('tags')?.getFilterValue() ?? []) as string[]
              }
              onValueChange={(value) => {
                table.getColumn('tags')?.setFilterValue(value)
              }}
            />
          </div>

          <Button
            className="self-end"
            variant="outline"
            onClick={() => table.resetColumnFilters()}>
            Reset Filters
          </Button>
        </div>
      )}
      <DataTable
        className={cn(className, 'min-h-0 flex-1')}
        isLoading={isLoading}
        table={table}
      />
    </div>
  )
}

export { TransactionsTable }
