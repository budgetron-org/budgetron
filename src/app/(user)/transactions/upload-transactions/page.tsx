'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import type { TransactionWithRelations } from '~/features/transactions/types'
import { UploadTransactionsForm } from './_components/upload-transactions-form'
import { UploadTransactionsTable } from './_components/upload-transactions-table'

export default function UploadTransactionsPage() {
  const router = useRouter()
  const [parsedTransactions, setParsedTransactions] =
    useState<TransactionWithRelations[]>()

  const cancelAndGoBack = useCallback(() => {
    router.back()
  }, [router])

  const onParseTransactionsSuccess = useCallback(
    (data: TransactionWithRelations[]) => {
      setParsedTransactions(data)
    },
    [],
  )
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h2 className="text-2xl">Upload Transactions</h2>
        <h3 className="text-muted-foreground">
          Upload an OFX file containing the transactions to get started
        </h3>
      </div>

      {!parsedTransactions && (
        <UploadTransactionsForm
          onSubmit={onParseTransactionsSuccess}
          onCancel={cancelAndGoBack}
        />
      )}
      {parsedTransactions && (
        <UploadTransactionsTable
          defaultData={parsedTransactions}
          onCancel={cancelAndGoBack}
        />
      )}
    </div>
  )
}
