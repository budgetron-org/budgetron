import type { auth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/generic'

type User = NonNullable<AwaitedReturnType<typeof auth.api.getSession>>['user']

export type { User }
