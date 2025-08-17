//
// File 1: AuthContext.jsx (Corrected)
//
// This file is now updated to read, write, and manage two separate tokens
// ('accessToken' and 'refreshToken') from localStorage.
//

import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';
// --- CHANGE: Corrected the import syntax for jwt-decode ---
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // --- CHANGE: State is now managed for each token individually ---
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs whenever the accessToken changes.
    if (accessToken) {
      // Set the user from the new token
      // --- CHANGE: Corrected the function call to match the import ---
      setUser(jwtDecode(accessToken)); 
      // Update the default headers for apiClient
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      // If no token, clear the user and headers
      setUser(null);
      delete apiClient.defaults.headers.Authorization;
    }
    setLoading(false);
  }, [accessToken]);

  const loginUser = async (username, password) => {
    try {
      const response = await apiClient.post('/token/', { username, password });
      const data = response.data;
      
      // --- CHANGE: Set and save tokens separately ---
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

    } catch (error) {
      // Re-throw the error so the Login component can catch it and display a message
      throw error;
    }
  };

  const logoutUser = () => {
    // --- CHANGE: Clear separate tokens from state and localStorage ---
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loginUser,
    logoutUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};