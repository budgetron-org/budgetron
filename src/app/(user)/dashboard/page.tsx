import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { api } from '~/trpc/server'
import { OverviewSection } from './_components/overview-section'

async function DashboardPageImpl() {
  const session = await api.auth.getSession()
  if (!session?.user) redirect('/sign-in')

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      </div>
      <div className="flex w-full flex-1 items-start">
        <OverviewSection />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardPageImpl />
    </Suspense>
  )
}
