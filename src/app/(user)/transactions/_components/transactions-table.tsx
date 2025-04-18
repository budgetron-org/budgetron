'use client'

import { flexRender, type Table as ReactTable } from '@tanstack/react-table'

import { DataTablePagination } from '~/components/data-table/pagination'
import { SkeletonWrapper } from '~/components/skeleton-wrapper'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

type TransactionsTableProps<Data> = {
  table: ReactTable<Data>
  isLoading?: boolean
}
export function TransactionsTable<Data>({
  table,
  isLoading,
}: TransactionsTableProps<Data>) {
  return (
    <div className="grid gap-4 rounded-md border pb-2">
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
      <DataTablePagination table={table} />
    </div>
  )
}
