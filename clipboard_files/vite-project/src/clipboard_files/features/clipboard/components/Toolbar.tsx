import { memo, useMemo } from 'react'
import { CopyButton } from './CopyButton'
import { SaveButton } from './SaveButton'
import { useClipboard } from '../hooks/useClipboard'

export const Toolbar = memo(function Toolbar() {
  const { clearEditor, currentText } = useClipboard()
  const isActionDisabled = useMemo(() => currentText.trim().length === 0, [currentText])

  return (
    <div className="toolbar" aria-label="Clipboard actions">
      <SaveButton disabled={isActionDisabled} />
      <CopyButton disabled={isActionDisabled} />
      <button
        type="button"
        className="button button--secondary"
        disabled={isActionDisabled}
        onClick={clearEditor}
      >
        Clear
      </button>
    </div>
  )
})
