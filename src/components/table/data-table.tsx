'use client'

import { flexRender, type Table as ReactTable } from '@tanstack/react-table'

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

interface DataTableProps<Data> {
  className?: string
  isLoading?: boolean
  table: ReactTable<Data>
}

function DataTable<Data>({
  className,
  isLoading,
  table,
}: DataTableProps<Data>) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-2 rounded-md border pb-2',
        className,
      )}>
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
                  data-state={row.getIsSelected() && 'selected'}
                  className="group">
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
