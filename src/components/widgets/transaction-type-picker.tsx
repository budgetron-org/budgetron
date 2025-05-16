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
    Pick<ComponentProps<typeof SelectTrigger>, 'aria-label'> {}

function TransactionTypePicker({
  'aria-label': ariaLabel,
  defaultValue,
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
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TransactionTypePicker }
