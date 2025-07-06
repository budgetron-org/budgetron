import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { requireAuthentication } from '~/features/auth/utils'
import { TransactionsExplorer } from '~/features/transactions/components/transactions-explorer'

async function TransactionsPageImpl() {
  await requireAuthentication()

  return <TransactionsExplorer />
}

export default async function TransactionsPage() {
  return (
    <SuspenseBoundary>
      <TransactionsPageImpl />
    </SuspenseBoundary>
  )
}
