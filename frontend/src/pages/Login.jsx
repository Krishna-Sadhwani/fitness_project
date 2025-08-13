import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await login({ username, password })
    if (!res.success) setError(res.error)
    else navigate('/profile', { replace: true })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Welcome back</h1>
        <p className="text-gray-500 mb-6 text-sm">Sign in to continue tracking your progress.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded p-2">
              {typeof error === 'string' ? error : 'Please enter valid details'}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login


