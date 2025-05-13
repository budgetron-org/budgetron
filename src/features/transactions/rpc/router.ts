import {
  _delete,
  create,
  createMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
} from './procedures'

const transactionsRouter = {
  create,
  createMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
  delete: _delete,
}

export { transactionsRouter }
