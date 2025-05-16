import { put } from '@vercel/blob'

type UploadOptions = {
  path: string
  fileName: string
  file: File
}
async function upload({ path, fileName, file }: UploadOptions) {
  const blob = await put(`${path}/${fileName}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return {
    url: blob.url,
  }
}

export { upload }
