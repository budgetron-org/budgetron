import { IconArrowRight, IconCaretUpDownFilled } from '@tabler/icons-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import { PATHS } from '~/data/routes'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'
import { api } from '~/rpc/server'
import type { BankAccount } from '../types'

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
      </div>
    </div>
  )
}

async function BankAccountsCard(props: ComponentPropsWithoutRef<typeof Card>) {
  const bankAccounts = await api.bankAccounts.getAll()
  const grouped = Object.groupBy(bankAccounts, (acc) => acc.type)
  const netWorth = bankAccounts.reduce(
    (acc, curr) => acc + safeParseNumber(curr.balance),
    0,
  )
  const formatter = getCurrencyFormatter('USD')

  const cashAndChecking = [
    ...(grouped.CHECKING ?? []),
    ...(grouped.SAVINGS ?? []),
  ]
  const credit = grouped.CREDIT ?? []
  const hasNoAccounts = cashAndChecking.length === 0 && credit.length === 0

  return (
    <Card {...props}>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          Accounts
          <Link href={PATHS.BANK_ACCOUNTS} className="ml-auto">
            <Button variant="ghost">
              Manage
              <IconArrowRight />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h2 className="flex text-xl font-semibold">
          <span>Net Worth</span>
          <span className="ml-auto">{formatter.format(netWorth)}</span>
        </h2>
        {hasNoAccounts && (
          <p className="text-muted-foreground p-8 text-center">
            Add an account to get started
          </p>
        )}

        {cashAndChecking.length > 0 && (
          <BankAccountDetailSection title="Cash & Checking">
            {cashAndChecking.map((acc) => (
              <BankAccountDetailItem key={acc.id} bankAccount={acc} />
            ))}
          </BankAccountDetailSection>
        )}

        {credit.length > 0 && (
          <BankAccountDetailSection title="Credit">
            {credit.map((acc) => (
              <BankAccountDetailItem key={acc.id} bankAccount={acc} />
            ))}
          </BankAccountDetailSection>
        )}
      </CardContent>
    </Card>
  )
}

export { BankAccountsCard }
