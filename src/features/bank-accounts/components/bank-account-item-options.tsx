import { IconPencil, IconTrash } from '@tabler/icons-react'
import type { ComponentProps } from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { BankAccount } from '../types'
import { DeleteBankAccountDialog } from './delete-bank-account-dialog'
import { UpdateBankAccountDialog } from './update-bank-account-dialog'

interface BankAccountItemOptionsProps
  extends Pick<ComponentProps<'div'>, 'className'> {
  bankAccount: BankAccount
}

function BankAccountItemOptions({
  bankAccount,
  className,
}: BankAccountItemOptionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <UpdateBankAccountDialog
        bankAccount={bankAccount}
        trigger={
          <Button variant="ghost" size="icon">
            <IconPencil />
            <span className="sr-only">Edit bank account</span>
          </Button>
        }
        refreshOnSuccess
      />
      <DeleteBankAccountDialog
        bankAccount={bankAccount}
        trigger={
          <Button variant="destructive-ghost" size="icon">
            <IconTrash />
            <span className="sr-only">Delete bank account</span>
          </Button>
        }
        refreshOnSuccess
      />
    </div>
  )
}

export { BankAccountItemOptions }
