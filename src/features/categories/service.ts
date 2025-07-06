import { and, eq, isNull, not, or } from 'drizzle-orm'

import { db } from '~/server/db'
import type { TransactionTypeEnum } from '~/server/db/schema'
import { CategoryTable } from '~/server/db/schema'

type FindAllCategoriesOptions = {
  userId: string
  groupId?: string
  type?: (typeof TransactionTypeEnum.enumValues)[number]
}
async function findAllCategories({
  userId,
  groupId,
  type,
}: FindAllCategoriesOptions) {
  const unionConditions = [
    and(isNull(CategoryTable.userId), isNull(CategoryTable.groupId)),
    groupId && eq(CategoryTable.groupId, groupId),
    !groupId && eq(CategoryTable.userId, userId),
  ].filter(Boolean)
  const conditions = [
    or(...unionConditions),
    type && eq(CategoryTable.type, type),
  ].filter(Boolean)
  const queryResult = await db.query.CategoryTable.findMany({
    with: {
      parent: true,
    },
    where: and(...conditions),
    orderBy: (t) => [t.name],
  })

  const categories = queryResult.filter((cat) => cat.parentId == null)
  const subcategories = Object.groupBy(
    queryResult.filter((cat) => cat.parentId != null),
    // we filtered out the null above, so parentId should be present
    (cat) => cat.parentId!,
  )

  const results = categories.map((cat) => ({
    ...cat,
    subcategories: subcategories[cat.id] ?? null,
  }))

  return results
}

type FindAllSubCategoriesOptions = {
  userId: string
  groupId?: string
  includeParent?: boolean
  type?: (typeof TransactionTypeEnum.enumValues)[number]
}
async function findAllSubCategories({
  userId,
  groupId,
  type,
}: FindAllSubCategoriesOptions) {
  const unionConditions = [
    and(isNull(CategoryTable.userId), isNull(CategoryTable.groupId)),
    groupId && eq(CategoryTable.groupId, groupId),
    !groupId && eq(CategoryTable.userId, userId),
  ].filter(Boolean)
  const conditions = [
    or(...unionConditions),
    // only want sub-categories
    not(isNull(CategoryTable.parentId)),
    type && eq(CategoryTable.type, type),
  ].filter(Boolean)
  const result = await db.query.CategoryTable.findMany({
    with: {
      parent: true,
    },
    where: and(...conditions),
    orderBy: (t) => [t.name],
  })

  return result
}

export { findAllCategories, findAllSubCategories }
