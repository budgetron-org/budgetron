import 'server-only'

import { put } from '@vercel/blob'

import { env } from '~/env/server'
import { isBlobStorageEnabled } from './util'

type UploadOptions = {
  path: string
  fileName: string
  file: File
}
/**
 * Uploads a file to Vercel Blob Storage.
 * We are using Vercel Blob Storage here as it is free and easy to use.
 * This can be replaced with any other blob storage provider, like AWS S3, Google Cloud Storage, etc.
 * This is mainly used for storing profile pictures.
 * @param path - The path where the file will be stored.
 * @param fileName - The name of the file.
 * @param file - The file to upload.
 * @returns The URL of the uploaded file.
 */
async function upload({ path, fileName, file }: UploadOptions) {
  if (!isBlobStorageEnabled(env)) {
    throw new Error(
      'Cannot upload file as blob storage is not enabled. Please contact support.',
    )
  }

  const blob = await put(`${path}/${fileName}`, file, {
    access: 'public',
    addRandomSuffix: true,
    token: env.BLOB_READ_WRITE_TOKEN,
  })
  return {
    url: blob.url,
  }
}

export { upload }
