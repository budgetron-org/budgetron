import { IconInfoCircle } from '@tabler/icons-react'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import type { CurrencyCode } from '~/data/currencies'
import { joinCurrencyArray } from '~/lib/utils'

interface MultiCurrencyNoticeProps {
  baseCurrency: CurrencyCode
  additionalCurrencies: CurrencyCode[]
  currencyExchangeAttribution?: {
    text: string
    url: string
  }
}

function MultiCurrencyNotice({
  baseCurrency,
  additionalCurrencies,
  currencyExchangeAttribution,
}: MultiCurrencyNoticeProps) {
  return (
    <Alert>
      <IconInfoCircle />
      <AlertTitle>
        {' '}
        Includes transactions in {joinCurrencyArray(additionalCurrencies)} that
        are converted to {baseCurrency}
      </AlertTitle>

      {currencyExchangeAttribution && (
        <AlertDescription>
          <a
            href={currencyExchangeAttribution.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm underline underline-offset-4">
            {currencyExchangeAttribution.text}
          </a>
        </AlertDescription>
      )}
    </Alert>
  )
}

export { MultiCurrencyNotice }
