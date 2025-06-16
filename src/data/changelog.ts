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

const CHANGELOGS: Changelog[] = []

export { CHANGELOGS }
