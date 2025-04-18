import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { BudgetSection } from './_components/budget-section'
import { SheetIcon } from 'lucide-react'

export default function BudgetPage() {
  return (
    <div className="flex w-full">
      <Button className="absolute right-8" asChild>
        <Link href="/budget/manage">
          <SheetIcon />
          Manage budget
        </Link>
      </Button>
      <Tabs defaultValue="spending" className="w-full flex-1">
        <TabsList className="self-center">
          <TabsTrigger value="spending" className="w-[100px]">
            Spending
          </TabsTrigger>
          <TabsTrigger value="income" className="w-[100px]">
            Income
          </TabsTrigger>
        </TabsList>
        <TabsContent value="spending">
          <BudgetSection title="Spending on all categories" type="spending" />
        </TabsContent>

        <TabsContent value="income">
          <BudgetSection title="Income on all categories" type="income" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
