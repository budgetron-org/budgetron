import { Prisma, PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import type { TransactionOptionalDefaults } from '../schemas'
import { accounts } from './account'
import { categories } from './category'
import { user } from './user'

const prisma = new PrismaClient()

// Helper function to generate a random date in a year or month
function getRandomDateIn(year: number, month?: number) {
  const start = new Date(year, month ?? 0, 1)
  const end = new Date(year, month ?? 11, 31)
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

// Helper function to get a random element from an array
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Map categories for quick lookup
const categoryMap = {
  expense: categories.filter((c) => c.type === 'expense'),
  income: categories.filter((c) => c.type === 'income'),
}

// Realistic descriptions based on category
const descriptions = {
  'Home & Utilities': [
    'Paid electricity bill',
    'Water bill payment',
    'Monthly rent',
  ],
  Transportation: [
    'Uber ride to work',
    'Gas station refill',
    'Car repair service',
  ],
  Groceries: [
    'Bought groceries at Costco',
    'Weekly grocery shopping at Walmart',
  ],
  'Personal & Family Care': [
    'Haircut at local salon',
    'Bought skincare products',
  ],
  Health: ['Paid for dental checkup', 'Bought prescription medicine'],
  Insurance: ['Monthly health insurance premium', 'Car insurance renewal'],
  'Restaurants & Dining': ['Dinner at Olive Garden', 'Lunch at McDonald’s'],
  Shopping: ['Bought new shoes online', 'Purchased clothes from Zara'],
  Entertainment: ['Netflix subscription', 'Movie night at AMC theaters'],
  Travel: ['Booked flight to New York', 'Hotel stay for vacation'],
  Finance: ['Credit card interest payment', 'Transferred money to savings'],
  'Cash, Checks & Misc': ['Withdrew cash from ATM', 'Deposited a check'],
  Uncategorized: ['Miscellaneous expenses'],
  Salary: ['Salary deposit from employer', 'Monthly paycheck received'],
  Deposits: ['Freelance payment received', 'Dividend payout from investments'],
} as Record<string, string[]>

// Generate transactions for a yer or month
function randomTransactions(count: number, year: number, month: number) {
  return Array.from({ length: count }, () => {
    const isExpense = Math.random() > 0.2 // 80% chance it's an expense
    const selectedCategory = getRandomElement<(typeof categories)[number]>(
      isExpense ? categoryMap.expense : categoryMap.income,
    )
    const selectedAccount = getRandomElement(accounts)
    const description = getRandomElement(
      descriptions[selectedCategory.name] ?? ['Miscellaneous transaction'],
    )

    return {
      id: randomUUID() as string,
      externalId: randomUUID() as string,
      userId: user.id,
      householdId: null,
      description,
      currency: 'USD',
      accountId: selectedAccount.id,
      amount: new Prisma.Decimal(
        (Math.random() * (isExpense ? 500 : 5000) + 10).toFixed(2),
      ), // Random amount
      type: isExpense ? 'expense' : 'income',
      date: getRandomDateIn(year, month),
      categoryId: selectedCategory.id,
    } satisfies TransactionOptionalDefaults
  })
}

const transactions = [
  ...[...Array.from({ length: 12 }).keys()].flatMap((month) =>
    randomTransactions(20, 2023, month),
  ),
  ...[...Array.from({ length: 12 }).keys()].flatMap((month) =>
    randomTransactions(20, 2024, month),
  ),
  ...[...Array.from({ length: 2 }).keys()].flatMap((month) =>
    randomTransactions(20, 2025, month),
  ),
]

async function seedTransactionTable() {
  console.log('Seeding Transaction table...')

  await prisma.transaction.createMany({
    data: transactions,
  })

  console.log(`Transaction table seeded with ${transactions.length} rows.`)
}

export { seedTransactionTable }
