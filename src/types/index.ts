export type UserRole = 'worker' | 'hiring_manager'

export interface User {
  id: number
  email: string
  phone: string
  role: UserRole
}

export interface RegisterPayload {
  email: string
  password: string
  password_confirm: string
  phone: string
  role: UserRole
  sms_opt_in: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginChallenge {
  challenge_id: string
  expires_in: number
  phone: string
}

export interface VerifyPayload {
  challenge_id: string
  code: string
}

export interface AuthTokens {
  access: string
  refresh: string
  user: User
}

export interface Job {
  id: number
  work_date: string
  start_time: string
  end_time: string
  city: string
  state: string
  zip_code: string
  hourly_rate: string
  headcount: number
  status: 'open' | 'filled' | 'completed' | 'cancelled'
  skill: string
  business_name: string
}

export interface JobOffer {
  id: number
  reply_code: string
  status: 'pending' | 'sent' | 'accepted' | 'declined' | 'closed'
  channel: 'text' | 'app'
}

export interface JobDetail extends Job {
  my_offer: JobOffer | null
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiErrorBody {
  detail?: string
  code?: string
  retry_after?: number
  attempts_remaining?: number
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.detail || 'Something went wrong')
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}
