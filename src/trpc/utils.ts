import { getTRPCErrorFromUnknown, TRPCError } from '@trpc/server'
import 'server-only'

export function getTRPCError(
  statusCode: number,
  message?: string,
  cause?: unknown,
) {
  // BAD_REQUEST	The server cannot or will not process the request due to something that is perceived to be a client error.	400
  // UNAUTHORIZED	The client request has not been completed because it lacks valid authentication credentials for the requested resource.	401
  // FORBIDDEN	The server was unauthorized to access a required data source, such as a REST API.	403
  // NOT_FOUND	The server cannot find the requested resource.	404
  // TIMEOUT	The server would like to shut down this unused connection.	408
  // CONFLICT	The server request resource conflict with the current state of the target resource.	409
  // PRECONDITION_FAILED	Access to the target resource has been denied.	412
  // PAYLOAD_TOO_LARGE	Request entity is larger than limits defined by server.	413
  // METHOD_NOT_SUPPORTED	The server knows the request method, but the target resource doesn't support this method.	405
  // CLIENT_CLOSED_REQUEST	Access to the resource has been denied.	499
  // INTERNAL_SERVER_ERROR	An unspecified error occurred.	500

  if (statusCode === 400) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: message ?? 'Bad request',
      cause,
    })
  }
  if (statusCode === 401) {
    return new TRPCError({
      code: 'UNAUTHORIZED',
      message: message ?? 'Unauthorized',
      cause,
    })
  }
  if (statusCode === 403) {
    return new TRPCError({
      code: 'FORBIDDEN',
      message: message ?? 'Forbidden',
      cause,
    })
  }
  if (statusCode === 404) {
    return new TRPCError({
      code: 'NOT_FOUND',
      message: message ?? 'Not found',
      cause,
    })
  }
  if (statusCode === 408) {
    return new TRPCError({
      code: 'TIMEOUT',
      message: message ?? 'Timeout',
      cause,
    })
  }
  if (statusCode === 409) {
    return new TRPCError({
      code: 'CONFLICT',
      message: message ?? 'Conflict',
      cause,
    })
  }
  if (statusCode === 412) {
    return new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: message ?? 'Precondition failed',
      cause,
    })
  }
  if (statusCode === 413) {
    return new TRPCError({
      code: 'PAYLOAD_TOO_LARGE',
      message: message ?? 'Payload too large',
      cause,
    })
  }
  if (statusCode === 405) {
    return new TRPCError({
      code: 'METHOD_NOT_SUPPORTED',
      message: message ?? 'Method not supported',
      cause,
    })
  }
  if (statusCode === 499) {
    return new TRPCError({
      code: 'CLIENT_CLOSED_REQUEST',
      message: message ?? 'Client closed request',
      cause,
    })
  }
  if (statusCode === 500) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: message ?? 'Internal server error',
      cause,
    })
  }

  // Catch All
  return getTRPCErrorFromUnknown(cause)
}
