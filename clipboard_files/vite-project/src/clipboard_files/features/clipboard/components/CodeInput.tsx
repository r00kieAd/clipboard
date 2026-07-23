import { memo, useCallback, useMemo } from 'react'

type CodeInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  isInvalid?: boolean
  length?: number
}

export const CodeInput = memo(function CodeInput({
  label,
  value,
  onChange,
  isInvalid = false,
  length = 4,
}: CodeInputProps) {
  const values = useMemo(
    () =>
      Array.from({ length }, (_, index) => {
        return value[index] ?? ''
      }),
    [length, value],
  )

  const handleChange = useCallback(
    (index: number, nextValue: string) => {
      const digit = nextValue.replace(/\D/g, '').slice(-1)
      const nextValues = [...values]

      nextValues[index] = digit
      onChange(nextValues.join('').slice(0, length))
    },
    [length, onChange, values],
  )

  return (
    <fieldset className={`code-input ${isInvalid ? 'code-input--invalid' : ''}`}>
      <legend>{label}</legend>
      <div className="code-input__boxes">
        {values.map((digit, index) => (
          <input
            aria-label={`${label} digit ${index + 1}`}
            inputMode="numeric"
            key={index}
            maxLength={1}
            pattern="[0-9]*"
            type="text"
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
          />
        ))}
      </div>
    </fieldset>
  )
})
