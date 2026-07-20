import { useLayoutEffect, type RefObject } from 'react'

export const useAutoResizeTextarea = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
) => {
  useLayoutEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [textareaRef, value])
}
