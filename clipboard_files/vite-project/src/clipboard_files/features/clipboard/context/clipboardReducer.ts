import type { ClipboardAction, ClipboardState } from '../types'

export const initialClipboardState: ClipboardState = {
  entries: {},
  currentEntryId: null,
  currentTitle: '',
  currentText: '',
  currentFormat: 'plain-text',
  isLoading: true,
  error: null,
}

export const clipboardReducer = (
  state: ClipboardState,
  action: ClipboardAction,
): ClipboardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'HYDRATE':
      return { ...state, entries: action.payload, isLoading: false }

    case 'ADD':
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.id]: action.payload,
        },
        currentEntryId: action.payload.id,
        currentTitle: action.payload.title,
        currentText: action.payload.text,
        currentFormat: action.payload.format,
      }

    case 'DELETE': {
      const remainingEntries = { ...state.entries }
      delete remainingEntries[action.payload]
      const deletedCurrent = state.currentEntryId === action.payload

      return {
        ...state,
        entries: remainingEntries,
        currentEntryId: deletedCurrent ? null : state.currentEntryId,
        currentTitle: deletedCurrent ? '' : state.currentTitle,
        currentText: deletedCurrent ? '' : state.currentText,
        currentFormat: deletedCurrent ? 'plain-text' : state.currentFormat,
      }
    }

    case 'LOAD': {
      const entry = state.entries[action.payload]

      if (!entry) {
        return state
      }

      return {
        ...state,
        currentEntryId: entry.id,
        currentTitle: entry.title,
        currentText: entry.text,
        currentFormat: entry.format,
      }
    }

    case 'CLEAR':
      return {
        ...state,
        currentEntryId: null,
        currentTitle: '',
        currentText: '',
        currentFormat: 'plain-text',
      }

    case 'EDIT_CURRENT':
      return {
        ...state,
        currentText: action.payload,
      }

    case 'EDIT_TITLE':
      return {
        ...state,
        currentTitle: action.payload,
      }

    case 'SET_FORMAT':
      return {
        ...state,
        currentFormat: action.payload,
      }

    default:
      return state
  }
}
