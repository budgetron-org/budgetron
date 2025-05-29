import 'server-only'

import { generateObject } from 'ai'
import Fuse from 'fuse.js'
// TODO: Use Zod 4. Currently cannot use zod 4 as it is not compatible with ai.
import { z } from 'zod'

import { env } from '~/env/server'
import { model } from '~/server/ai/model'
import { generateUserPrompt, SYSTEM_PROMPT } from './prompts'
import type { Category, Transaction } from './types'
import { chunkTransactions } from './utils'

const schema = z.object({
  result: z
    .object({
      index: z.number(),
      category: z.string(),
    })
    .array(),
})

/**
 * Categorizes transactions using AI. Returns the category for each transaction identified by externalId.
 * We use externalId as the key instead of id as the id will only be available after the transaction is saved to the database.
 * We also want to process the transactions when they are uploaded using a file and we want to categorize them
 * before saving them to the database.
 * Also, we want to process the transactions in chunks to avoid token limit issues. For example, the Ollama model
 * has a token limit of 2048 ~ 8000 characters. Leaving 2000 characters for system prompt, we have to process
 * transactions in 6000 characters chunk.
 * @param transactions The transactions to categorize.
 * @param categories The categories to use for categorization.
 * @returns The categorized transactions. The key is the externalId of the transaction and the value is the category.
 */
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
