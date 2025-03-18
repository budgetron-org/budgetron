import { randomUUID } from 'node:crypto'
import type { HouseholdOptionalDefaults } from '../schemas'
import { prisma } from './client'
import { user } from './user'

const households = [
  {
    id: randomUUID(),
    currency: 'USD',
    name: 'Home',
    ownerId: user.id,
    icon: 'house',
  },
  {
    id: randomUUID(),
    currency: 'USD',
    name: 'Friends',
    ownerId: user.id,
    icon: 'users',
  },
  {
    id: randomUUID(),
    currency: 'USD',
    name: 'Work',
    ownerId: user.id,
    icon: 'briefcase',
  },
] satisfies HouseholdOptionalDefaults[]

async function seedHouseholdTable() {
  console.log('Seeing Household table...')
  await prisma.household.createMany({
    data: households,
  })
  console.log(`Household table seeded with ${households.length} rows.`)
}

export { households, seedHouseholdTable }
