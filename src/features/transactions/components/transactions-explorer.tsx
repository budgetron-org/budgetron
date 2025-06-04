'use client'

import { IconCloudUpload, IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { endOfToday, startOfYear } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import { PATHS } from '~/data/routes'
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
      <div className="flex flex-col justify-end gap-2 md:flex-row">
        <DateRangePicker
          className="w-full md:w-[250px]"
          defaultValue={transactionRange}
          onChange={setTransactionRange}
        />
        <Button asChild>
          <Link href={PATHS.TRANSACTIONS_UPLOAD}>
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
      <div className="min-h-0 flex-1">
        <TransactionsTable
          className="max-h-full min-h-full"
          isLoading={transactions.isLoading}
          data={transactions.data}
        />
      </div>
    </>
  )
}

export { TransactionsExplorer }
