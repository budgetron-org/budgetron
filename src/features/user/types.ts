import type { auth } from '~/server/auth'

type User = (typeof auth.$Infer.Session)['user']

export type { User }
