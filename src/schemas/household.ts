import { iconNames, type IconName } from 'lucide-react/dynamic'
import { z } from 'zod'

import { HouseholdSchema } from '@/prisma/schemas'

export const CreateHouseholdSchema = HouseholdSchema.extend({
  name: HouseholdSchema.shape.name
    .min(3, { message: 'Household name must be at least 3 characters.' })
    .max(16, { message: 'Household name must be less than 16 characters.' }),
  icon: z.custom<IconName>((value) => iconNames.includes(value)),
}).pick({
  currency: true,
  icon: true,
  name: true,
})
