import { generatePromptForSingleTransaction } from './prompts'
import type { Transaction } from './types'

/**
 * The LLM has a token limit of 2048 ~ 8000 character. Leaving 2000 characters for
 * system prompt, we have to process transaction in 6000 characters chunk.
 * @param transactions The whole list of transactions
 * @param maxChars The max characters allowed for each chunk
 * @returns The chunked transactions
 */
function chunkTransactions(transactions: Transaction[], maxChars = 6000) {
  const chunks: Transaction[][] = []
  let current: Transaction[] = []
  let charCount = 0

  for (const [index, tx] of transactions.entries()) {
    const txString = generatePromptForSingleTransaction(index, tx)
    if (charCount + txString.length > maxChars) {
      chunks.push(current)
      current = []
      charCount = 0
    }
    current.push(tx)
    charCount += txString.length
  }
  if (current.length > 0) chunks.push(current)
  return chunks
}

export { chunkTransactions }
