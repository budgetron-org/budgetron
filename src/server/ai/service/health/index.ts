import { generateText } from 'ai'

import { env } from '~/env/server'
import { model } from '~/server/ai/model'
import { isAIServiceEnabled } from '~/server/ai/utils'

let lastCheckTime: number | null = null
let lastCheckResult: boolean = false
const HEALTH_CHECK_TIMEOUT = 10_000 // 10 seconds
const RATE_LIMIT = 60_000 // 1 request per minute
async function healthCheck() {
  const now = Date.now()

  if (lastCheckTime && now - lastCheckTime < RATE_LIMIT) {
    return lastCheckResult // return cached result
  }

  if (!isAIServiceEnabled(env) || model == null) {
    lastCheckResult = false
    lastCheckTime = now
    return false
  }

  const abortController = new AbortController()
  const timeout = setTimeout(
    () => abortController.abort('Timeout'),
    HEALTH_CHECK_TIMEOUT,
  )
  try {
    const response = await generateText({
      model,
      prompt: 'ping',
      maxOutputTokens: 1,
      abortSignal: abortController.signal,
    })
    lastCheckResult = Boolean(response.text)
  } catch (error) {
    if (env.NODE_ENV === 'development')
      console.error(`AI service is not healthy: ${error}`)
    lastCheckResult = false
  } finally {
    lastCheckTime = now
    clearTimeout(timeout)
  }

  return lastCheckResult
}

export { healthCheck }
