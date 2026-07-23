import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { clipboardService } from '../services/clipboardService'
import type { ClipboardEntry, ClipboardFormat } from '../types'
import {
  createClipboardEntry,
  getEmailGreetingName,
  hashPasscode,
  isValidEmail,
  isValidPasscode,
  normalizeEmail,
} from '../utils'
import {
  ClipboardContext,
  type AuthFlow,
  type ClipboardContextValue,
} from './clipboardContextValue'
import { clipboardReducer, initialClipboardState } from './clipboardReducer'

type ClipboardProviderProps = {
  children: ReactNode
}

export function ClipboardProvider({ children }: ClipboardProviderProps) {
  const [state, dispatch] = useReducer(clipboardReducer, initialClipboardState)
  const [authFlow, setAuthFlow] = useState<AuthFlow | null>(null)

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

  const setCurrentTitle = useCallback((title: string) => {
    dispatch({ type: 'EDIT_TITLE', payload: title })
  }, [])

  const setCurrentFormat = useCallback((format: ClipboardFormat) => {
    dispatch({ type: 'SET_FORMAT', payload: format })
  }, [])

  const persistEntry = useCallback(async (entry: ClipboardEntry) => {
    const savedEntry = await clipboardService.save(entry)
    dispatch({ type: 'ADD', payload: savedEntry })
  }, [])

  const getUpdatedEntry = useCallback(
    (entry: ClipboardEntry): ClipboardEntry => ({
      ...entry,
      title: state.currentTitle.trim(),
      text: state.currentText.trimEnd(),
      format: state.currentFormat,
      updatedAt: Date.now(),
    }),
    [state.currentFormat, state.currentText, state.currentTitle],
  )

  const saveCurrent = useCallback(async () => {
    const title = state.currentTitle.trim()
    const text = state.currentText.trimEnd()

    if (!title) {
      dispatch({ type: 'SET_ERROR', payload: 'Add a note name before saving.' })
      return
    }

    if (!text.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Add note content before saving.' })
      return
    }

    dispatch({ type: 'SET_ERROR', payload: null })

    const existingEntry = state.currentEntryId
      ? state.entries[state.currentEntryId]
      : null

    if (existingEntry?.passcodeHash) {
      setAuthFlow({
        mode: 'update',
        intent: 'save',
        step: 'passcode',
        entryId: existingEntry.id,
        email: existingEntry.ownerEmail,
        attempts: 0,
        error: null,
        invalidField: null,
        isBusy: false,
      })
      return
    }

    setAuthFlow({
      mode: 'create',
      step: 'credentials',
      entryId: existingEntry?.id ?? null,
      email: existingEntry?.ownerEmail ?? '',
      passcode: '',
      error: null,
      invalidField: null,
      isBusy: false,
    })
  }, [state.currentEntryId, state.currentText, state.currentTitle, state.entries])

  const cancelAuthFlow = useCallback(() => {
    setAuthFlow(null)
  }, [])

  const submitCreateCredentials = useCallback(
    async (email: string, passcode: string) => {
      const normalizedEmail = normalizeEmail(email)

      if (!isValidEmail(normalizedEmail)) {
        setAuthFlow((flow) =>
          flow?.mode === 'create'
            ? {
                ...flow,
                error: 'Enter a valid email address.',
                invalidField: 'email',
              }
            : flow,
        )
        return
      }

      if (!isValidPasscode(passcode)) {
        setAuthFlow((flow) =>
          flow?.mode === 'create'
            ? {
                ...flow,
                error: 'Passcode must be exactly 4 digits.',
                invalidField: 'passcode',
              }
            : flow,
        )
        return
      }

      setAuthFlow((flow) =>
        flow?.mode === 'create' ? { ...flow, isBusy: true, error: null } : flow,
      )

      try {
        const { demoOtp } = await clipboardService.sendOtp(normalizedEmail)
        setAuthFlow((flow) =>
          flow?.mode === 'create'
            ? {
                ...flow,
                step: 'otp',
                email: normalizedEmail,
                passcode,
                demoOtp,
                isBusy: false,
                invalidField: null,
              }
            : flow,
        )
      } catch {
        setAuthFlow((flow) =>
          flow?.mode === 'create'
            ? {
                ...flow,
                isBusy: false,
                error: 'OTP could not be sent. Try again.',
                invalidField: 'email',
              }
            : flow,
        )
      }
    },
    [],
  )

  const submitCreateOtp = useCallback(
    async (otp: string) => {
      if (authFlow?.mode !== 'create' || authFlow.step !== 'otp') {
        return
      }

      setAuthFlow({ ...authFlow, isBusy: true, error: null })

      const verified = await clipboardService.verifyOtp(authFlow.email, otp)

      if (!verified) {
        setAuthFlow({
          ...authFlow,
          isBusy: false,
          error: 'The OTP is incorrect or expired.',
          invalidField: 'otp',
        })
        return
      }

      const passcodeHash = await hashPasscode(authFlow.passcode, authFlow.email)
      const existingEntry = authFlow.entryId ? state.entries[authFlow.entryId] : null
      const entry = existingEntry
        ? {
            ...getUpdatedEntry(existingEntry),
            ownerEmail: authFlow.email,
            passcodeHash,
          }
        : createClipboardEntry(
            state.currentTitle,
            state.currentText,
            state.currentFormat,
            authFlow.email,
            passcodeHash,
          )

      await persistEntry(entry)
      setAuthFlow(null)
    },
    [
      authFlow,
      getUpdatedEntry,
      persistEntry,
      state.currentFormat,
      state.currentText,
      state.currentTitle,
      state.entries,
    ],
  )

  const submitUpdatePasscode = useCallback(
    async (passcode: string) => {
      if (authFlow?.mode !== 'update' || authFlow.step !== 'passcode') {
        return
      }

      const entry = state.entries[authFlow.entryId]

      if (!entry) {
        setAuthFlow(null)
        return
      }

      if (!isValidPasscode(passcode)) {
        setAuthFlow({
          ...authFlow,
          error: 'Passcode must be exactly 4 digits.',
          invalidField: 'passcode',
        })
        return
      }

      const passcodeHash = await hashPasscode(passcode, entry.ownerEmail)

      if (passcodeHash !== entry.passcodeHash) {
        const attempts = authFlow.attempts + 1

        setAuthFlow({
          ...authFlow,
          step: attempts >= 3 ? 'forgot-email' : 'passcode',
          attempts,
          error:
            attempts >= 3
              ? 'Too many attempts. Verify your email to reset the passcode.'
              : 'Passcode is incorrect.',
          invalidField: 'passcode',
        })
        return
      }

      if (authFlow.intent === 'delete') {
        await clipboardService.delete(entry.id)
        dispatch({ type: 'DELETE', payload: entry.id })
      } else if (authFlow.intent === 'save') {
        await persistEntry(getUpdatedEntry(entry))
      } else {
        dispatch({ type: 'LOAD', payload: entry.id })
      }

      setAuthFlow(null)
    },
    [authFlow, getUpdatedEntry, persistEntry, state.entries],
  )

  const submitForgotEmail = useCallback(
    async (email: string) => {
      if (authFlow?.mode !== 'update') {
        return
      }

      const entry = state.entries[authFlow.entryId]
      const normalizedEmail = normalizeEmail(email)

      if (!entry || !isValidEmail(normalizedEmail)) {
        setAuthFlow({
          ...authFlow,
          error: 'Enter the verified email address.',
          invalidField: 'email',
        })
        return
      }

      if (normalizedEmail !== normalizeEmail(entry.ownerEmail)) {
        setAuthFlow({
          ...authFlow,
          error: 'This email is not linked to the note.',
          invalidField: 'email',
        })
        return
      }

      const { demoOtp } = await clipboardService.sendOtp(normalizedEmail)
      setAuthFlow({
        ...authFlow,
        step: 'forgot-otp',
        email: normalizedEmail,
        demoOtp,
        error: null,
        invalidField: null,
      })
    },
    [authFlow, state.entries],
  )

  const verifyResetOtp = useCallback(
    async (otp: string) => {
      if (authFlow?.mode !== 'update' || authFlow.step !== 'forgot-otp') {
        return
      }

      const verified = await clipboardService.verifyOtp(authFlow.email, otp)

      if (!verified) {
        setAuthFlow({
          ...authFlow,
          error: 'The OTP is incorrect or expired.',
          invalidField: 'otp',
        })
        return
      }

      setAuthFlow({
        ...authFlow,
        step: 'reset-passcode',
        error: null,
        invalidField: null,
      })
    },
    [authFlow],
  )

  const submitResetPasscode = useCallback(
    async (passcode: string) => {
      if (authFlow?.mode !== 'update' || authFlow.step !== 'reset-passcode') {
        return
      }

      if (!isValidPasscode(passcode)) {
        setAuthFlow({
          ...authFlow,
          error: 'Passcode must be exactly 4 digits.',
          invalidField: 'passcode',
        })
        return
      }

      const entry = state.entries[authFlow.entryId]

      if (!entry) {
        setAuthFlow(null)
        return
      }

      const passcodeHash = await hashPasscode(passcode, authFlow.email)
      const entryToSave = {
        ...(authFlow.intent === 'save' ? getUpdatedEntry(entry) : entry),
        ownerEmail: authFlow.email,
        passcodeHash,
        updatedAt: Date.now(),
      }

      if (authFlow.intent === 'delete') {
        await clipboardService.delete(entry.id)
        dispatch({ type: 'DELETE', payload: entry.id })
      } else if (authFlow.intent === 'open') {
        await persistEntry(entryToSave)
        dispatch({ type: 'LOAD', payload: entry.id })
      } else {
        await persistEntry(entryToSave)
      }
      setAuthFlow(null)
    },
    [authFlow, getUpdatedEntry, persistEntry, state.entries],
  )

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
    const entry = state.entries[id]

    dispatch({ type: 'SET_ERROR', payload: null })

    if (entry?.passcodeHash) {
      setAuthFlow({
        mode: 'update',
        intent: 'delete',
        step: 'passcode',
        entryId: id,
        email: entry.ownerEmail,
        attempts: 0,
        error: `Hello ${getEmailGreetingName(
          entry.ownerEmail,
        )}, enter your passcode to delete this note.`,
        invalidField: null,
        isBusy: false,
      })
      return
    }

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
  }, [state.entries])

  const loadEntry = useCallback((id: string) => {
    const entry = state.entries[id]

    if (entry?.passcodeHash) {
      setAuthFlow({
        mode: 'update',
        intent: 'open',
        step: 'passcode',
        entryId: id,
        email: entry.ownerEmail,
        attempts: 0,
        error: `Hello ${getEmailGreetingName(
          entry.ownerEmail,
        )}, enter your passcode.`,
        invalidField: null,
        isBusy: false,
      })
      return
    }

    dispatch({ type: 'LOAD', payload: id })
  }, [state.entries])

  const clearEditor = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const value = useMemo<ClipboardContextValue>(
    () => ({
      ...state,
      authFlow,
      cancelAuthFlow,
      clearEditor,
      copyCurrent,
      deleteEntry,
      loadEntry,
      saveCurrent,
      setCurrentFormat,
      setCurrentTitle,
      setCurrentText,
      submitCreateCredentials,
      submitCreateOtp,
      submitForgotEmail,
      submitResetPasscode,
      submitUpdatePasscode,
      verifyResetOtp,
    }),
    [
      authFlow,
      cancelAuthFlow,
      clearEditor,
      copyCurrent,
      deleteEntry,
      loadEntry,
      saveCurrent,
      setCurrentFormat,
      setCurrentTitle,
      setCurrentText,
      submitCreateCredentials,
      submitCreateOtp,
      submitForgotEmail,
      submitResetPasscode,
      submitUpdatePasscode,
      verifyResetOtp,
      state,
    ],
  )

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  )
}
