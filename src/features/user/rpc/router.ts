import {
  deleteAccount,
  getUserSettings,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateCurrency,
  updateInfo,
  updatePassword,
  verifyEmail,
} from './procedures'

const userRouter = {
  deleteAccount,
  getUserSettings,
  linkAccount,
  listAccounts,
  unlinkAccount,
  updateCurrency,
  updateInfo,
  updatePassword,
  verifyEmail,
}

export { userRouter }
