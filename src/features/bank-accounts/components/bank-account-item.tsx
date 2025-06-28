import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { getCurrencyFormatter } from '~/lib/format'
import { safeParseNumber } from '~/lib/utils'
import type { BankAccount } from '../types'
import { BankAccountItemOptions } from './bank-account-item-options'

// TODO: Get the currency from User Settings
const currencyFormatter = getCurrencyFormatter('USD')

function BankAccountItem({ bankAccount }: { bankAccount: BankAccount }) {
  return (
    <Card className="h-fit w-full md:w-[300px]">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4 md:items-center">
          <div className="flex min-w-0 flex-col items-start gap-2 md:flex-row md:items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-full truncate text-xl">
                  {bankAccount.name}
                </div>
              </TooltipTrigger>
              <TooltipContent>{bankAccount.name}</TooltipContent>
            </Tooltip>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center justify-between gap-2">
          <Badge>{bankAccount.type}</Badge>
          <BankAccountItemOptions bankAccount={bankAccount} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Account Balance
            <span className="text-muted-foreground text-sm">
              {currencyFormatter.format(safeParseNumber(bankAccount.balance))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { BankAccountItem }
