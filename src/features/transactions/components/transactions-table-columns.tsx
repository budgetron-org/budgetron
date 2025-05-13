'use client'

import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'

import {
  DataTableColumnHeader,
  type ColumnDef,
  type Table,
} from '~/components/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { CategoryPicker } from '~/components/widgets/category-picker'
import { TransactionTypePicker } from '~/components/widgets/transaction-type-picker'
import type { TransactionWithRelations } from '~/features/transactions/types'
import { safeParseNumber } from '~/lib/utils'
import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { UpdateTransactionDialog } from './update-transaction-dialog'

function isEditableColumn<Data>(table: Table<Data>, accessor: keyof Data) {
  const editable = table.options.meta?.editable
  if (typeof editable === 'boolean') return editable
  return !!editable?.[accessor]
}

function getFormattedAmount<Data>(table: Table<Data>, value: string) {
  return (
    table.options.meta?.currencyFormatter.format(safeParseNumber(value)) ??
    String(value)
  )
}

type GetColumnsOptions = {
  isReadOnly?: boolean
}
function getColumns<Data extends TransactionWithRelations>({
  isReadOnly,
}: GetColumnsOptions): ColumnDef<Data>[] {
  const columns: (ColumnDef<Data> | false)[] = [
    !isReadOnly && {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString('default', {
              timeZone: 'UTC',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'description')) {
          return (
            <Input
              aria-label="Description"
              defaultValue={row.original.description}
              onBlur={(event) => {
                const value = event.target.value
                // do not update if the value is not different
                if (value === row.original.description) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'description',
                  value as Data['description'],
                )
              }}
            />
          )
        }
        return <div className="capitalize">{row.original.description}</div>
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row, table }) => {
        return (
          <div className="capitalize">
            {getFormattedAmount(table, row.original.amount)}
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'type')) {
          return (
            <TransactionTypePicker
              aria-label="Transaction Type"
              defaultValue={row.original.type}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.type) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'type',
                  value as Data['type'],
                )
              }}
            />
          )
        }
        return (
          <Badge
            variant={
              row.original.type === 'EXPENSE' ? 'destructive' : 'success'
            }>
            {row.original.type}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'category')) {
          return (
            <CategoryPicker
              aria-label="Category"
              type={row.original.type}
              defaultValue={row.original.category?.id}
              onValueChange={(value) => {
                // do not update if the value is not different
                if (value === row.original.category?.id) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'categoryId',
                  value as Data['categoryId'],
                )
              }}
            />
          )
        }
        return (
          row.original.category && (
            <div className="flex items-center gap-2">
              {row.original.category.name}
            </div>
          )
        )
      },
    },
    {
      accessorKey: 'account',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account" />
      ),
      cell: ({ row }) =>
        row.original.bankAccount && (
          <Badge>
            {row.original.bankAccount.name} - {row.original.bankAccount.type}
          </Badge>
        ),
    },
    !isReadOnly && {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">More options</span>
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <UpdateTransactionDialog
              transaction={row.original}
              trigger={
                <DropdownMenuItem preventClosing>
                  <IconPencil />
                  Edit
                </DropdownMenuItem>
              }
              refreshOnSuccess
            />
            <DeleteTransactionDialog
              transaction={row.original}
              trigger={
                <DropdownMenuItem preventClosing>
                  <IconTrash className="text-destructive" />
                  Delete
                </DropdownMenuItem>
              }
              refreshOnSuccess
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
  return columns.filter(Boolean)
}

export { getColumns }
