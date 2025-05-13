'use client'

import { IconCloudUpload, IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfYear } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { api } from '~/rpc/client'
import { CreateTransactionDialog } from './create-transaction-dialog'
import { TransactionsTable } from './transactions-table'

function TransactionsExplorer() {
  const [transactionRange, setTransactionRange] = useState({
    from: startOfYear(Date.now()),
    to: endOfToday(),
  })
  const transactions = useQuery(
    api.transactions.getByDateRange.queryOptions({
      input: { ...transactionRange },
    }),
  )

  return (
    <>
      <div className="flex justify-end gap-2">
        <DateRangePicker
          defaultValue={transactionRange}
          onChange={setTransactionRange}
        />
        <Button asChild>
          <Link href="/transactions/upload">
            <IconCloudUpload />
            Import
          </Link>
        </Button>
        <CreateTransactionDialog
          trigger={
            <Button variant="success">
              <IconPlus />
              Add
            </Button>
          }
        />
      </div>
      <div className="flex-1">
        <TransactionsTable
          isLoading={transactions.isLoading}
          data={transactions.data}
        />
      </div>
    </>
  )
}

export { TransactionsExplorer }
