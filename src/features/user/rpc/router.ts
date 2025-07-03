import {
  deleteAccount,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateInfo,
  updatePassword,
  verifyEmail,
} from './procedures'

const userRouter = {
  deleteAccount,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateInfo,
  updatePassword,
  verifyEmail,
}

export { userRouter }
