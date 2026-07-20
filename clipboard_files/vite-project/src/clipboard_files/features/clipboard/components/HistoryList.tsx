import { memo } from 'react'
import { EmptyState } from './EmptyState'
import { HistoryCard } from './HistoryCard'
import type { ClipboardEntry } from '../types'

type HistoryListProps = {
  activeEntryId: string | null
  entries: ClipboardEntry[]
  onSelect: () => void
}

export const HistoryList = memo(function HistoryList({
  activeEntryId,
  entries,
  onSelect,
}: HistoryListProps) {
  if (entries.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="history-list" role="list" aria-label="Saved clipboard notes">
      {entries.map((entry) => (
        <HistoryCard
          entry={entry}
          isActive={entry.id === activeEntryId}
          key={entry.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
})
