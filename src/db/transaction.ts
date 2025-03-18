import { Prisma, TransactionType } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type MonthAggregationKey = `${string}_${number}_${number}_${number}`
type YearAggregationKey = `${string}_${number}_${number}`

export const transaction = {
  async create(args: Prisma.TransactionCreateArgs) {
    const { data } = args
    const date = typeof data.date === 'string' ? new Date(data.date) : data.date
    const day = date.getUTCDate()
    const month = date.getUTCMonth()
    const year = date.getUTCFullYear()
    const userId = data.userId!
    const type = data.type ?? 'expense'
    const amount = data.amount
    return await prisma.$transaction([
      // Create the user transaction
      prisma.transaction.create(args),

      // Update the month aggregates table
      prisma.monthAggregation.upsert({
        where: {
          userId_day_month_year: {
            userId,
            day,
            month,
            year,
          },
        },

        create: {
          userId,
          day,
          month,
          year,
          income: type === 'income' ? amount : 0,
          spending: type === 'expense' ? amount : 0,
        },

        update: {
          income: {
            increment: type === 'income' ? amount : 0,
          },
          spending: {
            increment: type === 'expense' ? amount : 0,
          },
        },
      }),

      // Update the year aggregates table
      prisma.yearAggregation.upsert({
        where: {
          userId_month_year: {
            userId,
            month,
            year,
          },
        },

        create: {
          userId,
          month,
          year,
          income: type === 'income' ? amount : 0,
          spending: type === 'expense' ? amount : 0,
        },

        update: {
          income: {
            increment: type === 'income' ? amount : 0,
          },
          spending: {
            increment: type === 'expense' ? amount : 0,
          },
        },
      }),
    ])
  },
  async createMany(args: Prisma.TransactionCreateManyArgs) {
    const { data: UNSAFE_data } = args
    const data =
      UNSAFE_data instanceof Array ? UNSAFE_data.slice() : [UNSAFE_data]

    // calculate aggregates for all the transactions
    const monthAggregation = {} as Record<
      MonthAggregationKey,
      { income: Prisma.Decimal; expense: Prisma.Decimal }
    >
    const yearAggregation = {} as Record<
      YearAggregationKey,
      { income: Prisma.Decimal; expense: Prisma.Decimal }
    >
    for (const transaction of data) {
      const date =
        typeof transaction.date === 'string'
          ? new Date(transaction.date)
          : transaction.date
      const day = date.getUTCDate()
      const month = date.getUTCMonth()
      const year = date.getUTCFullYear()
      const userId = transaction.userId!
      const type = transaction.type ?? 'expense'
      const amount = transaction.amount

      const monthAggregationKey = `${userId}_${year}_${month}_${day}` as const
      const yearAggregationKey = `${userId}_${year}_${month}` as const
      if (!(monthAggregationKey in monthAggregation))
        monthAggregation[monthAggregationKey] = {
          income: new Prisma.Decimal(0),
          expense: new Prisma.Decimal(0),
        }
      if (!(yearAggregationKey in yearAggregation))
        yearAggregation[yearAggregationKey] = {
          income: new Prisma.Decimal(0),
          expense: new Prisma.Decimal(0),
        }

      monthAggregation[monthAggregationKey].income = monthAggregation[
        monthAggregationKey
      ].income.add(
        type === 'income' ? new Prisma.Decimal(amount.toString()) : 0,
      )
      monthAggregation[monthAggregationKey].expense = monthAggregation[
        monthAggregationKey
      ].expense.add(
        type === 'expense' ? new Prisma.Decimal(amount.toString()) : 0,
      )

      yearAggregation[yearAggregationKey].income = yearAggregation[
        yearAggregationKey
      ].income.add(
        type === 'income' ? new Prisma.Decimal(amount.toString()) : 0,
      )
      yearAggregation[yearAggregationKey].expense = yearAggregation[
        yearAggregationKey
      ].expense.add(
        type === 'expense' ? new Prisma.Decimal(amount.toString()) : 0,
      )
    }

    return await prisma.$transaction([
      // Create the transactions
      prisma.transaction.createMany(args),

      // Update the month aggregates
      ...Object.entries(monthAggregation).map(([key, value]) =>
        prisma.monthAggregation.upsert({
          where: {
            userId_day_month_year: parseAggregateKeys(
              key as MonthAggregationKey,
            ),
          },

          create: {
            ...parseAggregateKeys(key as MonthAggregationKey),
            income: value.income,
            spending: value.expense,
          },

          update: {
            income: {
              increment: value.income,
            },
            spending: {
              increment: value.expense,
            },
          },
        }),
      ),

      // Update the year aggregates
      ...Object.entries(yearAggregation).map(([key, value]) =>
        prisma.yearAggregation.upsert({
          where: {
            userId_month_year: parseAggregateKeys(key as YearAggregationKey),
          },

          create: {
            ...parseAggregateKeys(key as YearAggregationKey),
            income: value.income,
            spending: value.expense,
          },

          update: {
            income: {
              increment: value.income,
            },
            spending: {
              increment: value.expense,
            },
          },
        }),
      ),
    ])
  },
  findAll(args: Prisma.TransactionFindManyArgs) {
    return prisma.transaction.findMany(args)
  },
  getTotalsByTypeForUser(userId: string, from: Date, to: Date) {
    return prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: from, lte: to } },
      _sum: {
        amount: true,
      },
    })
  },
  getSummaryByCategory(
    userId: string,
    from: Date,
    to: Date,
    type: TransactionType,
  ) {
    return prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: { gte: from, lte: to },
        categoryId: { not: null },
        type,
      },
      _sum: {
        amount: true,
      },
    })
  },
}

function parseAggregateKeys(key: MonthAggregationKey): {
  userId: string
  year: number
  month: number
  day: number
}
function parseAggregateKeys(key: YearAggregationKey): {
  userId: string
  year: number
  month: number
}
function parseAggregateKeys(key: MonthAggregationKey | YearAggregationKey) {
  const [userId, year, month, day] = key.split('_')
  if (day) {
    return {
      userId,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    }
  }
  return { userId, year: Number(year), month: Number(month) }
}
