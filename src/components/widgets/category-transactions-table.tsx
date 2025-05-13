'use client'

import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfYear } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { TransactionsTable } from '~/features/transactions/components/transactions-table'
import { api } from '~/rpc/client'

type CategoryTransactionsTableProps = {
  categoryId: string
  from?: Date
  to?: Date
}

function CategoryTransactionsTable({
  categoryId,
  from,
  to,
}: CategoryTransactionsTableProps) {
  const { data, isPending } = useQuery(
    api.transactions.getByCategory.queryOptions({
      input: {
        categoryId,
        from: from ?? startOfYear(Date.now()),
        to: to ?? endOfToday(),
      },
    }),
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Transactions for the selected category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionsTable data={data ?? []} isLoading={isPending} isReadOnly />
      </CardContent>
    </Card>
  )
}

export { CategoryTransactionsTable }
