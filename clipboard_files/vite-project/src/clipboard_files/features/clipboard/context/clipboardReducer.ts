import type { ClipboardAction, ClipboardState } from '../types'

export const initialClipboardState: ClipboardState = {
  entries: {},
  currentEntryId: null,
  currentText: '',
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
        currentText: action.payload.text,
      }

    case 'DELETE': {
      const remainingEntries = { ...state.entries }
      delete remainingEntries[action.payload]
      const deletedCurrent = state.currentEntryId === action.payload

      return {
        ...state,
        entries: remainingEntries,
        currentEntryId: deletedCurrent ? null : state.currentEntryId,
        currentText: deletedCurrent ? '' : state.currentText,
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
        currentText: entry.text,
      }
    }

    case 'CLEAR':
      return {
        ...state,
        currentEntryId: null,
        currentText: '',
      }

    case 'EDIT_CURRENT':
      return {
        ...state,
        currentEntryId: null,
        currentText: action.payload,
      }

    default:
      return state
  }
}
