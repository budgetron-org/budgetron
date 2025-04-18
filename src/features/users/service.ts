import { eq } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

import { db } from '~/db'
import { UserTable } from '~/db/schema'
import { getUserIdTag, revalidateUserCache } from './cache'

export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [user] = await db
    .insert(UserTable)
    .values(data)
    .onConflictDoUpdate({
      target: [UserTable.authId],
      set: data,
    })
    .returning()
  if (user == null) throw new Error('Error creating new user')
  revalidateUserCache(user.id)
  return user
}

export async function deleteUser(args: { authId: string }) {
  const [user] = await db
    .delete(UserTable)
    .where(eq(UserTable.authId, args.authId))
    .returning()
  if (user == null)
    throw new Error(`Error deleting user{authId=${args.authId}}`)
  revalidateUserCache(user.id)
  return user
}

export async function getUser(args: { id: string }) {
  'use cache'
  cacheTag(getUserIdTag(args.id))

  return db.query.UserTable.findFirst({ where: eq(UserTable.id, args.id) })
}
