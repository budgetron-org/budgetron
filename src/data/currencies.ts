export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dollar', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Rupee', locale: 'en-IN' },
]

export type Currency = (typeof CURRENCIES)[number]
