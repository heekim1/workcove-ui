import { ApiError, type ApiErrorBody } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `JWT ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  let data: unknown = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, (data as ApiErrorBody) || { detail: 'Request failed' })
  }

  return data as T
}

export function formatFieldErrors(body: ApiErrorBody): string {
  if (typeof body.detail === 'string') {
    return body.detail
  }

  const parts: string[] = []
  for (const [key, value] of Object.entries(body)) {
    if (key === 'detail' || key === 'code') continue
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(' ')}`)
    } else if (typeof value === 'string') {
      parts.push(`${key}: ${value}`)
    }
  }

  return parts.length > 0 ? parts.join(' ') : 'Something went wrong'
}
