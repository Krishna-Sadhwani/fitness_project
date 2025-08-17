import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Correctly import the real hook
import { useState } from 'react';
import ConfirmationModal from '../ui/ConfirmationModal'; // Import the modal component

function Header({ toggleSidebar }) {
const { accessToken, logoutUser } = useAuth();
console.log("Access Token in Header:", accessToken);

 const [isModalOpen, setModalOpen] = useState(false);

 const handleLogoutClick = () => {
    // Instead of logging out directly, just open the modal
    setModalOpen(true);
  };
   const handleConfirmLogout = () => {
    // This is where the actual logout happens
    logoutUser();
    setModalOpen(false);
  };
  // --- RENDER LOGIC ---
  // We conditionally render a different header based on the login state.
  if (accessToken) {
    // --- LOGGED-IN HEADER ---
    return (
      <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 h-16">
          {/* Left Side: Sidebar Toggle */}
          <div className="flex-1 flex justify-start">
           <button 
  onClick={toggleSidebar}
  className="text-gray-600 p-2 rounded-full hover:bg-gray-100" // <-- Removed md:hidden
>
  <Menu size={24} />
</button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">F</div>
              <span className="font-bold text-xl text-gray-800">Fitkeep</span>
            </Link>
          </div>

          {/* Right Side: Profile & Logout */}
          <div className="flex-1 flex justify-end items-center gap-4">
             <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                <UserCircle size={28} />
             </Link>
             <button
               onClick={handleLogoutClick}
               className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors"
             >
               Logout
             </button>
          </div>
        </nav>
      </header>
       <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmLogout}
          title="Confirm Logout"
        >
          Are you sure you want to log out?
        </ConfirmationModal>
</>
    );
  }

  // --- LOGGED-OUT (LANDING PAGE) HEADER ---
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-xl text-gray-800">Fitkeep</span>
        </Link>

        {/* Links (hidden on mobile) */}
        <div className="hidden md:flex gap-8 text-gray-600 font-semibold">
          <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
          <a href="#blog" className="hover:text-blue-500 transition-colors">Blog</a>
        </div>

        {/* CTA Buttons */}
         <div className="flex gap-4 items-center">
            <Link to="/login" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/register" className="rounded-lg px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105 transition">Get Started</Link>
         </div>
      </nav>
    </header>
  );
}

export default Header;
