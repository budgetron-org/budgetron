import 'server-only'

import type { Identify } from 'flags'
import { dedupe, flag } from 'flags/next'

import { db } from '~/server/db'

type SignUpEntity = {
  host: string | null
}
const identifySignup = dedupe<Parameters<Identify<SignUpEntity>>, SignUpEntity>(
  ({ headers }) => {
    const host = headers.get('host')
    return { host }
  },
)
const signupFeatureFlag = flag<boolean, SignUpEntity>({
  key: 'signup',
  defaultValue: false,
  identify: identifySignup,
  async decide({ entities }) {
    if (typeof entities?.host !== 'string') return false
    const allowed = await db.query.FeatureFlagsTable.findFirst({
      where: (t, { eq }) => eq(t.name, 'allow_signup'),
    })
    if (!allowed) return false
    // The signup feature flag is enabled if:
    // 1. The flag is enabled
    // 2. The domain is in the allowed domains or the allowed domains contains a wildcard
    return (
      allowed.enabled &&
      (allowed.domains.includes(entities.host) || allowed.domains.includes('*'))
    )
  },
})

export { signupFeatureFlag }
