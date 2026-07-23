export type ClipboardFormat = 'plain-text' | 'markdown' | 'code'

export type ClipboardEntry = {
  id: string
  title: string
  text: string
  createdAt: number
  updatedAt: number
  format: ClipboardFormat
  ownerEmail: string
  passcodeHash: string
}

export type ClipboardEntries = Record<string, ClipboardEntry>

export type ClipboardState = {
  entries: ClipboardEntries
  currentEntryId: string | null
  currentTitle: string
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
  | { type: 'EDIT_TITLE'; payload: string }
  | { type: 'SET_FORMAT'; payload: ClipboardFormat }
