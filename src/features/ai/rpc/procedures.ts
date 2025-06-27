import { healthCheck } from '~/server/ai/service/health'
import { publicProcedure } from '~/server/api/rpc'

const health = publicProcedure.handler(() => healthCheck())

export { health }
