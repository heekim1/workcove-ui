import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatFieldErrors } from '../api/client'
import { getJob, submitOffer } from '../api/jobs'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { ApiError, type JobDetail } from '../types'
import { companyInitials, formatHourlyRate, formatTime, formatWorkDate } from '../utils/format'

export function JobDetailPage() {
  const { jobId } = useParams()
  const { accessToken } = useAuth()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const id = Number(jobId)

  useEffect(() => {
    let active = true

    async function load() {
      if (!Number.isFinite(id)) {
        setError('Job not found.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const data = await getJob(id, accessToken)
        if (!active) return
        setJob(data)
      } catch (err) {
        if (!active) return
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'This job is no longer available.' : formatFieldErrors(err.body))
        } else {
          setError('Unable to load this job.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [id, accessToken])

  async function onApply() {
    if (!accessToken || !job) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const offer = await submitOffer(job.id, accessToken)
      setJob({ ...job, my_offer: offer })
      setSuccess(`Offer submitted. Reply code: ${offer.reply_code}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.body))
      } else {
        setError('Unable to submit your offer.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="empty-state">Loading job…</div>
  }

  if (!job) {
    return (
      <div className="detail-page">
        <Alert>{error || 'Job not found.'}</Alert>
        <Link to="/jobs" className="btn btn--secondary">
          Back to jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <Link to="/jobs" className="back-link">
        ← Back to jobs
      </Link>

      <article className="detail-card">
        <header className="detail-card__header">
          <div className="job-card__avatar job-card__avatar--lg" aria-hidden="true">
            {companyInitials(job.business_name)}
          </div>
          <div>
            <p className="eyebrow">{job.business_name}</p>
            <h1>{job.skill}</h1>
            <p className="detail-card__location">
              {job.city}, {job.state} {job.zip_code}
            </p>
          </div>
          <div className="detail-card__pay">
            <span className="detail-card__rate">{formatHourlyRate(job.hourly_rate)}</span>
            <span className="muted">
              {job.headcount} opening{job.headcount === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        <div className="detail-grid">
          <div>
            <h2>Schedule</h2>
            <p>{formatWorkDate(job.work_date)}</p>
            <p>
              {formatTime(job.start_time)} – {formatTime(job.end_time)}
            </p>
          </div>
          <div>
            <h2>Location</h2>
            <p>
              {job.city}, {job.state}
            </p>
            <p>{job.zip_code}</p>
          </div>
          <div>
            <h2>Status</h2>
            <p className="status-pill">{job.status}</p>
            {job.my_offer ? (
              <p className="muted">
                Your offer: {job.my_offer.status} · {job.my_offer.reply_code}
              </p>
            ) : null}
          </div>
        </div>

        {error ? <Alert>{error}</Alert> : null}
        {success ? <Alert tone="success">{success}</Alert> : null}

        <div className="detail-actions">
          {job.my_offer ? (
            <button type="button" className="btn btn--secondary" disabled>
              Offer already submitted
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              onClick={onApply}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Apply for this job'}
            </button>
          )}
        </div>
      </article>
    </div>
  )
}
