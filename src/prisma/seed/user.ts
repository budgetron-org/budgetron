import type { UserOptionalDefaults } from '../schemas'
import { prisma } from './client'

const user = {
  clerkId: 'user_2teXcNLRZbHQqDMrp0mHYldEpEx',
  id: 'b373494b-82f0-44db-8614-3a10068fc3e5', // do not use UUID here as that requires changing in clerk
} satisfies UserOptionalDefaults

async function seedUserTable() {
  console.log('Seeing User table...')
  await prisma.user.create({
    data: user,
  })
  console.log(`User table seeded with dummy user.`)
}

export { seedUserTable, user }
