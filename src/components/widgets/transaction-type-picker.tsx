import { type ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { TransactionTypes } from '~/server/db/enums'

interface TransactionTypePickerProps
  extends Pick<
      ComponentProps<typeof Select>,
      'value' | 'defaultValue' | 'onValueChange'
    >,
    Pick<ComponentProps<typeof SelectValue>, 'placeholder'>,
    Pick<ComponentProps<typeof SelectTrigger>, 'aria-label'> {
  disabledOptions?: (typeof TransactionTypes)[number][]
}

function TransactionTypePicker({
  'aria-label': ariaLabel,
  defaultValue,
  disabledOptions,
  onValueChange,
  placeholder,
  value,
}: TransactionTypePickerProps) {
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TransactionTypes?.map((item) => (
          <SelectItem
            key={item}
            value={item}
            disabled={disabledOptions?.includes(item)}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TransactionTypePicker }
