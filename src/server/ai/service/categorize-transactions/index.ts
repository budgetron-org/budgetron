import { generateObject } from 'ai'
import Fuse from 'fuse.js'
import { z } from 'zod'

import { env } from '~/env/server'
import { model } from '~/server/ai/model'
import { generateUserPrompt, SYSTEM_PROMPT } from './prompts'
import type { Category, Transaction } from './types'
import { chunkTransactions } from './utils'

const schema = z.object({
  result: z.array(
    z.object({
      index: z.number(),
      category: z.string(),
    }),
  ),
})

async function categorizeTransactions(
  transactions: Transaction[],
  categories: Category[],
) {
  const chunks = chunkTransactions(transactions)
  const result: Record<string, Category | null> = {}
  const categoriesFuse = new Fuse(categories, {
    keys: ['name'],
    threshold: 0.3,
    ignoreLocation: true,
    getFn(obj, path) {
      if (Array.isArray(path)) {
        return path.map((p) => {
          if (p === 'name')
            return `${obj.parent?.name ? obj.parent.name + '/' : ''}${obj.name}`
          return String(obj[p as keyof typeof obj] ?? '')
        })
      }
      if (path === 'name')
        return `${obj.parent?.name ? obj.parent.name + '/' : ''}${obj.name}`
      return String(obj[path as keyof typeof obj] ?? '')
    },
  })

  for (const chunk of chunks) {
    try {
      const prompt = generateUserPrompt(chunk, categories)
      const { object } = await generateObject({
        model,
        schema,
        prompt,
        system: SYSTEM_PROMPT,
      })

      // run through the result and map the transactions to category
      for (const aiResult of object.result) {
        const tx = chunk[aiResult.index]
        if (tx?.externalId != null) {
          result[tx.externalId] =
            categoriesFuse.search(aiResult.category)[0]?.item ?? null
        }
      }
    } catch (error) {
      if (env.NODE_ENV === 'development') console.error(error)
      throw new Error('Failed to categorize transactions. Please try again.')
    }
  }

  return result
}

export { categorizeTransactions }
