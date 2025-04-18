import { createTRPCRouter } from '~/server/api/trpc'
import { getSession, signIn, signUp } from './procedures'

const authRouter = createTRPCRouter({
  getSession,
  signIn,
  signUp,
})

export { authRouter }
