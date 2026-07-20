import { memo } from 'react'
import { AutoResizeTextarea } from './AutoResizeTextarea'
import { FormatDropdown } from './FormatDropdown'
import { Toolbar } from './Toolbar'
import { useClipboard } from '../hooks/useClipboard'

type EditorProps = {
  onOpenSidebar: () => void
}

export const Editor = memo(function Editor({ onOpenSidebar }: EditorProps) {
  const { currentFormat, currentText, error, setCurrentFormat, setCurrentText } =
    useClipboard()

  return (
    <section className="editor-shell" aria-labelledby="editor-title">
      <div className="editor-shell__mobile-actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onOpenSidebar}
        >
          History
        </button>
      </div>

      <div className="editor-panel">
        <div className="editor-panel__header">
          <p className="eyebrow">Current note</p>
          <h2 id="editor-title">Write or paste anything</h2>
        </div>

        <div className="editor-field">
          <FormatDropdown value={currentFormat} onChange={setCurrentFormat} />
          <AutoResizeTextarea value={currentText} onChange={setCurrentText} />
        </div>

        {error ? (
          <p className="status-message" role="alert">
            {error}
          </p>
        ) : null}

        <Toolbar />
      </div>
    </section>
  )
})
