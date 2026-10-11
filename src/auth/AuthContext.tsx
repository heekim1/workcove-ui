import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import type {
  AuthTokens,
  LoginChallenge,
  LoginPayload,
  RegisterPayload,
  User,
  VerifyPayload,
} from '../types'

const STORAGE_KEY = 'workcove.auth'
const PENDING_KEY = 'workcove.pendingLogin'

type StoredAuth = {
  access: string
  refresh: string
  user: User
}

type PendingLogin = LoginChallenge & {
  email: string
  /** Session-only so verify can resend without returning to login. */
  password: string
}

type AuthContextValue = {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  pendingLogin: PendingLogin | null
  register: (payload: RegisterPayload) => Promise<User>
  login: (payload: LoginPayload) => Promise<LoginChallenge>
  resendLoginCode: () => Promise<LoginChallenge>
  verify: (payload: VerifyPayload) => Promise<AuthTokens>
  logout: () => void
  clearPendingLogin: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function writeStoredAuth(value: StoredAuth | null) {
  if (!value) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function readPendingLogin(): PendingLogin | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingLogin
    if (!parsed?.challenge_id || !parsed?.email || !parsed?.password) return null
    return parsed
  } catch {
    return null
  }
}

function writePendingLogin(value: PendingLogin | null) {
  if (!value) {
    sessionStorage.removeItem(PENDING_KEY)
    return
  }
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(value))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredAuth | null>(() => readStoredAuth())
  const [pendingLogin, setPendingLoginState] = useState<PendingLogin | null>(() => readPendingLogin())
  const pendingRef = useRef<PendingLogin | null>(pendingLogin)

  const setPendingLogin = useCallback((value: PendingLogin | null) => {
    pendingRef.current = value
    writePendingLogin(value)
    setPendingLoginState(value)
  }, [])

  const persist = useCallback((value: StoredAuth | null) => {
    writeStoredAuth(value)
    setStored(value)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    return authApi.register(payload)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const challenge = await authApi.login(payload)
      setPendingLogin({
        ...challenge,
        email: payload.email,
        password: payload.password,
      })
      return challenge
    },
    [setPendingLogin],
  )

  const resendLoginCode = useCallback(async () => {
    const current = pendingRef.current
    if (!current) {
      throw new Error('No pending login to resend')
    }
    const challenge = await authApi.login({
      email: current.email,
      password: current.password,
    })
    setPendingLogin({
      ...challenge,
      email: current.email,
      password: current.password,
    })
    return challenge
  }, [setPendingLogin])

  const verify = useCallback(
    async (payload: VerifyPayload) => {
      const tokens = await authApi.verify(payload)
      persist({
        access: tokens.access,
        refresh: tokens.refresh,
        user: tokens.user,
      })
      setPendingLogin(null)
      return tokens
    },
    [persist, setPendingLogin],
  )

  const logout = useCallback(() => {
    persist(null)
    setPendingLogin(null)
  }, [persist, setPendingLogin])

  const clearPendingLogin = useCallback(() => {
    setPendingLogin(null)
  }, [setPendingLogin])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: stored?.user ?? null,
      accessToken: stored?.access ?? null,
      isAuthenticated: Boolean(stored?.access),
      pendingLogin,
      register,
      login,
      resendLoginCode,
      verify,
      logout,
      clearPendingLogin,
    }),
    [
      stored,
      pendingLogin,
      register,
      login,
      resendLoginCode,
      verify,
      logout,
      clearPendingLogin,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
