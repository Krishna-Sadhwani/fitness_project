import { useState } from 'react'
import './App.css'
import { Routes, Route ,useLocation} from 'react-router-dom'
// ... (other imports)
import Layout from './components/Layout' // Make sure this is imported
import Header from './components/ui/Header'; // Adjust the path if needed
import LandingPage from './pages/LandingPage'
import Register from './components/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Footer from './components/ui/Footer'
import Profile from './pages/Profile'
// import { Routes, Route, useLocation } from 'react-router-dom';
import Meals from './pages/Meals'; // Assuming you have a Meals page  
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Determine if the current page is a dashboard page
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/profile') ||
                          // Add other protected paths here
                          location.pathname.startsWith('/meals');

  return (
    <>
      {/* --- CONDITIONAL RENDERING --- */}
      {/* Only show the main Header on non-dashboard pages */}
      {!isDashboardPage && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          element={
            <ProtectedRoute>
              {/* Pass state and toggle function to the Layout */}
              <Layout isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meals" element={<Meals />} />
          {/* ... other protected routes */}
        </Route>
      </Routes>

      {/* Only show the main Footer on non-dashboard pages */}
      {!isDashboardPage && <Footer />}
    </>
  );
}

export default App;