export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dollar', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Rupee', locale: 'en-IN' },
] as const
export const CURRENCY_CODES = ['USD', 'INR'] as const

export type Currency = (typeof CURRENCIES)[number]
