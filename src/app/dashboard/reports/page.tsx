import Link from 'next/link'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { PATHS } from '~/data/routes'

export default async function ReportsPage() {
  return (
    <div className="grid h-full w-full auto-rows-max grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card className="flex flex-col">
        <CardHeader className="flex-1">
          <CardTitle>Category Reports</CardTitle>
          <CardDescription>
            Category reports will show reports of income and expenses grouped by
            category.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={PATHS.REPORTS_CATEGORIES}
            className="text-sm underline underline-offset-4">
            Show report
          </Link>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex-1">
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>
            Cash flow reports will show the cash flow of the account.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={PATHS.REPORTS_CASH_FLOW}
            className="text-sm underline underline-offset-4">
            Show report
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
