'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'

import { SkeletonWrapper } from '~/components/ui/skeleton-wrapper'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { cn } from '~/lib/utils'
import { DataTablePagination } from './pagination'

interface DataTableProps<Data, Value>
  extends Pick<TableOptions<Data>, 'data' | 'getRowId' | 'meta'> {
  className?: string
  columns: ColumnDef<Data, Value>[]
  defaultColumnVisibility?: VisibilityState
  isLoading?: boolean
}

function DataTable<Data, Value>({
  className,
  columns,
  data,
  defaultColumnVisibility,
  getRowId,
  isLoading,
  meta,
}: DataTableProps<Data, Value>) {
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
    getRowId,
    getSortedRowModel: getSortedRowModel(),
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
      pagination: { pageIndex: 0, pageSize: 50 },
      rowSelection,
      sorting,
    },
  })

  return (
    <div
      className={cn('flex flex-col gap-4 rounded-md border pb-2', className)}>
      <SkeletonWrapper isLoading={isLoading}>
        <Table className="overflow-scroll">
          <TableHeader className="sticky top-0 z-10 overflow-hidden rounded-t-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-background">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SkeletonWrapper>
      <DataTablePagination table={table} />
    </div>
  )
}

export type { ColumnDef, Table } from '@tanstack/react-table'
export { DataTable }
