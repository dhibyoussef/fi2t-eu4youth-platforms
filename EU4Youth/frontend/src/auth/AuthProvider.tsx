import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type CmsUser } from '../api/client'

type AuthState = {
  token: string | null
  user: CmsUser | null
  ready: boolean
  setAuth: (token: string, user: CmsUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function clearSession() {
  localStorage.removeItem('eu4y_token')
  localStorage.removeItem('eu4y_user')
  if (typeof document !== 'undefined') {
    document.cookie = 'eu4y_token=; Path=/eu4youth; SameSite=Lax; Max-Age=0'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('eu4y_token'))
  const [user, setUser] = useState<CmsUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eu4y_token')
    if (!saved) {
      clearSession()
      setToken(null)
      setUser(null)
      setReady(true)
      return
    }
    api
      .get('/auth/me')
      .then((res) => {
        const next = { ...(res.data.user || res.data), permissions: res.data.permissions || {} }
        localStorage.setItem('eu4y_user', JSON.stringify(next))
        setToken(saved)
        setUser(next)
      })
      .catch(() => {
        clearSession()
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      ready,
      setAuth: (nextToken, nextUser) => {
        localStorage.setItem('eu4y_token', nextToken)
        localStorage.setItem('eu4y_user', JSON.stringify(nextUser))
        if (typeof document !== 'undefined') {
          document.cookie = `eu4y_token=${encodeURIComponent(nextToken)}; Path=/eu4youth; SameSite=Lax; Max-Age=${8 * 3600}`
        }
        setToken(nextToken)
        setUser(nextUser)
      },
      logout: () => {
        api.post('/auth/logout').catch(() => undefined)
        clearSession()
        setToken(null)
        setUser(null)
      },
    }),
    [token, user, ready],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
