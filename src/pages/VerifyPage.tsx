import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { formatFieldErrors } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { ApiError } from '../types'

export function VerifyPage() {
  const { pendingLogin, verify, resendLoginCode, isAuthenticated, clearPendingLogin } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(pendingLogin?.expires_in ?? 0)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (!pendingLogin) return
    setSecondsLeft(pendingLogin.expires_in)
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [pendingLogin])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [resendCooldown])

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />
  }

  if (!pendingLogin) {
    return <Navigate to="/login" replace />
  }

  const challenge = pendingLogin

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await verify({
        challenge_id: challenge.challenge_id,
        code: code.trim(),
      })
      navigate('/jobs')
    } catch (err) {
      if (err instanceof ApiError) {
        const base = formatFieldErrors(err.body)
        const remaining =
          typeof err.body.attempts_remaining === 'number'
            ? ` ${err.body.attempts_remaining} attempts remaining.`
            : ''
        setError(`${base}${remaining}`)
      } else {
        setError('Unable to verify that code. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function onResend() {
    setError(null)
    setInfo(null)
    setResending(true)
    try {
      const next = await resendLoginCode()
      setCode('')
      setInfo(`A new code was sent to ${next.phone}.`)
      setResendCooldown(60)
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = formatFieldErrors(err.body)
        setError(detail)
        if (err.body.code === 'resend_cooldown' && typeof err.body.retry_after === 'number') {
          setResendCooldown(err.body.retry_after)
        }
      } else {
        setError('Unable to resend the code. Please try again.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="auth-layout auth-layout--narrow">
      <section className="auth-panel">
        <div className="auth-panel__intro">
          <p className="eyebrow">Security check</p>
          <h1>Enter the code we texted you</h1>
          <p className="lede">
            We sent a 6-digit code to <strong>{challenge.phone}</strong> for{' '}
            <strong>{challenge.email}</strong>.
          </p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {info ? <Alert tone="success">{info}</Alert> : null}
          {error ? <Alert>{error}</Alert> : null}

          <label className="field">
            <span>Verification code</span>
            <input
              className="code-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
            />
            <span className="field__hint">
              {secondsLeft > 0
                ? `Code expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`
                : 'Code may have expired. Use Resend code below.'}
            </span>
          </label>

          <button
            className="btn btn--primary btn--block"
            type="submit"
            disabled={submitting || code.length !== 6}
          >
            {submitting ? 'Verifying…' : 'Verify and continue'}
          </button>
        </form>

        <p className="auth-footer">
          Wrong account?{' '}
          <button
            type="button"
            className="text-link"
            onClick={() => {
              clearPendingLogin()
              navigate('/login')
            }}
          >
            Back to sign in
          </button>
          {' · '}
          <button
            type="button"
            className="text-link"
            onClick={onResend}
            disabled={resending || resendCooldown > 0}
          >
            {resending
              ? 'Sending…'
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend code'}
          </button>
        </p>
      </section>
    </div>
  )
}
