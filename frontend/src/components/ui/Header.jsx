import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { accessToken, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-xl text-gray-800">Fitkeep</span>
        </Link>

        {/* Links (hidden on mobile) */}
        <div className="hidden md:flex gap-8 text-gray-600 font-semibold">
          <a href="#features" className="hover:text-brand transition-colors">Features</a>
          <a href="#blog" className="hover:text-brand transition-colors">Blog</a>
          <Link to="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>
          <Link to="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link>

        </div>

        {/* CTA Buttons */}
         <div className="flex gap-4 items-center">
           {accessToken ? (
             // --- Logged-in State ---
             <>
               <Link to="/dashboard" className="text-gray-600 hover:text-brand font-semibold transition-colors">Dashboard</Link>
               <button
                 onClick={logout}
                 className="bg-red-500 text-white rounded px-4 py-2 font-semibold hover:bg-red-400 transition-colors"
               >
                 Logout
               </button>
             </>
           ) : (
             // --- Logged-out State ---
             <>
                {/* <Link to="/login" className="text-gray-600 hover:text-brand font-semibold transition-colors">Sign In</Link> */}
                <Link to="/login" className="rounded px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105 transition">Sign In</Link>
                <Link to="/register" className="rounded px-4 py-2 font-semibold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:brightness-105 transition">Get Started</Link>
             </>
           )}
         </div>
      </nav>
    </header>
  );
}

export default Header;
  