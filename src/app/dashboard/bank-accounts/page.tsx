import { IconPlus } from '@tabler/icons-react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { redirectUnauthenticated } from '~/features/auth/server'
import { BankAccountItem } from '~/features/bank-accounts/components/bank-account-item'
import { CreateBankAccountDialog } from '~/features/bank-accounts/components/create-bank-account-dialog'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'
import { api } from '~/rpc/server'

// TODO: Get the currency from User Settings
const currencyFormatter = getCurrencyFormatter('USD')

async function BankAccountsPageImpl() {
  await redirectUnauthenticated()
  const bankAccounts = await api.bankAccounts.getAll()

  if (bankAccounts.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">No bank accounts found</CardTitle>
            <CardDescription>
              Looks like you don&apos;t have not setup any bank accounts yet.
              Start by adding a new bank account.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <CreateBankAccountDialog
              trigger={
                <Button variant="success" className="w-full">
                  Add a new bank account
                </Button>
              }
              refreshOnSuccess
            />
          </CardFooter>
        </Card>
      </div>
    )
  }

  const netWorth = bankAccounts.reduce(
    (acc, curr) => acc + safeParseNumber(curr.balance),
    0,
  )
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-col justify-end gap-2 md:flex-row">
        <CreateBankAccountDialog
          trigger={
            <Button variant="success">
              <IconPlus />
              Add
            </Button>
          }
          refreshOnSuccess
        />
      </div>
      <h2 className="text-2xl">
        Net Worth: {currencyFormatter.format(netWorth)}
      </h2>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-4">
          {bankAccounts.map((bankAccount) => (
            <BankAccountItem key={bankAccount.id} bankAccount={bankAccount} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function BankAccountsPage() {
  return (
    <SuspenseBoundary>
      <BankAccountsPageImpl />
    </SuspenseBoundary>
  )
}
