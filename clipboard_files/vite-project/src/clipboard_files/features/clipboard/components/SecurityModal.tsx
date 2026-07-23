import { memo, useEffect, useMemo, useState } from 'react'
import { CodeInput } from './CodeInput'
import { useClipboard } from '../hooks/useClipboard'
import { getEmailGreetingName } from '../utils'

export const SecurityModal = memo(function SecurityModal() {
  const {
    authFlow,
    cancelAuthFlow,
    submitCreateCredentials,
    submitCreateOtp,
    submitForgotEmail,
    submitResetPasscode,
    submitUpdatePasscode,
    verifyResetOtp,
  } = useClipboard()
  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [otp, setOtp] = useState('')
  const authMode = authFlow?.mode
  const authStep = authFlow?.step
  const authEmail = authFlow?.email

  useEffect(() => {
    setPasscode('')
    setOtp('')

    if (authMode === 'update' && authEmail) {
      setEmail(authEmail)
    }

    if (!authMode) {
      setEmail('')
    }
  }, [authEmail, authMode, authStep])

  const title = useMemo(() => {
    if (!authFlow) {
      return ''
    }

    if (authFlow.mode === 'create') {
      return authFlow.step === 'credentials' ? 'Secure this note' : 'Verify email'
    }

    if (authFlow.step === 'forgot-email') {
      return 'Reset passcode'
    }

    if (authFlow.step === 'forgot-otp') {
      return 'Verify email'
    }

    if (authFlow.step === 'reset-passcode') {
      return 'Create new passcode'
    }

    if (authFlow.intent === 'delete') {
      return 'Delete note'
    }

    return 'Enter passcode'
  }, [authFlow])

  if (!authFlow) {
    return null
  }

  const hint =
    authFlow.mode === 'update'
      ? `Hello ${getEmailGreetingName(authFlow.email)}, enter your passcode${
          authFlow.intent === 'delete' ? ' to delete this note' : ''
        }.`
      : 'Use a verified email and a 4 digit passcode.'

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="security-modal" role="dialog" aria-modal="true">
        <div className="security-modal__header">
          <p className="eyebrow">{authFlow.mode === 'create' ? 'New note' : 'Protected note'}</p>
          <h2>{title}</h2>
          <p>{authFlow.error && authFlow.step !== 'passcode' ? authFlow.error : hint}</p>
        </div>

        <p
          className={`form-error ${authFlow.error ? 'form-error--visible' : ''}`}
          aria-live="polite"
        >
          {authFlow.error ?? ' '}
        </p>

        {authFlow.mode === 'create' && authFlow.step === 'credentials' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitCreateCredentials(email, passcode)
            }}
          >
            <input
              className={authFlow.invalidField === 'email' ? 'input--invalid' : ''}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <CodeInput
              label="Create passcode"
              value={passcode}
              isInvalid={authFlow.invalidField === 'passcode'}
              onChange={setPasscode}
            />
            <button type="submit" className="button button--primary">
              Send OTP
            </button>
          </form>
        ) : null}

        {authFlow.mode === 'create' && authFlow.step === 'otp' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitCreateOtp(otp)
            }}
          >
            <p className="security-modal__note">
              OTP sent to {authFlow.email}
              {authFlow.demoOtp ? `, demo OTP ${authFlow.demoOtp}` : ''}
            </p>
            <CodeInput
              label="Enter OTP"
              value={otp}
              isInvalid={authFlow.invalidField === 'otp'}
              onChange={setOtp}
              length={6}
            />
            <button type="submit" className="button button--primary">
              Save note
            </button>
          </form>
        ) : null}

        {authFlow.mode === 'update' && authFlow.step === 'passcode' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitUpdatePasscode(passcode)
            }}
          >
            <CodeInput
              label="Passcode"
              value={passcode}
              isInvalid={authFlow.invalidField === 'passcode'}
              onChange={setPasscode}
            />
            <button type="submit" className="button button--primary">
              {authFlow.intent === 'delete' ? 'Delete note' : 'Continue'}
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void submitForgotEmail(authFlow.email)}
            >
              Forgot passcode
            </button>
          </form>
        ) : null}

        {authFlow.mode === 'update' && authFlow.step === 'forgot-email' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitForgotEmail(email)
            }}
          >
            <input
              className={authFlow.invalidField === 'email' ? 'input--invalid' : ''}
              type="email"
              placeholder="Verified email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="button button--primary">
              Send OTP
            </button>
          </form>
        ) : null}

        {authFlow.mode === 'update' && authFlow.step === 'forgot-otp' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void verifyResetOtp(otp)
            }}
          >
            <p className="security-modal__note">
              OTP sent to {authFlow.email}
              {authFlow.demoOtp ? `, demo OTP ${authFlow.demoOtp}` : ''}
            </p>
            <CodeInput
              label="Enter OTP"
              value={otp}
              isInvalid={authFlow.invalidField === 'otp'}
              onChange={setOtp}
              length={6}
            />
            <button type="submit" className="button button--primary">
              Verify OTP
            </button>
          </form>
        ) : null}

        {authFlow.mode === 'update' && authFlow.step === 'reset-passcode' ? (
          <form
            className="security-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitResetPasscode(passcode)
            }}
          >
            <CodeInput
              label="New passcode"
              value={passcode}
              isInvalid={authFlow.invalidField === 'passcode'}
              onChange={setPasscode}
            />
            <button type="submit" className="button button--primary">
              Update passcode
            </button>
          </form>
        ) : null}

        <button type="button" className="modal-close" onClick={cancelAuthFlow}>
          Close
        </button>
      </section>
    </div>
  )
})
