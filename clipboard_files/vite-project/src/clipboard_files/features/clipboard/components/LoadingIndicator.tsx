import { memo } from 'react'

export const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="loading-indicator__mark" aria-hidden="true" />
      Loading history
    </div>
  )
})
