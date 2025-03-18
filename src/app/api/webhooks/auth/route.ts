import { user } from '@/db/user'
import { env } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { USER_METADATA } from '@/lib/user-metadata'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

export async function POST(request: Request) {
  const SIGNING_SECRET = env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local',
    )
  }

  // Get headers
  const headerPayload = await headers()
  const svixID = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svixID || !svixSignature || !svixTimestamp) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)
  let event: WebhookEvent

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      'svix-id': svixID,
      'svix-signature': svixSignature,
      'svix-timestamp': svixTimestamp,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  switch (event.type) {
    case 'user.created': {
      const { data } = event
      const user = await prisma.user.create({
        data: {
          clerkId: data.id,
          settings: {
            create: {
              currency: 'USD',
            },
          },
        },
      })

      // Set user metadata to indicate the user is new and has to setup initial things
      // like the first household
      const clerk = await clerkClient()
      await clerk.users.updateUserMetadata(data.id, {
        publicMetadata: {
          [USER_METADATA.HAS_DONE_SETUP.key]: false,
          [USER_METADATA.APP_USER_ID.key]: user.id,
        },
      })
      break
    }
    case 'user.deleted': {
      const {
        data: { id: clerkId },
      } = event
      if (clerkId) {
        await user.delete({ where: { clerkId } })
      }
      break
    }
    default:
      console.warn('Warning: Unsupported webhook event received:', event.type)
  }

  return new Response('Success', { status: 200 })
}
