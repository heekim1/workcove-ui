import { Link } from 'react-router-dom'
import type { Job } from '../types'
import { companyInitials, formatHourlyRate, formatTime, formatWorkDate } from '../utils/format'

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="job-card">
      <Link to={`/jobs/${job.id}`} className="job-card__link">
        <div className="job-card__avatar" aria-hidden="true">
          {companyInitials(job.business_name)}
        </div>
        <div className="job-card__body">
          <div className="job-card__topline">
            <h2 className="job-card__title">{job.skill}</h2>
            <span className="job-card__rate">{formatHourlyRate(job.hourly_rate)}</span>
          </div>
          <p className="job-card__company">{job.business_name}</p>
          <p className="job-card__location">
            {job.city}, {job.state} · {job.zip_code}
          </p>
          <div className="job-card__meta">
            <span>{formatWorkDate(job.work_date)}</span>
            <span>
              {formatTime(job.start_time)} – {formatTime(job.end_time)}
            </span>
            <span>
              {job.headcount} opening{job.headcount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
