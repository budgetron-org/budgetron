import { env } from '~/env/server'

type Env = typeof env

/**
 * Checks if the AI service is enabled by checking if all the required environment variables are set.
 * @returns True if the AI service is enabled, false otherwise.
 */
function isAIServiceEnabled(env: Env): env is Env & {
  OPENAI_COMPATIBLE_PROVIDER: string
  OPENAI_COMPATIBLE_API_KEY: string
  OPENAI_COMPATIBLE_MODEL: string
  OPENAI_COMPATIBLE_BASE_URL: string
} {
  return (
    env.OPENAI_COMPATIBLE_PROVIDER != null &&
    env.OPENAI_COMPATIBLE_API_KEY != null &&
    env.OPENAI_COMPATIBLE_MODEL != null &&
    env.OPENAI_COMPATIBLE_BASE_URL != null
  )
}

export { isAIServiceEnabled }
