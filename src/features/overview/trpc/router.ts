import { createTRPCRouter } from '~/server/api/trpc'
import { stats } from './procedures'

const overviewRouter = createTRPCRouter({
  stats,
})

export { overviewRouter }
