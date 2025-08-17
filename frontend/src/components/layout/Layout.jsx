import React from 'react'; // No longer need useState
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../ui/Header';

// The component now correctly receives isOpen and toggleSidebar as props
export default function Layout({ isOpen, toggleSidebar }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* It passes the props down to the Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* It passes the toggle function to the Header */}
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
