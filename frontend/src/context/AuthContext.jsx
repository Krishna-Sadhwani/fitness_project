import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import apiClient from '../api/client'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    } else {
      localStorage.removeItem('accessToken')
    }
  }, [accessToken])

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
  }, [refreshToken])

  const login = async ({ username, password }) => {
    setLoading(true)
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password })
      // Write tokens immediately so interceptors can read them for the next request
      localStorage.setItem('accessToken', res.data.access)
      localStorage.setItem('refreshToken', res.data.refresh)
      setAccessToken(res.data.access)
      setRefreshToken(res.data.refresh)
      // Optionally fetch user profile
      try {
        const profileRes = await apiClient.get('/auth/profile/', {
          headers: { Authorization: `Bearer ${res.data.access}` },
        })
        const profile = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data
        setUser({ username, profile })
      } catch {
        setUser({ username })
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.response?.data || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } catch {}
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ accessToken, refreshToken, user, login, logout, loading }), [accessToken, refreshToken, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


