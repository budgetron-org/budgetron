import {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signOut,
  signUp,
} from './procedures'

const authRouter = {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signUp,
  signOut,
}

export { authRouter }
