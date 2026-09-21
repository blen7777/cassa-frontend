import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STATIC_USERNAME = 'devcassa'
const STATIC_PASSWORD = 'cassa123'
const STORAGE_KEY = 'cassa_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (username, password) => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      const loggedUser = { username }
      setUser(loggedUser)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
