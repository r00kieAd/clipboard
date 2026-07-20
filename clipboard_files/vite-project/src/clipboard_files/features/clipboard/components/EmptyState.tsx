import { memo } from 'react'

export const EmptyState = memo(function EmptyState() {
  return (
    <div className="empty-state">
      <p>No saved notes yet.</p>
      <span>Saved clippings will appear here newest first.</span>
    </div>
  )
})
