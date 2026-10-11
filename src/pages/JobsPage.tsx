import { useEffect, useState } from 'react'
import { listJobs } from '../api/jobs'
import { formatFieldErrors } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Alert } from '../components/Alert'
import { JobCard } from '../components/JobCard'
import { ApiError, type Job } from '../types'

export function JobsPage() {
  const { accessToken, user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await listJobs(page, accessToken)
        if (!active) return
        setJobs(data.results)
        setCount(data.count)
        setHasNext(Boolean(data.next))
        setHasPrev(Boolean(data.previous))
      } catch (err) {
        if (!active) return
        if (err instanceof ApiError) {
          setError(formatFieldErrors(err.body))
        } else {
          setError('Unable to load jobs right now.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [page, accessToken])

  return (
    <div className="feed-layout">
      <aside className="profile-rail">
        <div className="profile-card">
          <div className="profile-card__banner" />
          <div className="profile-card__body">
            <div className="profile-card__avatar" aria-hidden="true">
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <h2>{user?.email}</h2>
            <p>{user?.role === 'worker' ? 'Worker' : 'Hiring manager'}</p>
            <p className="muted">{user?.phone}</p>
          </div>
        </div>
      </aside>

      <section className="feed">
        <header className="feed__header">
          <div>
            <h1>Open jobs</h1>
            <p className="muted">
              {count === 0 ? 'No openings yet' : `${count} opening${count === 1 ? '' : 's'} available`}
            </p>
          </div>
        </header>

        {error ? <Alert>{error}</Alert> : null}

        {loading ? (
          <div className="empty-state">Loading openings…</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h2>No open jobs right now</h2>
            <p>Check back soon — new shifts post throughout the day.</p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {(hasPrev || hasNext) && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={!hasPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="muted">Page {page}</span>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={!hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <aside className="tips-rail">
        <div className="tips-card">
          <h2>Today&apos;s tips</h2>
          <ul>
            <li>Open a job to review schedule, pay, and location details.</li>
            <li>Apply early — openings close when headcount is filled.</li>
            <li>Keep SMS verification ready so you can sign back in quickly.</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
