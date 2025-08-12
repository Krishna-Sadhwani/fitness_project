import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Header from './components/ui/Header'
import Register from './components/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
