import { createContext } from 'react'
import type { ClipboardFormat, ClipboardState } from '../types'

export type ClipboardContextValue = ClipboardState & {
  copyCurrent: () => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  loadEntry: (id: string) => void
  saveCurrent: () => Promise<void>
  setCurrentFormat: (format: ClipboardFormat) => void
  setCurrentText: (text: string) => void
  clearEditor: () => void
}

export const ClipboardContext = createContext<ClipboardContextValue | null>(null)
