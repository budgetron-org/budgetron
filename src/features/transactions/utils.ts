import type { MonthlySummary } from './types'

function fillMissingMonthsSummary(raw: MonthlySummary[], from: Date, to: Date) {
  const filled: MonthlySummary[] = []

  const current = new Date(from.getFullYear(), from.getMonth(), 1)
  const end = new Date(to.getFullYear(), to.getMonth(), 1)

  const lookup = new Map(raw.map((r) => [`${r.year}-${r.month}`, r]))

  while (current <= end) {
    const month = current.getMonth() + 1
    const year = current.getFullYear()
    const key = `${year}-${month}`

    const existing = lookup.get(key)

    filled.push(existing ?? { year, month, income: 0, expense: 0 })

    current.setMonth(current.getMonth() + 1)
  }

  return filled
}

export { fillMissingMonthsSummary }
