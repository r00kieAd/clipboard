import { memo } from 'react'
import { HistoryList } from './HistoryList'
import { LoadingIndicator } from './LoadingIndicator'
import { useClipboard } from '../hooks/useClipboard'
import { useClipboardEntries } from '../hooks/useClipboardEntries'

type SidebarProps = {
  onSelect: () => void
}

export const Sidebar = memo(function Sidebar({ onSelect }: SidebarProps) {
  const { currentEntryId, isLoading } = useClipboard()
  const entries = useClipboardEntries()

  return (
    <section className="sidebar">
      <div className="sidebar__header">
        <p className="eyebrow">Clipboard</p>
        <h1>Notes</h1>
      </div>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <HistoryList
          activeEntryId={currentEntryId}
          entries={entries}
          onSelect={onSelect}
        />
      )}
    </section>
  )
})
