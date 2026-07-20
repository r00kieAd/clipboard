import { memo, useCallback } from 'react'
import type { ClipboardEntry } from '../types'
import { formatEntryDate, formatEntryTime, getFirstLinePreview } from '../utils'
import { useClipboard } from '../hooks/useClipboard'

type HistoryCardProps = {
  entry: ClipboardEntry
  isActive: boolean
  onSelect: () => void
}

export const HistoryCard = memo(function HistoryCard({
  entry,
  isActive,
  onSelect,
}: HistoryCardProps) {
  const { deleteEntry, loadEntry } = useClipboard()

  const handleSelect = useCallback(() => {
    loadEntry(entry.id)
    onSelect()
  }, [entry.id, loadEntry, onSelect])

  const handleDelete = useCallback(() => {
    void deleteEntry(entry.id)
  }, [deleteEntry, entry.id])

  return (
    <article className="history-card" role="listitem">
      <button
        type="button"
        className={`history-card__content ${
          isActive ? 'history-card__content--active' : ''
        }`}
        aria-current={isActive ? 'true' : undefined}
        onClick={handleSelect}
      >
        <span className="history-card__preview">
          {getFirstLinePreview(entry.text)}
        </span>
        <span className="history-card__meta">
          <time dateTime={new Date(entry.createdAt).toISOString()}>
            {formatEntryDate(entry.createdAt)} at {formatEntryTime(entry.createdAt)}
          </time>
        </span>
      </button>

      <button
        type="button"
        className="icon-button history-card__delete"
        aria-label={`Delete ${getFirstLinePreview(entry.text)}`}
        onClick={handleDelete}
      >
        <span aria-hidden="true">x</span>
      </button>
    </article>
  )
})
