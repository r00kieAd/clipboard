export type ClipboardEntry = {
  id: string
  text: string
  createdAt: number
}

export type ClipboardEntries = Record<string, ClipboardEntry>

export type ClipboardState = {
  entries: ClipboardEntries
  currentEntryId: string | null
  currentText: string
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
