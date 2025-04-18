import { PlusIcon, UploadIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { CreateTransactionDialog } from './_components/create-transaction-dialog'
import { TransactionsSection } from './_components/transactions-section'

export default function TransactionsPage() {
  return (
    <div className="grid w-full gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex gap-3">
          <CreateTransactionDialog
            trigger={
              <Button
                variant="custom"
                className="bg-success text-success-foreground hover:bg-success/90">
                <PlusIcon />
                Add Transaction
              </Button>
            }
          />
          <Button asChild>
            <Link href="/transactions/upload-transactions">
              <UploadIcon />
              Upload Transactions
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-1 items-start">
        <TransactionsSection />
      </div>
    </div>
  )
}
