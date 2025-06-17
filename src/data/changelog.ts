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
    version: '0.2.1',
    date: '2025-06-17',
    description: 'Minor UI improvements',
    changes: [],
    features: [],
    fixes: [
      {
        title: 'Fixed overflow issues',
        description:
          'Before this fix, the bank accounts and budgets pages would overflow when there were too many items. Now it does not.',
      },
    ],
    breakingChanges: [],
  },
  {
    version: '0.2.0',
    date: '2025-06-17',
    description: 'New budget feature and other minor improvements',
    changes: [
      {
        title: 'Bank accounts page is now available',
        description:
          'You can now create and manage bank accounts from this page. Previously, this was done in the dashboard.',
      },
    ],
    features: [
      {
        title: 'Budget feature is now available',
        description:
          'You can now create and manage budgets to track your expenses.',
      },
    ],
    fixes: [
      {
        title: 'Minor UI improvements',
        description:
          'Minor UI improvements including chart and table improvements.',
      },
    ],
    breakingChanges: [],
  },
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
