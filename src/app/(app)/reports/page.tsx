import { Card, CardHeader } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default async function ReportsPage() {
  return (
    <Tabs defaultValue="spending" className="flex h-full w-full flex-col">
      <TabsList>
        <TabsTrigger value="spending">Spending</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>
      <TabsContent value="spending">
        <Card>
          <CardHeader>Filters</CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
