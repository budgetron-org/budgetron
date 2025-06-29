import { createOpenAI } from '@ai-sdk/openai'

import { env } from '~/env/server'
import { isAIServiceEnabled } from '~/server/ai/utils'

/**
 * Create OpenAI compatible provider.
 */
const provider = createOpenAI({
  baseURL: env.OPENAI_COMPATIBLE_BASE_URL,
  apiKey: env.OPENAI_COMPATIBLE_API_KEY,
  compatibility:
    env.OPENAI_COMPATIBLE_PROVIDER === 'openai' ? 'strict' : 'compatible', // make sure to use 'strict' for actual OpenAI
  name: env.OPENAI_COMPATIBLE_PROVIDER,
})

/**
 * Create OpenAI compatible model.
 */
const model = isAIServiceEnabled(env)
  ? provider(env.OPENAI_COMPATIBLE_MODEL, {
      structuredOutputs: true,
    })
  : null

export { model }
