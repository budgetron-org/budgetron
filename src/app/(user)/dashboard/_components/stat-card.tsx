'use client'

import { useCallback, type ReactNode } from 'react'
import CountUp from 'react-countup'

import { SkeletonWrapper } from '~/components/skeleton-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

type StatCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  formatter: Intl.NumberFormat
  value?: number
  isLoading?: boolean
}
export function StatCard({
  title,
  icon,
  formatter,
  value = 0,
  isLoading,
}: StatCardProps) {
  const formattingFn = useCallback(
    (value: number) => formatter.format(value),
    [formatter],
  )
  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountUp
            preserveValue
            redraw={false}
            end={value}
            decimals={2}
            formattingFn={formattingFn}
            className="text-2xl font-bold"
          />
        </CardContent>
      </Card>
    </SkeletonWrapper>
  )
}
