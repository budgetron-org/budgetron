import { create, createMany, getByDateRange, parseOFX } from './procedures'

const transactionsRouter = {
  create,
  createMany,
  getByDateRange,
  parseOFX,
}

export { transactionsRouter }
