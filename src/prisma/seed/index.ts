import { seedAccountTable } from './account'
import { seedCategoryTable } from './category'
import { prisma } from './client'
import { seedHouseholdTable } from './household'
import { seedTransactionTable } from './transaction'
import { seedUserTable } from './user'
import { seedUserSettingsTable } from './user-settings'

async function main() {
  // Seed dummy user
  await seedUserTable()
  // Seed settings for dummy user
  await seedUserSettingsTable()
  // Seed household table
  await seedHouseholdTable()
  // Seed category table
  await seedCategoryTable()
  // Seed account table
  await seedAccountTable()
  // Seed transaction table
  // await seedTransactionTable()
}

try {
  console.log('Seeding the DB...')
  await main()
  await prisma.$disconnect()
  console.log('Done!')
} catch (err) {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
}
