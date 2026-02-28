import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

import { env } from '~/env/server'
import { isAIServiceEnabled } from '~/server/ai/utils'

/**
 * Create OpenAI compatible provider.
 */
const provider = isAIServiceEnabled(env)
  ? createOpenAICompatible({
      name: env.OPENAI_COMPATIBLE_PROVIDER,
      baseURL: env.OPENAI_COMPATIBLE_BASE_URL,
      apiKey: env.OPENAI_COMPATIBLE_API_KEY,
      supportsStructuredOutputs: true,
    })
  : null

/**
 * Create OpenAI compatible model.
 */
const model =
  isAIServiceEnabled(env) && provider
    ? provider(env.OPENAI_COMPATIBLE_MODEL)
    : null

export { model }
