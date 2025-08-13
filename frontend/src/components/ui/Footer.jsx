import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} Fitkeep. All rights reserved.</div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <a href="#features" className="hover:text-gray-700">Features</a>
          <a href="#blog" className="hover:text-gray-700">Blog</a>
          <a href="#contact" className="hover:text-gray-700">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer


