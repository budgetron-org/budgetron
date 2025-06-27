import {
  deleteAccount,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateInfo,
  updatePassword,
} from './procedures'

const userRouter = {
  deleteAccount,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateInfo,
  updatePassword,
}

export { userRouter }
