import { apiRequest } from './client'
import type { Job, JobDetail, JobOffer, Paginated } from '../types'

export function listJobs(page = 1, token?: string | null) {
  return apiRequest<Paginated<Job>>(`/jobs/?page=${page}`, { token })
}

export function getJob(id: number, token?: string | null) {
  return apiRequest<JobDetail>(`/jobs/${id}/`, { token })
}

export function submitOffer(jobId: number, token: string) {
  return apiRequest<JobOffer>(`/jobs/${jobId}/offers/`, {
    method: 'POST',
    token,
  })
}
