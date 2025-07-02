type Changelog = {
  version:
    | `${number}.${number}.${number}`
    | `${number}.${number}.${number}-beta.${number}`
    | 'NEXT' // MAJOR.MINOR.PATCH
  date: `${number}-${number}-${number}` | 'TBD' // YYYY-MM-DD
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
    version: '0.3.0-beta.2',
    date: '2025-07-02',
    description: 'Introducing Docker support',
    changes: [],
    features: [
      {
        title: 'Docker support',
        description:
          'You can now run the app using Docker. When starting the docker container, the app will automatically run migrations and seed the DB with initial data.',
      },
    ],
    fixes: [],
    breakingChanges: [],
  },
  {
    version: '0.3.0-beta.1',
    date: '2025-07-02',
    description: 'Introducing OAuth support, Gravatar avatars, and more',
    changes: [
      {
        title: 'Google Sign In is now optional',
        description: 'You can now choose to not enable Google Sign In.',
      },
      {
        title: 'Email service is now optional',
        description:
          'You can now choose to not enable email service. Email service is required for password reset and account deletion.',
      },
      {
        title: 'Blob storage is now optional',
        description:
          'You can now choose to not enable blob storage. Blob storage is required for profile picture upload.',
      },
      {
        title: 'AI categorization is now optional',
        description: 'You can now choose to not enable AI categorization.',
      },
    ],
    features: [
      {
        title: 'OAuth support',
        description: 'You can now sign in using custom OAuth providers.',
      },
      {
        title: 'OpenAI compatible AI for categorization',
        description:
          'You can now use AI (any OpenAI compatible provider) to automatically categorize your transactions.',
      },
      {
        title: 'Gravatar avatars',
        description:
          'Avatars are now fetched from Gravatar. Or you can choose your initials as avatar.',
      },
      {
        title: 'New account features',
        description: 'You can now delete, link, and unlink accounts.',
      },
    ],
    fixes: [
      {
        title: 'Fixed query invalidations',
        description:
          'Adding, deleting, and updating transactions are now reflected in the UI correctly without having to refresh the page.',
      },
      {
        title: 'Fixed category report titles',
        description: 'Category report titles are now correct.',
      },
      {
        title: 'UI improvements',
        description: 'Minor UI improvements.',
      },
    ],
    breakingChanges: [
      {
        title: 'AI categorization is not done by OpenAI compatible API',
        description:
          'Previously this was done by Ollama. Now it is done by any OpenAI compatible API. Need to update the environment variables.',
      },
    ],
  },
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
