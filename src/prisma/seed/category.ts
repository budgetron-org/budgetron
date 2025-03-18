import { randomUUID } from 'node:crypto'
import type { CategoryOptionalDefaults } from '../schemas'
import { prisma } from './client'

const categories = [
  {
    id: randomUUID(),
    icon: 'house',
    name: 'Home & Utilities',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'car',
    name: 'Transportation',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'shopping-cart',
    name: 'Groceries',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'hand-heart',
    name: 'Personal & Family Care',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'heart-pulse',
    name: 'Health',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'umbrella',
    name: 'Insurance',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'utensils',
    name: 'Restaurants & Dining',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'shopping-bag',
    name: 'Shopping',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'clapperboard',
    name: 'Entertainment',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'plane',
    name: 'Travel',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'circle-dollar-sign',
    name: 'Finance',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'banknote',
    name: 'Cash, Checks & Misc',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'circle-minus',
    name: 'Uncategorized',
    type: 'expense',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'wallet',
    name: 'Salary',
    type: 'income',
    householdId: null,
    userId: null,
  },
  {
    id: randomUUID(),
    icon: 'banknote',
    name: 'Deposits',
    type: 'income',
    householdId: null,
    userId: null,
  },
] satisfies CategoryOptionalDefaults[]

async function seedCategoryTable() {
  console.log('Seeing Category table...')
  await prisma.category.createMany({
    data: categories,
  })
  console.log(`Category table seeded with ${categories.length} rows.`)
}

export { seedCategoryTable, categories }
