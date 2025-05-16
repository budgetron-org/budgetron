import { betterAuth } from 'better-auth'
import { authConfig } from './config'

const auth = betterAuth(authConfig)

export { auth }
