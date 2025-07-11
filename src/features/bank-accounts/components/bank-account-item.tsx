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
import { getCurrencyMeta } from '~/lib/utils'
import type { BankAccount } from '../types'
import { BankAccountItemOptions } from './bank-account-item-options'

function BankAccountItem({ bankAccount }: { bankAccount: BankAccount }) {
  const currencyFormatter = getCurrencyFormatter(bankAccount.currency)
  return (
    <Card className="h-fit w-full md:w-[300px]">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4 md:items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-1 items-center justify-between gap-2 truncate text-xl">
                <span className="truncate">{bankAccount.name}</span>
                <span className="text-muted-foreground">
                  {getCurrencyMeta(bankAccount.currency).symbol}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{bankAccount.name}</TooltipContent>
          </Tooltip>
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
              {currencyFormatter.format(bankAccount.balance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { BankAccountItem }
