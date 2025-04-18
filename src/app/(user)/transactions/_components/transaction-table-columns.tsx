'use client'

import type { ColumnDef, RowData, Table } from '@tanstack/react-table'
import { MoreHorizontal, PencilIcon, Trash2Icon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'

import { CategoryPicker } from '~/components/category-picker'
import { DataTableColumnHeader } from '~/components/data-table/column-header'
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
import { PERSONAL_ICON, PERSONAL_LABEL } from '~/lib/constants'
import { safeParseLucideIcon } from '~/lib/utils'

export function getColumns<
  Data extends TransactionWithRelations,
>(): ColumnDef<Data>[] {
  return [
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
      cell: ({ row, table }) => {
        if (isEditableColumn(table, 'category')) {
          return (
            <CategoryPicker
              defaultValue={row.original.category?.id}
              onChange={(value, item) => {
                // do not update if the value is not different
                if (value === row.original.category?.id) return
                table.options.meta?.updateCellData?.(
                  row.index,
                  'category',
                  item as Data['category'],
                )
              }}
            />
          )
        }
        return (
          row.original.category && (
            <div className="flex items-center gap-2">
              <DynamicIcon
                name={safeParseLucideIcon(row.original.category.icon)}
              />
              <span className="capitalize">{row.original.category.name}</span>
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
        row.original.account && <Badge>{row.original.account.name}</Badge>,
    },
    {
      accessorKey: 'household',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Household" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DynamicIcon
            name={safeParseLucideIcon(
              row.original.household?.icon ?? PERSONAL_ICON,
            )}
          />
          <span className="capitalize">
            {row.original.household?.name ?? PERSONAL_LABEL}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({}) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">More options</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2Icon className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ] satisfies ColumnDef<Data>[]
}

function isEditableColumn<Data extends RowData>(
  table: Table<Data>,
  accessor: keyof Data,
) {
  const editable = table.options.meta?.editable
  if (typeof editable === 'boolean') return editable
  return !!editable?.[accessor]
}
