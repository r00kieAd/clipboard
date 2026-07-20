export type ClipboardFormat = 'plain-text' | 'markdown' | 'code'

export type ClipboardEntry = {
  id: string
  text: string
  createdAt: number
  format: ClipboardFormat
}

export type ClipboardEntries = Record<string, ClipboardEntry>

export type ClipboardState = {
  entries: ClipboardEntries
  currentEntryId: string | null
  currentText: string
  currentFormat: ClipboardFormat
  isLoading: boolean
  error: string | null
}

export type ClipboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'HYDRATE'; payload: ClipboardEntries }
  | { type: 'ADD'; payload: ClipboardEntry }
  | { type: 'DELETE'; payload: string }
  | { type: 'LOAD'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'EDIT_CURRENT'; payload: string }
  | { type: 'SET_FORMAT'; payload: ClipboardFormat }
