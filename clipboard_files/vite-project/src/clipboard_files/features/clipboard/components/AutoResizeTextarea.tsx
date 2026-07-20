import { memo, useRef } from 'react'
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea'

type AutoResizeTextareaProps = {
  value: string
  onChange: (value: string) => void
}

export const AutoResizeTextarea = memo(function AutoResizeTextarea({
  value,
  onChange,
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useAutoResizeTextarea(textareaRef, value)

  return (
    <textarea
      ref={textareaRef}
      className="editor-textarea"
      aria-label="Clipboard note text"
      placeholder="Start with a fragment, a draft, or the line you keep copying..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={8}
    />
  )
})
