import React from 'react'

function Header() {
  
   return (
    <header className="w-full bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Fitkeep Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-gray-800">Fitkeep</span>
        </div>

        {/* Links (hidden on mobile) */}
        <div className="hidden md:flex gap-8 text-gray-500 font-medium">
          <a href="#features" className="hover:text-gray-800">
            Features
          </a>
          <a href="#testimonials" className="hover:text-gray-800">
            Testimonials
          </a>
          <a href="#pricing" className="hover:text-gray-800">
            Pricing
          </a>
          <a href="#download" className="hover:text-gray-800">
            Download
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <a
            href="/login"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white rounded px-4 py-2 font-semibold shadow hover:from-green-500 hover:to-blue-500 transition"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
  
}

export default Header