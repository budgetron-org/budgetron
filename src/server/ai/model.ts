import { createOllama } from 'ollama-ai-provider'
import { env } from '~/env/server'

const ollama = createOllama({
  baseURL: env.OLLAMA_URL,
})
const model = ollama('llama3.1', { structuredOutputs: true })

export { model }
