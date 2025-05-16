import { listAccounts, updateInfo, updatePassword } from './procedures'

const userRouter = {
  listAccounts,
  updatePassword,
  updateInfo,
}

export { userRouter }
