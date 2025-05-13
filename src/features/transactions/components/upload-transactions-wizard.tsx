'use client'

import { IconDeviceFloppy, IconFileFilled } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { ProgressButton } from '~/components/ui/progress-button'
import { defineStepper } from '~/components/ui/stepper'
import { TransactionsTable } from '~/features/transactions/components/transactions-table'
import { UploadOFXForm } from '~/features/transactions/components/upload-ofx-form'
import type { TransactionWithRelations } from '~/features/transactions/types'
import { api } from '~/rpc/client'

const Stepper = defineStepper(
  {
    id: 'step-1',
    title: 'Step 1',
    description: 'Upload File',
  },
  {
    id: 'step-2',
    title: 'Step 2',
    description: 'Upload Transactions',
  },
)

function UploadTransactionsWizard() {
  const uploadOFXFormId = useId()
  const [transactionsToUpload, setTransactionsToUpload] = useState<
    TransactionWithRelations[]
  >([])
  const router = useRouter()
  const queryClient = useQueryClient()

  const parseOFX = useMutation(
    api.transactions.parseOFX.mutationOptions({
      onSuccess(data, { file }) {
        toast.success(`Parsed file - ${file.name}`)
        setTransactionsToUpload(data)
      },
      onError(error, { file }) {
        toast.error(`Error parsing ${file.name}`, {
          description: error.message,
        })
      },
    }),
  )

  const uploadTransactions = useMutation(
    api.transactions.createMany.mutationOptions({
      onSuccess(_, input) {
        toast.success(`Uploaded ${input.length} transactions successfully.`)

        // invalidate caches
        queryClient.invalidateQueries({
          queryKey: api.transactions.getByDateRange.key(),
        })
        router.push('/transactions')
      },
      onError(error, input) {
        toast.error(`Error uploading ${input.length} transactions.`, {
          description: error.message,
        })
      },
    }),
  )

  return (
    <Stepper.StepperProvider
      className="grid gap-4"
      variant="horizontal"
      labelOrientation="vertical">
      {({ methods }) => (
        <>
          <Stepper.StepperNavigation>
            {methods.all.map((step) => (
              <Stepper.StepperStep
                key={step.id}
                of={step.id}
                icon={
                  {
                    'step-1': <IconFileFilled />,
                    'step-2': <IconDeviceFloppy />,
                  }[step.id]
                }>
                <Stepper.StepperTitle>{step.title}</Stepper.StepperTitle>
                <Stepper.StepperDescription>
                  {step.description}
                </Stepper.StepperDescription>
              </Stepper.StepperStep>
            ))}
          </Stepper.StepperNavigation>

          <Stepper.StepperPanel>
            {methods.switch({
              'step-1': () => (
                <UploadOFXForm
                  id={uploadOFXFormId}
                  onSubmit={(data) =>
                    parseOFX.mutate(data, {
                      onSuccess() {
                        methods.goTo('step-2')
                      },
                    })
                  }
                />
              ),
              'step-2': () => (
                <TransactionsTable
                  data={transactionsToUpload}
                  onDataUpdate={setTransactionsToUpload}
                  isEditable
                />
              ),
            })}
          </Stepper.StepperPanel>

          <Stepper.StepperControls>
            {methods.switch({
              'step-1': () => (
                <>
                  <Link href="/transactions">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                  <ProgressButton
                    form={uploadOFXFormId}
                    isLoading={parseOFX.isPending}>
                    Upload file
                  </ProgressButton>
                </>
              ),
              'step-2': () => (
                <>
                  <Button variant="secondary" onClick={methods.prev}>
                    Back
                  </Button>
                  <ProgressButton
                    onClick={() =>
                      uploadTransactions.mutate(
                        transactionsToUpload.map((t) => ({
                          ...t,
                          bankAccountId: t.bankAccount?.id,
                          categoryId: t.category?.id,
                          groupId: t.group?.id,
                        })),
                      )
                    }
                    isLoading={uploadTransactions.isPending}>
                    Upload transactions
                  </ProgressButton>
                </>
              ),
            })}
          </Stepper.StepperControls>
        </>
      )}
    </Stepper.StepperProvider>
  )
}

export { UploadTransactionsWizard }
