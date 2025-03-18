import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  subtitle?: ReactNode
}

export function AuthFormHeader({ title, subtitle }: Props) {
  return (
    <div className="grid items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm text-balance">{subtitle}</p>
      )}
    </div>
  )
}
