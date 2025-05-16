import { env } from '~/env/server'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: env.BASE_PATH,
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
