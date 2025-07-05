'use client'

import { IconX } from '@tabler/icons-react'
import {
  createContext,
  forwardRef,
  useCallback,
  useState,
  type ChangeEventHandler,
  type ClipboardEvent,
  type Dispatch,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEventHandler,
  type SetStateAction,
  type SyntheticEvent,
} from 'react'

import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

/**
 * Used for identifying the split char and use will pasting
 */
const SPLITTER_REGEX = /[\n#?=&\t,./-]+/

/**
 * Used for formatting the pasted element for the correct value format to be added
 */
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g

interface TagsInputProps extends HTMLAttributes<HTMLDivElement> {
  name?: string
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
  minItems?: number
}

interface TagsInputContextProps {
  value: string[]
  onValueChange: (value: string[]) => void
  inputValue: string
  setInputValue: Dispatch<SetStateAction<string>>
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
}

const TagInputContext = createContext<TagsInputContextProps | null>(null)

const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      children,
      name,
      value,
      onValueChange,
      placeholder,
      maxItems,
      minItems,
      className,
      dir,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(-1)
    const [inputValue, setInputValue] = useState('')
    const [isValueSelected, setIsValueSelected] = useState(false)
    const [selectedValue, setSelectedValue] = useState('')

    const isInputDisabled = value.length >= (maxItems ?? Infinity)
    const isButtonDisabled = value.length <= (minItems ?? 0)

    const parseMinItems = minItems ?? 0
    const parseMaxItems = maxItems ?? Infinity

    const onValueChangeHandler = useCallback(
      (val: string) => {
        if (!value.includes(val) && value.length < parseMaxItems) {
          onValueChange([...value, val])
        }
      },
      [onValueChange, parseMaxItems, value],
    )

    const removeValue = useCallback(
      (val: string | undefined) => {
        if (val && value.includes(val) && value.length > parseMinItems) {
          onValueChange(value.filter((item) => item !== val))
        }
      },
      [onValueChange, parseMinItems, value],
    )

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const tags = e.clipboardData.getData('text').split(SPLITTER_REGEX)
        const newValue = [...value]
        tags.forEach((item) => {
          const parsedItem = item.replaceAll(FORMATTING_REGEX, '').trim()
          if (
            parsedItem.length > 0 &&
            !newValue.includes(parsedItem) &&
            newValue.length < parseMaxItems
          ) {
            newValue.push(parsedItem)
          }
        })
        onValueChange(newValue)
        setInputValue('')
      },
      [onValueChange, parseMaxItems, value],
    )

    const handleSelect = useCallback(
      (e: SyntheticEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const selection = target.value.substring(
          target.selectionStart ?? 0,
          target.selectionEnd ?? 0,
        )

        setSelectedValue(selection)
        setIsValueSelected(selection === inputValue)
      },
      [inputValue],
    )

    const handleKeyDown = useCallback(
      async (e: KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()

        const moveNext = () => {
          const nextIndex =
            activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1
          setActiveIndex(nextIndex)
        }

        const movePrev = () => {
          const prevIndex =
            activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1
          setActiveIndex(prevIndex)
        }

        const moveCurrent = () => {
          const newIndex =
            activeIndex - 1 <= 0
              ? value.length - 1 === 0
                ? -1
                : 0
              : activeIndex - 1
          setActiveIndex(newIndex)
        }
        const target = e.currentTarget

        // ? Suggest : the multi select should support the same pattern

        switch (e.key) {
          case 'ArrowLeft':
            if (dir === 'rtl') {
              if (value.length > 0 && activeIndex !== -1) {
                moveNext()
              }
            } else {
              if (value.length > 0 && target.selectionStart === 0) {
                movePrev()
              }
            }
            break

          case 'ArrowRight':
            if (dir === 'rtl') {
              if (value.length > 0 && target.selectionStart === 0) {
                movePrev()
              }
            } else {
              if (value.length > 0 && activeIndex !== -1) {
                moveNext()
              }
            }
            break

          case 'Backspace':
          case 'Delete':
            if (value.length > 0) {
              if (activeIndex !== -1 && activeIndex < value.length) {
                removeValue(value[activeIndex])
                moveCurrent()
              } else {
                if (target.selectionStart === 0) {
                  if (selectedValue === inputValue || isValueSelected) {
                    removeValue(value[value.length - 1])
                  }
                }
              }
            }
            break

          case 'Escape':
            const newIndex = activeIndex === -1 ? value.length - 1 : -1
            setActiveIndex(newIndex)
            break

          case 'Enter':
            if (inputValue.trim() !== '') {
              e.preventDefault()
              onValueChangeHandler(inputValue)
              setInputValue('')
            }
            break
        }
      },
      [
        activeIndex,
        dir,
        inputValue,
        isValueSelected,
        onValueChangeHandler,
        removeValue,
        selectedValue,
        value,
      ],
    )

    const mousePreventDefault = useCallback<
      MouseEventHandler<HTMLButtonElement>
    >((event) => {
      event.preventDefault()
      event.stopPropagation()
    }, [])

    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (event) => {
        setInputValue(event.currentTarget.value)
      },
      [],
    )

    return (
      <TagInputContext.Provider
        value={{
          value,
          onValueChange,
          inputValue,
          setInputValue,
          activeIndex,
          setActiveIndex,
        }}>
        <div
          {...props}
          ref={ref}
          dir={dir}
          className={cn(
            'border-input flex flex-wrap items-center gap-1 overflow-hidden rounded-md border bg-transparent p-1 shadow-xs transition-[color,box-shadow]',
            {
              'focus-within:ring-ring focus-within:ring-1 focus-within:outline-none':
                activeIndex === -1,
            },
            className,
          )}>
          {value.map((item, index) => (
            <Badge
              tabIndex={activeIndex !== -1 ? 0 : activeIndex}
              key={item}
              aria-disabled={isButtonDisabled}
              data-active={activeIndex === index}
              className={cn(
                "data-[active='true']:ring-muted-foreground relative flex items-center gap-1 truncate rounded px-1 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[active='true']:ring-2",
              )}
              variant={'secondary'}>
              <span className="text-xs">{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item} option`}
                aria-roledescription="button to remove option"
                disabled={isButtonDisabled}
                onMouseDown={mousePreventDefault}
                onClick={() => removeValue(item)}
                className="disabled:cursor-not-allowed">
                <span className="sr-only">Remove {item} option</span>
                <IconX className="hover:stroke-destructive h-4 w-4" />
              </button>
            </Badge>
          ))}
          <Input
            tabIndex={0}
            aria-label="input tag"
            name={name}
            disabled={isInputDisabled}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            value={inputValue}
            onSelect={handleSelect}
            onChange={activeIndex === -1 ? handleChange : undefined}
            placeholder={placeholder}
            onClick={() => setActiveIndex(-1)}
            className={cn(
              'placeholder:text-muted-foreground h-7 min-w-fit flex-1 border-none px-1 shadow-none outline-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0',
              activeIndex !== -1 && 'caret-transparent',
            )}
          />
        </div>
      </TagInputContext.Provider>
    )
  },
)

TagsInput.displayName = 'TagsInput'

export { TagsInput }
