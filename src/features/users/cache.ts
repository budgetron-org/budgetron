import { getGlobalTag, getIdTag } from '~/lib/cache'
import { revalidateTag } from 'next/cache'

export function getUserGlobalTag() {
  return getGlobalTag('users')
}

export function getUserIdTag(userId: string) {
  return getIdTag('users', userId)
}

export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalTag())
  revalidateTag(getUserIdTag(id))
}
