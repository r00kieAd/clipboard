import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { clipboardService } from '../services/clipboardService'
import type { ClipboardFormat } from '../types'
import { ClipboardContext, type ClipboardContextValue } from './clipboardContextValue'
import { clipboardReducer, initialClipboardState } from './clipboardReducer'

type ClipboardProviderProps = {
  children: ReactNode
}

export function ClipboardProvider({ children }: ClipboardProviderProps) {
  const [state, dispatch] = useReducer(clipboardReducer, initialClipboardState)

  useEffect(() => {
    let isMounted = true

    const loadEntries = async () => {
      try {
        const entries = await clipboardService.getAll()

        if (isMounted) {
          dispatch({ type: 'HYDRATE', payload: entries })
        }
      } catch (error) {
        if (isMounted) {
          dispatch({
            type: 'SET_ERROR',
            payload:
              error instanceof Error
                ? error.message
                : 'Clipboard history could not be loaded.',
          })
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    void loadEntries()

    return () => {
      isMounted = false
    }
  }, [])

  const setCurrentText = useCallback((text: string) => {
    dispatch({ type: 'EDIT_CURRENT', payload: text })
  }, [])

  const setCurrentFormat = useCallback((format: ClipboardFormat) => {
    dispatch({ type: 'SET_FORMAT', payload: format })
  }, [])

  const saveCurrent = useCallback(async () => {
    const text = state.currentText.trimEnd()

    if (!text.trim()) {
      return
    }

    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const entry = await clipboardService.save(text, state.currentFormat)
      dispatch({ type: 'ADD', payload: entry })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Current note could not be saved.',
      })
    }
  }, [state.currentFormat, state.currentText])

  const copyCurrent = useCallback(async () => {
    if (!state.currentText.trim()) {
      return
    }

    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      await clipboardService.copy(state.currentText)
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Current note could not be copied.',
      })
    }
  }, [state.currentText])

  const deleteEntry = useCallback(async (id: string) => {
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      await clipboardService.delete(id)
      dispatch({ type: 'DELETE', payload: id })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Saved note could not be deleted.',
      })
    }
  }, [])

  const loadEntry = useCallback((id: string) => {
    dispatch({ type: 'LOAD', payload: id })
  }, [])

  const clearEditor = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const value = useMemo<ClipboardContextValue>(
    () => ({
      ...state,
      clearEditor,
      copyCurrent,
      deleteEntry,
      loadEntry,
      saveCurrent,
      setCurrentFormat,
      setCurrentText,
    }),
    [
      clearEditor,
      copyCurrent,
      deleteEntry,
      loadEntry,
      saveCurrent,
      setCurrentFormat,
      setCurrentText,
      state,
    ],
  )

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  )
}
