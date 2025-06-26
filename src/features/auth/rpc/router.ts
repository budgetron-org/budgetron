import {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signInWithOAuth,
  signInWithSocial,
  signOut,
  signUp,
} from './procedures'

const authRouter = {
  forgotPassword,
  resetPassword,
  session,
  signIn,
  signInWithOAuth,
  signInWithSocial,
  signUp,
  signOut,
}

export { authRouter }
