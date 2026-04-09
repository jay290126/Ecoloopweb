import React, { createContext, useContext, useMemo, useState } from 'react'
import { api, getApiErrorMessage } from '../services/api'

export type User = {
  id: string
  username: string
  email: string
}

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthed: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [user, setUser] = useState<User | null>(readStoredUser())

  const isAuthed = !!token

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthed,
      async login(email, password) {
        const res = await api.post('/login', { email, password })
        const nextToken = res.data?.token as string
        const nextUser = res.data?.user as User
        localStorage.setItem('token', nextToken)
        localStorage.setItem('user', JSON.stringify(nextUser))
        setToken(nextToken)
        setUser(nextUser)
      },
      async register(username, email, password) {
        const res = await api.post('/register', { username, email, password })
        const nextToken = res.data?.token as string
        const nextUser = res.data?.user as User
        localStorage.setItem('token', nextToken)
        localStorage.setItem('user', JSON.stringify(nextUser))
        setToken(nextToken)
        setUser(nextUser)
      },
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      },
      async refreshProfile() {
        try {
          const res = await api.get('/profile')
          const nextUser = res.data?.user as User
          localStorage.setItem('user', JSON.stringify(nextUser))
          setUser(nextUser)
        } catch (err) {
          const msg = getApiErrorMessage(err)
          if (msg.toLowerCase().includes('token')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setUser(null)
          }
          throw err
        }
      },
    }),
    [user, token, isAuthed],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

