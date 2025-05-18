import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { redirectUnauthenticated } from '~/features/auth/server'
import { TransactionsExplorer } from '~/features/transactions/components/transactions-explorer'

async function TransactionsPageImpl() {
  await redirectUnauthenticated()

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <TransactionsExplorer />
    </div>
  )
}

export default async function TransactionsPage() {
  return (
    <SuspenseBoundary>
      <TransactionsPageImpl />
    </SuspenseBoundary>
  )
}
