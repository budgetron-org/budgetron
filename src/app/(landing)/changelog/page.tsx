import { IconArrowLeft } from '@tabler/icons-react'
import { format } from 'date-fns'
import { kebabCase } from 'lodash'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { BrandLogo } from '~/components/widgets/brand-logo'
import { CHANGELOGS } from '~/data/changelog'

export default function Changelog() {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="sticky top-0 w-fit pb-4">
        <BrandLogo size="lg" />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-4">
        <div className="flex gap-4">
          {CHANGELOGS.length > 0 && (
            <div className="sticky top-0 hidden h-fit w-52 flex-col gap-4 md:flex">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <IconArrowLeft />
                </Button>
              </Link>
              <h2 className="text-md font-semibold">On this page</h2>
              <ul className="flex flex-col gap-2">
                {CHANGELOGS.map((change) => (
                  <li
                    key={change.version}
                    className="text-muted-foreground underline underline-offset-4">
                    <Link href={`#${kebabCase(change.version)}`}>
                      v{change.version}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <Link href="/" className="mb-4 md:hidden">
                <Button variant="outline" size="icon">
                  <IconArrowLeft />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Changelog</h1>
              <p className="text-muted-foreground">
                Latest updates and announcements
              </p>
            </div>

            <ul className="flex flex-col gap-2" role="list">
              {CHANGELOGS.length === 0 && (
                <li className="flex flex-col items-center gap-2">
                  <p className="text-muted-foreground py-4 text-2xl">
                    Stay tuned for updates!
                  </p>
                  <Link href="/">
                    <Button variant="outline">
                      <IconArrowLeft /> Back to Home
                    </Button>
                  </Link>
                </li>
              )}
              {CHANGELOGS.map((change) => (
                <li key={change.version} className="flex flex-col gap-2">
                  <h2
                    className="text-xl font-semibold"
                    id={kebabCase(change.version)}>
                    v{change.version}
                    <span className="text-muted-foreground ml-2">
                      ({format(change.date, 'MMMM dd, yyyy')})
                    </span>
                  </h2>
                  <div className="border-muted-foreground/30 ml-2 flex flex-col gap-2 border-l pl-4">
                    <p>{change.description}</p>

                    {change.breakingChanges.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold">
                          Breaking Changes
                        </h3>
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {change.breakingChanges.map((breakingChange) => (
                            <li key={breakingChange.title}>
                              {breakingChange.title}
                              {breakingChange.description && (
                                <p className="text-muted-foreground">
                                  {breakingChange.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {change.features.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold">New Features</h3>
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {change.features.map((feature) => (
                            <li key={feature.title}>
                              {feature.title}
                              {feature.description && (
                                <p className="text-muted-foreground">
                                  {feature.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {change.changes.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold">Changes</h3>
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {change.changes.map((change) => (
                            <li key={change.title}>
                              {change.title}
                              {change.description && (
                                <p className="text-muted-foreground">
                                  {change.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {change.fixes.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold">Bug Fixes</h3>
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {change.fixes.map((fix) => (
                            <li key={fix.title}>
                              {fix.title}
                              {fix.description && (
                                <p className="text-muted-foreground">
                                  {fix.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
