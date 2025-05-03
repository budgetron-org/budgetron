import { create, _delete, getAll, update } from './procedures'

const bankAccountsRouter = {
  create,
  delete: _delete,
  getAll,
  update,
}

export { bankAccountsRouter }
