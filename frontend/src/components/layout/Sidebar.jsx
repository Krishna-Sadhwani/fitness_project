import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, Utensils, Dumbbell, BookOpen, Bot, LogOut, X,BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
  { to: '/profile', icon: <User size={20} />, text: 'Profile' },
  { to: '/log-meal', icon: <Utensils size={20} />, text: 'Log Meal' },
  { to: '/log-workout', icon: <Dumbbell size={20} />, text: 'Log Workout' },
  { to: '/blogs', icon: <BookOpen size={20} />, text: 'Blogs' },
    { to: '/analysis', icon: <BarChart2 size={20} />, text: 'Analysis' },

  { to: '/ai-nutritionist', icon: <Bot size={20} />, text: 'AI Nutritionist' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  console.log("Sidebar open?", isOpen); // ✅ Debug line here

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  // On mobile, close sidebar when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* --- 1. OVERLAY ADDED --- */}
      {/* This overlay appears on mobile to close the sidebar when clicked */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

<aside className={`fixed top-10 left-0 h-[calc(100vh-4rem)] bg-white border-r z-40 w-64 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>     <div className="p-4 border-b h-16 flex items-center justify-between">
          {/* <h1 className="text-xl font-bold">FitKeep</h1> */}
          {/* --- 2. CLOSE BUTTON ADDED --- */}
          {/* This button is only visible on mobile screens */}
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  onClick={handleLinkClick} // Close sidebar on link click
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
