import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Utensils, Dumbbell, BookOpen, BarChart2, Bot, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { to: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile', icon: <User size={20} />, text: 'Profile' },
    { to: '/log-meal', icon: <Utensils size={20} />, text: 'Log Meal' },
    { to: '/log-workout', icon: <Dumbbell size={20} />, text: 'Log Workout' },
    { to: '/blogs', icon: <BookOpen size={20} />, text: 'Blogs' },
    { to: '/summary', icon: <BarChart2 size={20} />, text: 'Summary' },
    { to: '/chatbot', icon: <Bot size={20} />, text: 'AI Nutritionist' },
  ];

  // On mobile, close sidebar when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r z-40 w-64 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          <h1 className="text-xl font-bold text-gray-800">Fitkeep</h1>
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
