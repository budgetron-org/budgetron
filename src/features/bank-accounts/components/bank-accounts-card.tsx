import {
  IconCaretUpDownFilled,
  IconDots,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'
import { api } from '~/rpc/server'
import type { BankAccount } from '../types'
import { CreateBankAccountDialog } from './create-bank-account-dialog'
import { DeleteBankAccountDialog } from './delete-bank-account-dialog'
import { UpdateBankAccountDialog } from './update-bank-account-dialog'

function BankAccountDetailSection(props: {
  title: string
  children: ReactNode
}) {
  return (
    <Collapsible defaultOpen={true}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{props.title}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconCaretUpDownFilled />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col justify-center gap-2">
        {props.children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function BankAccountDetailItem({ bankAccount }: { bankAccount: BankAccount }) {
  // TODO: Get the currency from User Settings
  const formatter = getCurrencyFormatter('USD')
  return (
    <div className="flex items-center justify-center">
      <span>{bankAccount.name}</span>
      <Badge className="ml-2">{bankAccount.type}</Badge>
      <div className="ml-auto flex items-center justify-center gap-2">
        {formatter.format(safeParseNumber(bankAccount.balance))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
      </div>
    </div>
  )
}

async function BankAccountsCard(props: ComponentPropsWithoutRef<typeof Card>) {
  const bankAccounts = await api.bankAccounts.getAll()
  const grouped = Object.groupBy(bankAccounts, (acc) => acc.type)
  return (
    <Card {...props}>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          Accounts
          <CreateBankAccountDialog
            trigger={
              <Button className="ml-auto">
                <IconPlus />
                New
              </Button>
            }
            refreshOnSuccess
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h2 className="flex text-xl font-semibold">
          <span>Net Worth</span>
          <span className="ml-auto">$40,000</span>
        </h2>

        <BankAccountDetailSection title="Cash & Checking">
          {[...(grouped.CHECKING ?? []), ...(grouped.SAVINGS ?? [])].map(
            (acc) => (
              <BankAccountDetailItem key={acc.id} bankAccount={acc} />
            ),
          )}
        </BankAccountDetailSection>

        <BankAccountDetailSection title="Credit">
          {grouped.CREDIT?.map((acc) => (
            <BankAccountDetailItem key={acc.id} bankAccount={acc} />
          ))}
        </BankAccountDetailSection>
      </CardContent>
    </Card>
  )
}

export { BankAccountsCard }
