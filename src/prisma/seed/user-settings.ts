import type { UserSettingsOptionalDefaults } from '../schemas'
import { prisma } from './client'
import { user } from './user'

const userSettings = {
  currency: 'USD',
  userId: user.id,
} satisfies UserSettingsOptionalDefaults

async function seedUserSettingsTable() {
  console.log('Seeing UserSettings table...')
  await prisma.userSettings.create({
    data: userSettings,
  })
  console.log(`UserSetting table seeded for the dummy user.`)
}

export { seedUserSettingsTable }
