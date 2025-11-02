import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle ,LogOut} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState,useRef,useEffect } from 'react';
import ConfirmationModal from '../ui/ConfirmationModal'; 
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/client'; 



function Header({ toggleSidebar }) {

 const { accessToken, logoutUser, user } = useAuth(); 
 console.log("Access Token in Header:", accessToken);

  const [isModalOpen, setModalOpen] = useState(false);
const [isDropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (accessToken) {
        try {
          const res = await apiClient.get('/auth/profile/');
          if (res.data.profile_picture) {
            setProfilePictureUrl(res.data.profile_picture);
          }
        } catch (error) {
          console.error("Failed to fetch profile picture", error);
        }
      }
    };
    fetchProfilePicture();
  }, [accessToken]); 


 const handleLogoutClick = () => {
    setModalOpen(true);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


   const handleConfirmLogout = () => {
    logoutUser();
    setModalOpen(false);
  };
  if (accessToken) {
    return (
      <>
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 h-16">
            <div className="flex-1 flex justify-start">
              <button onClick={toggleSidebar} className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <Menu size={24} />
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <Logo />
            </div>
            <div className="flex-1 flex justify-end items-center gap-4">
               <div className="relative" ref={dropdownRef}>
                 <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                   {profilePictureUrl ? (
                     <img src={profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                   ) : (
                     <UserCircle size={32} className="text-gray-600" />
                   )}
                 </button>
                 <AnimatePresence>
                   {isDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                     >
                       <div className="px-4 py-2 border-b">
                         <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                       </div>
                       <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                         <UserCircle size={16} /> Profile
                       </Link>
                       <button onClick={handleLogoutClick} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                         <LogOut size={16} /> Logout
                       </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
       <Logo/>
        <div className="hidden md:flex gap-8 text-gray-600 font-semibold">
          <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
          <a href="#dashboard-preview" className="hover:text-green-600 transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-green-600 transition-colors">Testimonials</a>
          <Link to="/blogs" className="hover:text-green-600 transition-colors">Blog</Link>
        </div>

        <div className="flex gap-4 items-center">
            <Link to="/login" className="font-semibold text-gray-600 hover:text-green-600 transition-colors">Sign In</Link>
            <Link to="/register" className="bg-green-500 text-white rounded-full px-5 py-2 font-semibold shadow-sm hover:bg-green-600 transition-colors">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
