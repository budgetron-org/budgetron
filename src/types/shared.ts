export type AwaitedReturnType<
  T extends (...args: never[]) => Promise<unknown>,
> = Awaited<ReturnType<T>>
