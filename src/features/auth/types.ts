import type { auth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/shared'

type Session = NonNullable<AwaitedReturnType<typeof auth.api.getSession>>

export type { Session }
