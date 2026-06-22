import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(res => setBusiness(res.data))
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, businessData) => {
    localStorage.setItem('token', token)
    setBusiness(businessData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setBusiness(null)
    window.location.href = '/'
  }

  // Allows any component to patch business fields without a full re-login
  const updateBusiness = (patch) => {
    setBusiness(prev => prev ? { ...prev, ...patch } : prev)
  }

  return (
    <AuthContext.Provider value={{ business, login, logout, loading, updateBusiness }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)