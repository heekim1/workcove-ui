import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { formatFieldErrors } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { AuthAside } from '../components/AuthAside'
import { SmsConsentNotice } from '../components/SmsConsentNotice'
import { PRIVACY_PATH, TERMS_PATH } from '../legal/urls'
import { ApiError } from '../types'

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (!smsOptIn) {
      setError('Please agree to the Terms & Conditions, Privacy Policy, and SMS consent to continue.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        email: email.trim(),
        phone: phone.trim(),
        password,
        password_confirm: passwordConfirm,
        role: 'worker',
        sms_opt_in: true,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.body))
      } else {
        setError('Unable to create your account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <div className="auth-panel__intro">
          <p className="eyebrow">Create your account</p>
          <h1>Join Workcove as a worker</h1>
          <p className="lede">Set up your profile once, then browse open jobs after you verify by text.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {error ? <Alert>{error}</Alert> : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="field">
            <span>Mobile phone</span>
            <input
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+14155552671"
            />
            <span className="field__hint">
              Use E.164 format, including country code. See our{' '}
              <Link to={TERMS_PATH} target="_blank" rel="noreferrer">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link to={PRIVACY_PATH} target="_blank" rel="noreferrer">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <SmsConsentNotice withCheckbox checked={smsOptIn} onChange={setSmsOptIn} />

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Re-enter password"
            />
          </label>

          <button
            className="btn btn--primary btn--block"
            type="submit"
            disabled={submitting || !smsOptIn}
          >
            {submitting ? 'Creating account…' : 'Agree & Join'}
          </button>
        </form>

        <p className="auth-footer">
          Already on Workcove? <Link to="/login">Sign in</Link>
        </p>
      </section>

      <AuthAside
        title="Built for shift workers"
        body="See pay, date, and location before you apply. Keep your schedule full with opportunities that match your skills."
        imageSrc="/images/auth-hero-register.jpg"
        imageAlt="Futuristic city skyline with glowing paths connecting workplaces"
      />
    </div>
  )
}
