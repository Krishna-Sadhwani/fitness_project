import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle ,LogOut , X} from 'lucide-react';
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
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
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
        {/* <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 h-16"> */}
          {/* We are still using Tailwind classes.
  'flex-1' makes an element grow and shrink.
  'ml-auto' pushes an element all the way to the right.
*/}
<header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
  {/* CHANGE: Removed 'justify-between'. We will control spacing 
    with 'ml-auto' on the right-most item. Added 'gap-4' for spacing.
  */}
  <nav className="max-w-7xl mx-auto flex items-center px-4 sm:px-6 py-3 h-16 gap-4">
            {/* <div className="flex-1 flex justify-start">
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
                 </button> */}
                 {/* Section 1: Hamburger Menu (Left)
      CHANGE: Removed 'flex-1' and 'justify-start'. This div will
      now only be as wide as its content (the button).
    */}
    <div className="flex">
      <button onClick={toggleSidebar} className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
        <Menu size={24} />
      </button>
    </div>

    {/* Section 2: Logo (Center)
      CHANGES:
      - Kept 'flex-1' so it takes all available space in the middle.
      - Added 'min-w-0'. This is a key trick that ALLOWS this div 
        to shrink, preventing its content (the logo) from overflowing.
    */}
    <div className="flex-1 flex justify-center min-w-0">
              {/* --- CHANGED --- Pass a prop to the Logo */}
              <Logo isLoggedIn={true} />
            </div>

    {/* Section 3: Profile (Right)
      CHANGES:
      - Removed 'flex-1' and 'justify-end'.
      - Added 'ml-auto' (margin-left: auto). This is the magic
        that pushes this block all the way to the right.
    */}
    <div className="flex items-center gap-4 ml-auto">
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
    // <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
    //   <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
    //    <Logo/>
    //     <div className="hidden md:flex gap-8 text-gray-600 font-semibold">
    //       <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
    //       <a href="#dashboard-preview" className="hover:text-green-600 transition-colors">How It Works</a>
    //       <a href="#testimonials" className="hover:text-green-600 transition-colors">Testimonials</a>
    //       <Link to="/blogs" className="hover:text-green-600 transition-colors">Blog</Link>
    //     </div>

    //     <div className="flex gap-4 items-center">
    //         <Link to="/login" className="font-semibold text-gray-600 hover:text-green-600 transition-colors">Sign In</Link>
    //         <Link to="/register" className="bg-green-500 text-white rounded-full px-5 py-2 font-semibold shadow-sm hover:bg-green-600 transition-colors">Get Started</Link>
    //     </div>
    //   </nav>
    // </header>
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 relative">
      {/* --- CHANGED --- Added 'h-16' for consistent height */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 h-16">
<Logo isLoggedIn={false} />
        {/* --- DESKTOP MIDDLE LINKS --- */}
        <div className="hidden md:flex gap-8 text-gray-600 font-semibold">
          <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
          <a href="#dashboard-preview" className="hover:text-green-600 transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-green-600 transition-colors">Testimonials</a>
          <Link to="/blogs" className="hover:text-green-600 transition-colors">Blog</Link>
        </div>

        {/* --- DESKTOP AUTH BUTTONS --- */}
        {/* --- CHANGED --- Added 'hidden md:flex' to hide on mobile */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/login" className="font-semibold text-gray-600 hover:text-green-600 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-green-500 text-white rounded-full px-5 py-2 font-semibold shadow-sm hover:bg-green-600 transition-colors">Get Started</Link>
        </div>

        {/* --- NEW --- MOBILE HAMBURGER BUTTON --- */}
        {/* This button is ONLY visible on mobile (md:hidden) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- NEW --- MOBILE MENU DROPDOWN --- */}
      {/* This entire block appears when isMobileMenuOpen is true */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100"
          // We add this so clicking any link inside will close the menu
          onClick={closeMobileMenu}
        >
          <nav className="flex flex-col gap-4 p-6">
            {/* All your links, stacked vertically */}
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#dashboard-preview" className="hover:text-green-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-green-600 transition-colors">Testimonials</a>
            <Link to="/blogs" className="hover:text-green-600 transition-colors">Blog</Link>
            
            {/* A divider for neatness */}
            <hr className="my-2" />
            
            {/* Your auth links, stacked at the bottom */}
            <Link to="/login" className="font-semibold text-gray-600 hover:text-green-600 transition-colors">Sign In</Link>
            <Link to="/register" className="bg-green-500 text-white rounded-full px-5 py-2 font-semibold text-center shadow-sm hover:bg-green-600 transition-colors">Get Started</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
