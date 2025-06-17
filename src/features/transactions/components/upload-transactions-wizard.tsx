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
import { TransactionsTable } from '~/components/widgets/transactions-table'
import { PATHS } from '~/data/routes'
import { cn } from '~/lib/utils'
import { api } from '~/rpc/client'
import type { TransactionWithRelations } from '../types'
import { UploadOFXForm } from './upload-ofx-form'

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

interface UploadTransactionsWizardProps {
  className?: string
}

function UploadTransactionsWizard({
  className,
}: UploadTransactionsWizardProps) {
  const uploadOFXFormId = useId()
  const [transactionsToUpload, setTransactionsToUpload] = useState<
    TransactionWithRelations[]
  >([])
  const router = useRouter()
  const queryClient = useQueryClient()

  const parseOFX = useMutation(
    api.transactions.parseOFX.mutationOptions({
      onSuccess(data, { files }) {
        toast.success(`Parsed ${files.length} file(s).`)
        setTransactionsToUpload(data)
      },
      onError(error, { files }) {
        toast.error(`Error parsing ${files.length} file(s)`, {
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
        router.push(PATHS.TRANSACTIONS)
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
      className={cn('flex flex-col gap-4', className)}
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

          <Stepper.StepperPanel className="min-h-0 flex-1">
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
                  className="max-h-full"
                  data={transactionsToUpload}
                  defaultColumnVisibility={{
                    bankAccount: false,
                    select: false,
                  }}
                  defaultEditable={{
                    category: true,
                    fromBankAccount: true,
                    notes: true,
                    tags: true,
                    toBankAccount: true,
                    type: true,
                  }}
                  onDataUpdate={setTransactionsToUpload}
                  hasEditAction={false}
                  showFilters={false}
                />
              ),
            })}
          </Stepper.StepperPanel>

          <Stepper.StepperControls>
            {methods.switch({
              'step-1': () => (
                <>
                  <Link href={PATHS.TRANSACTIONS}>
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
                          categoryId: t.categoryId ?? t.category?.id,
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
