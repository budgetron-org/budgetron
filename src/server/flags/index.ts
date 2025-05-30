import 'server-only'

import type { Identify } from 'flags'
import { dedupe, flag } from 'flags/next'

import { db } from '~/server/db'

type SignUpEntity = {
  host: string | null
}
const identifySignup = dedupe<Parameters<Identify<SignUpEntity>>, SignUpEntity>(
  ({ headers }) => {
    if (headers.get('host')) return { host: headers.get('host') }
    if (headers.get('x-host')) return { host: headers.get('x-host') }
    if (headers.get('x-forwarded-host'))
      return { host: headers.get('x-forwarded-host') }
    return { host: null }
  },
)
const signupFeatureFlag = flag<boolean, SignUpEntity>({
  key: 'signup',
  defaultValue: false,
  identify: identifySignup,
  async decide({ entities }) {
    const allowed = await db.query.FeatureFlagsTable.findFirst({
      where: (t, { eq }) => eq(t.name, 'allow_signup'),
    })
    if (!allowed || !allowed.enabled) return false

    // If there are no allowed domains or the allowed domains contains a wildcard, then we allow signup for all domains
    if (allowed.domains.length === 0 || allowed.domains.includes('*'))
      return true

    // If we cannot identify the domain, then we do not allow signup
    if (!entities?.host) return false

    // The signup feature flag is enabled if:
    // 1. The flag is enabled
    // 2. The domain is in the allowed domains
    return allowed.domains.includes(entities.host)
  },
})

export { signupFeatureFlag }
