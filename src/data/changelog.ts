type Changelog = {
  version: `${number}.${number}.${number}` // MAJOR.MINOR.PATCH
  date: `${number}-${number}-${number}` // YYYY-MM-DD
  description: string
  breakingChanges: {
    title: string
    description?: string
  }[]
  changes: {
    title: string
    description?: string
  }[]
  features: {
    title: string
    description?: string
  }[]
  fixes: {
    title: string
    description?: string
  }[]
}

const CHANGELOGS: Changelog[] = [
  {
    version: '0.1.1',
    date: '2025-06-16',
    description: 'Fixes to the transaction form and table',
    changes: [],
    features: [],
    fixes: [
      {
        title: 'Fixed category picker in transaction form',
        description:
          'Before this fix, the category picker would not update when the type was changed. Now it does.',
      },
      {
        title: 'Fixed transaction table key conflicts',
        description:
          'Before this fix, multiple transactions without an account assigned on the same date would cause key conflicts. Now it does not.',
      },
    ],
    breakingChanges: [],
  },
  {
    version: '0.1.0',
    date: '2025-06-16',
    description: 'Initial release',
    changes: [],
    features: [],
    fixes: [],
    breakingChanges: [],
  },
]

export { CHANGELOGS }
