import Fuse from 'fuse.js'
import type { NextRequest } from 'next/server'

import { iconData } from '~/data/icons'
import { safeParseNumber } from '~/lib/utils'

const DEFAULT_MAX_ICONS = 50

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('query') ?? ''
  const limit = safeParseNumber(searchParams.get('limit'), DEFAULT_MAX_ICONS)
  const icons = search(query, limit)

  return Response.json(icons)
}

export type GetIconsResponse = ReturnType<typeof search>

const fuse = new Fuse(iconData, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tags', weight: 1 },
  ],
})

function search(query: string, limit: number) {
  if (!query) return iconData.slice(0, limit)
  return fuse.search(query, { limit }).map((r) => r.item)
}
