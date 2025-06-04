import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { SuspenseBoundary } from '~/components/ui/suspense-boundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { PATHS } from '~/data/routes'
import { CategoriesReport } from '~/features/analytics/components/categories-report'
import { redirectUnauthenticated } from '~/features/auth/server'

async function CategoriesReportsPageImpl() {
  await redirectUnauthenticated()

  return (
    <Tabs defaultValue="spending" className="flex h-full w-full flex-col">
      <Link href={PATHS.REPORTS} className="max-w-max">
        <Button variant="outline">
          <IconArrowLeft /> Back
        </Button>
      </Link>
      <TabsList>
        <TabsTrigger value="spending">Spending</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>
      <TabsContent value="spending" className="overflow-y-auto">
        <CategoriesReport reportFor="spending" title="Spending by category" />
      </TabsContent>
      <TabsContent value="income" className="overflow-y-auto">
        <CategoriesReport reportFor="income" title="Income by Category" />
      </TabsContent>
    </Tabs>
  )
}

export default async function CategoriesReportsPage() {
  return (
    <SuspenseBoundary>
      <CategoriesReportsPageImpl />
    </SuspenseBoundary>
  )
}
