import { BudgetForm } from './_components/budget-form'

export default function BudgetManagePage() {
  return (
    <div className="grid w-full gap-4">
      <h2 className="text-3xl font-semibold">Manage Budget</h2>
      <BudgetForm />
    </div>
  )
}
