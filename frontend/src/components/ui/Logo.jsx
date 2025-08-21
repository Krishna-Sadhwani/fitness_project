import React from 'react'
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <>
    <Link to="/" className="flex items-center space-x-2">
    {/* The image should be placed in your project's `public` folder */}
    <img src="/unnamed.jpeg" alt="Fitkeep Logo" className="w-8 h-8" />
    <span className="font-bold text-xl text-gray-800">Fitkeep</span>
  </Link>
    </>
  )
}

export default Logo