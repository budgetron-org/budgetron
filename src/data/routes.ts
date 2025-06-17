const PATHS = {
  CHANGELOG: '/changelog',
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/dashboard/transactions',
  TRANSACTIONS_UPLOAD: '/dashboard/transactions/upload',
  BUDGETS: '/dashboard/budgets',
  ACCOUNT: '/dashboard/account',
  REPORTS: '/dashboard/reports',
  REPORTS_CATEGORIES: '/dashboard/reports/categories',
  REPORTS_CASH_FLOW: '/dashboard/reports/cash-flow',
} as const

const PATH_TITLE_MAP = {
  dashboard: ['Dashboard'],
  'dashboard/transactions': ['Transactions'],
  'dashboard/transactions/upload': ['Transactions', 'Upload'],
  'dashboard/budgets': ['Budgets'],
  'dashboard/budgets/:budgetId': ['Budgets', 'Details'],
  'dashboard/reports': ['Reports'],
  'dashboard/reports/categories': ['Reports', 'Categories'],
  'dashboard/reports/cash-flow': ['Reports', 'Cash Flow'],
} as const

export { PATH_TITLE_MAP, PATHS }
