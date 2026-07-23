import { createContext } from 'react'
import type { ClipboardFormat, ClipboardState } from '../types'

export type AuthFlow =
  | {
      mode: 'create'
      step: 'credentials' | 'otp'
      entryId: string | null
      email: string
      passcode: string
      demoOtp?: string
      error: string | null
      invalidField: 'email' | 'passcode' | 'otp' | null
      isBusy: boolean
    }
  | {
      mode: 'update'
      intent: 'open' | 'save' | 'delete'
      step: 'passcode' | 'forgot-email' | 'forgot-otp' | 'reset-passcode'
      entryId: string
      email: string
      attempts: number
      demoOtp?: string
      error: string | null
      invalidField: 'email' | 'passcode' | 'otp' | null
      isBusy: boolean
    }

export type ClipboardContextValue = ClipboardState & {
  authFlow: AuthFlow | null
  cancelAuthFlow: () => void
  copyCurrent: () => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  loadEntry: (id: string) => void
  saveCurrent: () => Promise<void>
  setCurrentFormat: (format: ClipboardFormat) => void
  setCurrentTitle: (title: string) => void
  setCurrentText: (text: string) => void
  clearEditor: () => void
  submitCreateCredentials: (email: string, passcode: string) => Promise<void>
  submitCreateOtp: (otp: string) => Promise<void>
  submitForgotEmail: (email: string) => Promise<void>
  submitResetPasscode: (passcode: string) => Promise<void>
  submitUpdatePasscode: (passcode: string) => Promise<void>
  verifyResetOtp: (otp: string) => Promise<void>
}

export const ClipboardContext = createContext<ClipboardContextValue | null>(null)
