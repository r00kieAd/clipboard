import { memo, useCallback, useState } from 'react'
import { useClipboard } from '../hooks/useClipboard'

type CopyButtonProps = {
  disabled: boolean
}

export const CopyButton = memo(function CopyButton({ disabled }: CopyButtonProps) {
  const { copyCurrent } = useClipboard()
  const [label, setLabel] = useState('Copy')

  const handleCopy = useCallback(async () => {
    await copyCurrent()
    setLabel('Copied')

    window.setTimeout(() => {
      setLabel('Copy')
    }, 1200)
  }, [copyCurrent])

  return (
    <button
      type="button"
      className="button button--secondary"
      disabled={disabled}
      onClick={handleCopy}
    >
      {label}
    </button>
  )
})
