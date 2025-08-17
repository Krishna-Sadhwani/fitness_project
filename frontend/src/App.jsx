import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout Components
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Register from './components/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LogMeal from './pages/Meals';
import LogWorkout from './pages/Workouts';
import Blogs from './pages/Blogs';
import Chatbot from './pages/Chatbot';
import Analysis from './pages/Analysis';
import './App.css';
import Meals from './pages/Meals';

// --- NEW: A dedicated layout for public-facing pages ---
// This ensures the landing page header is completely separate from the app's header.
const PublicLayout = () => (
  <>
    {/* This Header will be the logged-out version */}
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  // The state for the sidebar is managed here, in the main App component.
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* These routes use the simple PublicLayout. */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* --- Auth Routes --- */}
      {/* These routes are standalone and don't use a shared layout. */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* --- Protected App Routes --- */}
      {/* All protected routes are nested inside the main Layout, which contains the sidebar and the dynamic header. */}
      <Route 
        element={
          <ProtectedRoute>
            {/* The state and toggle function are passed down to the main Layout. */}
            <Layout isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/log-meal" element={<Meals />} />
        <Route path="/log-workout" element={<LogWorkout />} />
        <Route path="/blogs" element={<Blogs />} />
         <Route path="/analysis" element={<Analysis />} />

        <Route path="/ai-nutritionist" element={<Chatbot />} />
      </Route>
    </Routes>
  );
}

export default App;
