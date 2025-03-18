import { subMonths } from 'date-fns'
import type { IconName } from 'lucide-react/dynamic'

export const MAX_STATS_DATE_RANGE_DAYS = 365
export const PERSONAL_LABEL = 'Personal'
export const PERSONAL_ICON: IconName = 'user'

export const MONTH_PICKER_START = subMonths(Date.now(), 12)
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const
