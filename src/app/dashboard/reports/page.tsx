import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { AnalyticsReport } from '~/features/analytics/components/analytics-report'

export default async function ReportsPage() {
  return (
    <Tabs defaultValue="spending" className="flex h-full w-full flex-col">
      <TabsList>
        <TabsTrigger value="spending">Spending</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>
      <TabsContent value="spending" className="overflow-y-auto">
        <AnalyticsReport reportFor="spending" title="Spending by category" />
      </TabsContent>
      <TabsContent value="income" className="overflow-y-auto">
        <AnalyticsReport reportFor="income" title="Income by Category" />
      </TabsContent>
    </Tabs>
  )
}
