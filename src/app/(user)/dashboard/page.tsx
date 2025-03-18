import { OverviewSection } from './_components/overview-section'

export default function DashboardPage() {
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
