import { createOllama } from 'ollama-ai-provider'
import { env } from '~/env/server'

/**
 * Local AI provider.
 * We are using Ollama here as it is run locally and free. This is useful
 * when you are concerned about privacy and security.
 * This can be replaced with any other AI provider, like OpenAI, Anthropic, etc.
 */
const ollama = createOllama({
  baseURL: env.OLLAMA_URL,
})

/**
 * AI model.
 */
const model = ollama(env.OLLAMA_MODEL, { structuredOutputs: true })

export { model }
