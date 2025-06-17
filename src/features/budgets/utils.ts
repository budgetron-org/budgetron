import { eachMonthOfInterval, format } from 'date-fns'
import type { BudgetDetails } from './types'

function fillMissingMonthlyAverages(
  data: BudgetDetails['monthlyAverages'],
  start: Date,
  end: Date,
): BudgetDetails['monthlyAverages'] {
  const allMonths = eachMonthOfInterval({ start, end }).map((date) =>
    format(date, 'yyyy-MM'),
  )

  const dataMap = new Map(data.map((entry) => [entry.month, entry.average]))

  return allMonths.map((month) => ({
    month,
    average: dataMap.get(month) ?? 0,
  }))
}

export { fillMissingMonthlyAverages }
