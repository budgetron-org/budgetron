import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import type { BankAccount } from '../types'
import { DeleteBankAccountDialog } from './delete-bank-account-dialog'
import { UpdateBankAccountDialog } from './update-bank-account-dialog'

interface BankAccountItemOptionsProps extends ComponentProps<typeof Button> {
  bankAccount: BankAccount
}

function BankAccountItemOptions({
  bankAccount,
  className,
  ...props
}: BankAccountItemOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('h-8 w-8 p-0', className)}
          {...props}>
          <span className="sr-only">More options</span>
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <UpdateBankAccountDialog
          bankAccount={bankAccount}
          trigger={
            <DropdownMenuItem preventClosing>
              <IconPencil />
              Edit
            </DropdownMenuItem>
          }
          refreshOnSuccess
        />
        <DeleteBankAccountDialog
          bankAccount={bankAccount}
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
  )
}

export { BankAccountItemOptions }
