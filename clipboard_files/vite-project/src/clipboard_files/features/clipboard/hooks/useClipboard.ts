import { useContext } from 'react'
import { ClipboardContext } from '../context/clipboardContextValue'

export const useClipboard = () => {
  const context = useContext(ClipboardContext)

  if (!context) {
    throw new Error('useClipboard must be used within ClipboardProvider.')
  }

  return context
}
