import { session, signIn, signOut, signUp } from './procedures'

const authRouter = {
  session,
  signIn,
  signUp,
  signOut,
}

export { authRouter }
