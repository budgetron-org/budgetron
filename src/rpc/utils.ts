import type { ORPCErrorCode } from '@orpc/client'
import { ORPCError } from '@orpc/server'

// BAD_REQUEST	The server cannot or will not process the request due to something that is perceived to be a client error.	400
// UNAUTHORIZED	The client request has not been completed because it lacks valid authentication credentials for the requested resource.	401
// FORBIDDEN	The server was unauthorized to access a required data source, such as a REST API.	403
// NOT_FOUND	The server cannot find the requested resource.	404
// METHOD_NOT_SUPPORTED	The server knows the request method, but the target resource doesn't support this method.	405
// TIMEOUT	The server would like to shut down this unused connection.	408
// CONFLICT	The server request resource conflict with the current state of the target resource.	409
// PRECONDITION_FAILED	Access to the target resource has been denied.	412
// PAYLOAD_TOO_LARGE	Request entity is larger than limits defined by server.	413
// CLIENT_CLOSED_REQUEST	Access to the resource has been denied.	499
// INTERNAL_SERVER_ERROR	An unspecified error occurred.	500
const STATUS_CODE_ERROR_MAP = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_SUPPORTED',
  408: 'TIMEOUT',
  409: 'CONFLICT',
  412: 'PRECONDITION_FAILED',
  413: 'PAYLOAD_TOO_LARGE',
  499: 'CLIENT_CLOSED_REQUEST',
  500: 'INTERNAL_SERVER_ERROR',
} satisfies Record<number, ORPCErrorCode>

function createRPCErrorFromStatus(
  statusCode: number,
  message?: string,
  cause?: unknown,
) {
  if (statusCode in STATUS_CODE_ERROR_MAP) {
    return new ORPCError(
      STATUS_CODE_ERROR_MAP[statusCode as keyof typeof STATUS_CODE_ERROR_MAP],
      { message, cause },
    )
  }
  return new ORPCError('INTERNAL_SERVER_ERROR', { message, cause })
}

function createRPCErrorFromUnknownError(
  error: unknown,
  fallbackMessage = 'Unknown Error',
) {
  return new ORPCError('INTERNAL_SERVER_ERROR', {
    message: error instanceof Error ? error.message : fallbackMessage,
    cause: error instanceof Error ? error.cause : error,
  })
}

export { createRPCErrorFromStatus, createRPCErrorFromUnknownError }
