import { memo, useCallback, useMemo, useState } from 'react'
import type { ClipboardFormat } from '../types'

type FormatOption = {
  value: ClipboardFormat
  label: string
  iconClassName: string
}

const formatOptions: FormatOption[] = [
  {
    value: 'plain-text',
    label: 'Plain text',
    iconClassName: 'fa-solid fa-text-height',
  },
  {
    value: 'markdown',
    label: 'Markdown',
    iconClassName: 'fa-brands fa-markdown',
  },
  {
    value: 'code',
    label: 'Code',
    iconClassName: 'fa-solid fa-code',
  },
]

type FormatDropdownProps = {
  value: ClipboardFormat
  onChange: (format: ClipboardFormat) => void
}

export const FormatDropdown = memo(function FormatDropdown({
  value,
  onChange,
}: FormatDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = useMemo(
    () => formatOptions.find((option) => option.value === value) ?? formatOptions[0],
    [value],
  )

  const toggleOpen = useCallback(() => {
    setIsOpen((currentValue) => !currentValue)
  }, [])

  const handleSelect = useCallback(
    (format: ClipboardFormat) => {
      onChange(format)
      setIsOpen(false)
    },
    [onChange],
  )

  return (
    <div className="format-dropdown">
      <button
        type="button"
        className="format-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select note format"
        onClick={toggleOpen}
      >
        <i className={selectedOption.iconClassName} aria-hidden="true" />
        <span>{selectedOption.label}</span>
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="format-dropdown__menu" role="listbox" aria-label="Note format">
          {formatOptions.map((option) => (
            <button
              type="button"
              className="format-dropdown__option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              role="option"
            >
              <i className={option.iconClassName} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
})
