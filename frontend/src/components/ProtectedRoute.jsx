import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  // Get both the user and the loading state from the context
  const { user, loading } = useAuth()

  // 1. While the context is checking for a token, show a loading indicator.
  //    This prevents a premature redirect.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // 2. After loading is finished, if there is no user, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If loading is done and there is a user, show the protected page.
  return children;
}

export default ProtectedRoute