import type { MONTH_NAMES } from '@/lib/constants'

export type TimeFrame = 'month' | 'year'
export type TimePeriod = { year: number; month: number }

export type MonthName = (typeof MONTH_NAMES)[number]
