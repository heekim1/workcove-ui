import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { formatFieldErrors } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { AuthAside } from '../components/AuthAside'
import { SmsConsentNotice } from '../components/SmsConsentNotice'
import { ApiError } from '../types'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = Boolean((location.state as { registered?: boolean } | null)?.registered)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate('/verify')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.body))
      } else {
        setError('Unable to sign in. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel">
        <div className="auth-panel__intro">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Workcove</h1>
          <p className="lede">Find open shifts near you and apply in a few taps.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {justRegistered ? (
            <Alert tone="success">Account created. Sign in to verify your phone and continue.</Alert>
          ) : null}
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
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <SmsConsentNotice />

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Sending code…' : 'Continue'}
          </button>
        </form>

        <p className="auth-footer">
          New to Workcove? <Link to="/register">Join now</Link>
        </p>
      </section>

      <AuthAside
        title="Work that fits your day"
        body="Browse local openings, see pay and schedule up front, and claim shifts that match your skills."
        imageSrc="/images/auth-hero-login.jpg"
        imageAlt="Futuristic holographic job board glowing in a modern atrium"
      />
    </div>
  )
}
