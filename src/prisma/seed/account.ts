import { randomUUID } from 'node:crypto'
import type { AccountOptionalDefaults } from '../schemas'
import { prisma } from './client'
import { user } from './user'

const accounts = [
  {
    id: randomUUID(),
    name: 'BoFA - 4471',
    userId: user.id,
  },
  {
    id: randomUUID(),
    name: 'Wells - 3344',
    userId: user.id,
  },
  {
    id: randomUUID(),
    name: 'Amex - 90007',
    userId: user.id,
  },
] satisfies AccountOptionalDefaults[]

async function seedAccountTable() {
  console.log('Seeing Account table...')
  await prisma.account.createMany({
    data: accounts,
  })
  console.log(`Account table seeded with ${accounts.length} rows.`)
}

export { accounts, seedAccountTable }
