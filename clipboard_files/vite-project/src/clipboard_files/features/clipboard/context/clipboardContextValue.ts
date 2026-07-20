import { createContext } from 'react'
import type { ClipboardState } from '../types'

export type ClipboardContextValue = ClipboardState & {
  copyCurrent: () => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  loadEntry: (id: string) => void
  saveCurrent: () => Promise<void>
  setCurrentText: (text: string) => void
  clearEditor: () => void
}

export const ClipboardContext = createContext<ClipboardContextValue | null>(null)
