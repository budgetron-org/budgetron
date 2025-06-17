import { _delete, create, details, summary, update } from './procedures'

const budgetsRouter = {
  create,
  details,
  summary,
  delete: _delete,
  update,
}

export { budgetsRouter }
