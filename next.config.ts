import { env } from '~/env/server'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: env.BASE_PATH,
  /* config options here */
  output: 'standalone',
}

export default nextConfig
