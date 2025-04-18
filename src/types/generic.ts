export type AwaitedReturnType<
  T extends (...args: never[]) => Promise<unknown>,
> = Awaited<ReturnType<T>>

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; message: string; error?: E }

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

export type Success<T extends Result<unknown>> = Extract<T, { success: true }>
export type Failure<T extends Result<unknown>> = Extract<T, { success: false }>
