type AwaitedReturnType<T extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<T>>

interface NextServerPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type { AwaitedReturnType, NextServerPageProps }
