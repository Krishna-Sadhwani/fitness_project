import React from 'react'; // No longer need useState
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

// It now receives isOpen and toggleSidebar as props
const Layout = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Pass the props down to the Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* This mobile header is inside the layout, you might not need it 
            if your main Header component handles the mobile menu button */}
        <header className="flex justify-between items-center p-4 bg-white border-b md:hidden h-16">
          <button onClick={toggleSidebar} className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Fitkeep</h1>
          <div className="w-8"></div> {/* Spacer */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;