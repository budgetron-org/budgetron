import dedent from 'dedent'

import type { Category, Transaction } from './types'

function generatePromptForAvailableCategories(categories: Category[]) {
  return dedent`
    Available categories:
    ${categories.map((c) => `- ${c.parent?.name ? c.parent.name + '/' : ''}${c.name} (${c.type})`).join('\n')}
  `
}

function generatePromptForSingleTransaction(
  index: number,
  transaction: Transaction,
) {
  return `${index}. ${transaction.description} (${transaction.type})`
}

function generatePromptForTransactionsToCategorize(
  transactions: Transaction[],
) {
  return dedent`
    Transactions to categorize:
    ${transactions.map((tx, index) => generatePromptForSingleTransaction(index, tx)).join('\n')}
  `
}

function generateUserPrompt(
  transactions: Transaction[],
  categories: Category[],
) {
  return dedent`
    ${generatePromptForAvailableCategories(categories)}
    
    ${generatePromptForTransactionsToCategorize(transactions)}
    
    Reply in JSON format:
    [
      { index: 0, transaction: '${transactions[0]?.description}', category: '${categories[0]?.parent?.name}/${categories[0]?.name}' },
      ...
    ]
  `
}

const SYSTEM_PROMPT = `
You are a financial assistant that categorizes transactions based on available categories.
Each transaction should be matched to the most appropriate category using description and amount.
Only choose from the Available categories.
`

export { generatePromptForSingleTransaction, generateUserPrompt, SYSTEM_PROMPT }
