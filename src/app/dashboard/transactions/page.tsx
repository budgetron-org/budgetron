import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { redirectUnauthenticated } from '~/features/auth/server'
import { TransactionsExplorer } from '~/features/transactions/components/transactions-explorer'

async function TransactionsPageImpl() {
  await redirectUnauthenticated()

  return <TransactionsExplorer />
}

export default async function TransactionsPage() {
  return (
    <SuspenseBoundary>
      <TransactionsPageImpl />
    </SuspenseBoundary>
  )
}
