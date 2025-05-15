import type { auth } from '~/server/auth'
import type { AwaitedReturnType } from '~/types/generic'

type Session = NonNullable<AwaitedReturnType<typeof auth.api.getSession>>
type User = Session['user']

export type { Session, User }
