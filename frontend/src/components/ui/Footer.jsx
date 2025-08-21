import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">F</div>
              <span className="font-bold text-xl text-gray-800">Fitkeep</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">Your ultimate fitness partner.</p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#features" className="hover:text-green-600">Features</a></li>
              <li><a href="#dashboard-preview" className="hover:text-green-600">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-green-600">Testimonials</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/blogs" className="hover:text-green-600">Blog</Link></li>
              <li><a href="#" className="hover:text-green-600">Support</a></li>
              <li><a href="#" className="hover:text-green-600">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Fitkeep. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-green-600"><Twitter size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-green-600"><Instagram size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-green-600"><Facebook size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
