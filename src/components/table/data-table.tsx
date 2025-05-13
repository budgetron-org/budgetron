'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
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
import { DataTablePagination } from './pagination'

interface DataTableProps<Data, Value>
  extends Pick<TableOptions<Data>, 'data' | 'getRowId' | 'meta'> {
  columns: ColumnDef<Data, Value>[]
  isLoading?: boolean
  isReadOnly?: boolean
}

function DataTable<Data, Value>({
  columns,
  data,
  getRowId,
  isLoading,
  isReadOnly,
  meta,
}: DataTableProps<Data, Value>) {
  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])
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
    onRowSelectionChange: setRowSelection,
    onSortingChange: (args) => {
      setSorting(args)
      table.resetPageIndex()
    },
    state: {
      pagination: { pageIndex: 0, pageSize: 50 },
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-4 rounded-md border pb-2">
      <SkeletonWrapper isLoading={isLoading}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
      <DataTablePagination table={table} showSelectedCount={!isReadOnly} />
    </div>
  )
}

export type { ColumnDef, Table } from '@tanstack/react-table'
export { DataTable }
export type { DataTableProps }
