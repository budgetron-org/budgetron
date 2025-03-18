import { HistorySection } from './_components/history-section'

export default function BudgetPage() {
  return (
    <div className="grid w-full gap-4">
      <h2 className="text-2xl font-bold">Income and Spending History</h2>
      <HistorySection />
    </div>
  )
}
