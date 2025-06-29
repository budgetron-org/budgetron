import { env } from '~/env/server'

type Env = typeof env

/**
 * Checks if the blob storage is enabled by checking if the BLOB_READ_WRITE_TOKEN is set.
 * @returns True if the blob storage is enabled, false otherwise.
 */
function isBlobStorageEnabled(
  env: Env,
): env is Env & { BLOB_READ_WRITE_TOKEN: string } {
  return env.BLOB_READ_WRITE_TOKEN != null
}

export { isBlobStorageEnabled }
