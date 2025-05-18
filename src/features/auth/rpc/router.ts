import {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signInWithSocial,
  signOut,
  signUp,
} from './procedures'

const authRouter = {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signInWithSocial,
  signUp,
  signOut,
}

export { authRouter }
