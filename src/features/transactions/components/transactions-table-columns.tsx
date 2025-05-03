'use client'

import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'

import {
  DataTableColumnHeader,
  type ColumnDef,
  type Table,
} from '~/components/data-table'
import { AlertActionButton } from '~/components/ui/alert-action-button'
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
import type { TransactionWithRelations } from '~/features/transactions/types'

function isEditableColumn<Data>(table: Table<Data>, accessor: keyof Data) {
  const editable = table.options.meta?.editable
  if (typeof editable === 'boolean') return editable
  return !!editable?.[accessor]
}

const columns: ColumnDef<TransactionWithRelations>[] = [
  {
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
                value,
              )
            }}
          />
        )
      }
      return <div className="capitalize">{row.original.description}</div>
    },
  },
  {
    accessorKey: 'formattedAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.type === 'expense' ? 'destructive' : 'success'}>
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
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
        <Badge>{row.original.bankAccount.name}</Badge>
      ),
  },
  {
    id: 'actions',
    cell: ({ table, row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">More options</span>
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPencil />
            Edit
          </DropdownMenuItem>
          <AlertActionButton
            alertDescription="This will delete this transaction and cannot be undone!"
            onConfirm={() => {
              table.options.meta?.deleteRow?.(row.id, row.index)
            }}
            asChild>
            <DropdownMenuItem preventClosing>
              <IconTrash className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </AlertActionButton>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export { columns }
