import { apiRequest } from './client'
import type {
  AuthTokens,
  LoginChallenge,
  LoginPayload,
  RegisterPayload,
  User,
  VerifyPayload,
} from '../types'

export function register(payload: RegisterPayload) {
  return apiRequest<User>('/auth/register/', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginChallenge>('/auth/login/', {
    method: 'POST',
    body: payload,
  })
}

export function verify(payload: VerifyPayload) {
  return apiRequest<AuthTokens>('/auth/verify/', {
    method: 'POST',
    body: payload,
  })
}

export function refresh(refreshToken: string) {
  return apiRequest<{ access: string }>('/auth/refresh/', {
    method: 'POST',
    body: { refresh: refreshToken },
  })
}
