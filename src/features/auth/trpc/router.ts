import { createTRPCRouter } from '~/server/api/trpc'
import { getSession, signIn, signOut, signUp } from './procedures'

const authRouter = createTRPCRouter({
  getSession,
  signIn,
  signUp,
  signOut,
})

export { authRouter }
