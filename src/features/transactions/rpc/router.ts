import {
  create,
  createMany,
  getByDateRange,
  getCategorySpend,
  getMonthlySummary,
  parseOFX,
} from './procedures'

const transactionsRouter = {
  create,
  createMany,
  getByDateRange,
  getCategorySpend,
  getMonthlySummary,
  parseOFX,
}

export { transactionsRouter }
