import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { PATHS } from '~/data/routes'
import { CashFlowReport } from '~/features/analytics/components/cash-flow-report'
import { redirectUnauthenticated } from '~/features/auth/server'

async function CashFlowReportsPageImpl() {
  await redirectUnauthenticated()

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <Link href={PATHS.REPORTS} className="max-w-max">
        <Button variant="outline">
          <IconArrowLeft /> Back
        </Button>
      </Link>
      <div className="flex-1 overflow-y-auto">
        <CashFlowReport />
      </div>
    </div>
  )
}

export default async function CashFlowReportsPage() {
  return (
    <SuspenseBoundary>
      <CashFlowReportsPageImpl />
    </SuspenseBoundary>
  )
}
