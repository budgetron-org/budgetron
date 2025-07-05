import {
  _delete,
  create,
  createMany,
  deleteMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
} from './procedures'

const transactionsRouter = {
  create,
  createMany,
  deleteMany,
  getByCategory,
  getByDateRange,
  parseOFX,
  update,
  delete: _delete,
}

export { transactionsRouter }
