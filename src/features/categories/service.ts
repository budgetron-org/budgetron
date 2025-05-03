import { db } from '~/server/db'

type FindAllCategoriesOptions = {
  userId: string
  groupId?: string
}
async function findAllCategories({
  userId,
  groupId,
}: FindAllCategoriesOptions) {
  const queryResult = await db.query.CategoryTable.findMany({
    with: {
      parent: true,
    },
    where: (t, { and, eq, isNull, or }) =>
      groupId
        ? or(eq(t.groupId, groupId), and(isNull(t.groupId), isNull(t.userId)))
        : or(eq(t.userId, userId), and(isNull(t.userId))),
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

export { findAllCategories }
