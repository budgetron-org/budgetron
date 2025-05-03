import { UploadTransactionsWizard } from '~/features/transactions/components/upload-transactions-wizard'

export default async function UploadTransactionsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h2 className="text-2xl">Upload Transactions</h2>
        <h3 className="text-muted-foreground">
          Upload an OFX file containing the transactions to get started
        </h3>
      </div>

      <UploadTransactionsWizard />
    </div>
  )
}
