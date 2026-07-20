import { memo, useCallback, useState } from 'react'
import { useClipboard } from '../hooks/useClipboard'

type SaveButtonProps = {
  disabled: boolean
}

export const SaveButton = memo(function SaveButton({ disabled }: SaveButtonProps) {
  const { saveCurrent } = useClipboard()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await saveCurrent()
    setIsSaving(false)
  }, [saveCurrent])

  return (
    <button
      type="button"
      className="button button--primary"
      disabled={disabled || isSaving}
      onClick={handleSave}
    >
      {isSaving ? 'Saving' : 'Save'}
    </button>
  )
})
