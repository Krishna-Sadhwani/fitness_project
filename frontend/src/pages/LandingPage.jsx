// src/pages/LandingPage.jsx

import React from "react";

export default function LandingPage() {
  return (
    <div className="-h-screen w-full bg-gradient-to-br from-[#e8f9f5] to-[#f6faff] font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm w-full">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Healthily Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-gray-800">Healthily</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-500 font-medium">
          <a href="#features" className="hover:text-gray-800">Features</a>
          <a href="#testimonials" className="hover:text-gray-800">Testimonials</a>
          <a href="#pricing" className="hover:text-gray-800">Pricing</a>
          <a href="#download" className="hover:text-gray-800">Download</a>
        </div>
        <div className="flex gap-3">
          <a href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Sign In</a>
          <a href="/signup" className="ml-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded px-4 py-2 font-semibold shadow hover:from-green-500 hover:to-blue-500 transition">Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-14 px-6 md:px-16 text-center md:text-left w-full">
        <div className="w-full">
          <div className="inline-flex items-center mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs mr-2">🏆 #1 Fitness App 2024</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Transform Your <span className="text-gradient bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Body</span>,
            <br className="hidden md:block" />
            Transform Your <span className="text-gradient bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Life</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8">
            Join thousands taking control of their fitness journey with AI-powered workouts, smart nutrition tracking, and a supportive community.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mb-6">
            <a href="/signup" className="inline-flex items-center bg-gradient-to-r from-green-400 to-blue-400 text-white px-5 py-2 rounded font-semibold shadow hover:from-green-500 hover:to-blue-500 transition">
              Get Started →
            </a>
            <a href="#demo" className="inline-flex items-center bg-white border border-gray-200 hover:bg-gray-100 px-5 py-2 rounded font-semibold text-gray-700">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14.752 11.168l-6.518-3.759A1 1 0 0 0 7 8.059v7.882a1 1 0 0 0 1.234.97l6.518-1.408A1 1 0 0 0 15 15.94v-2.118a1 1 0 0 0-.248-.654z" /></svg>
              Watch Demo
            </a>
          </div>
          <div className="flex justify-center md:justify-start items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center"><span className="text-yellow-400 mr-1">★</span> 4.9/5 Rating</span>
            <span>· 500K+ Downloads</span>
            <span>· 30+ Countries</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white w-full px-6 md:px-16">
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">Powerful Features for a Healthier You</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">AI Workout Plans</h3>
              <p className="text-gray-500">Personalized fitness plans that adapt as you progress. Achieve your goals faster with routines designed for you.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Nutrition Tracking</h3>
              <p className="text-gray-500">Effortlessly log meals and track calories, macros, and nutrients with our smart nutrition platform.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M7 8h10M7 16h10M7 12h4" /></svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Community Support</h3>
              <p className="text-gray-500">Stay motivated with challenges, leaderboards, and a community of like-minded achievers cheering you on.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-b from-[#f6faff] to-[#e8f9f5] w-full px-6 md:px-16">
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">What Our Users Say</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow p-6 rounded-lg">
              <p className="text-gray-700 mb-4">“Finally a fitness app that keeps me on track! Logging meals is a breeze and the weekly reports keeps my motivation high.”</p>
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full ring-2 ring-green-400" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                <div className="ml-3">
                  <p className="font-bold text-gray-800">Priya S.</p>
                  <p className="text-xs text-gray-500">Mumbai, India</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
              <p className="text-gray-700 mb-4">“The AI-powered workout suggestions feel like having a real coach. My energy and health have never been better!”</p>
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full ring-2 ring-blue-400" src="https://randomuser.me/api/portraits/men/22.jpg" alt="" />
                <div className="ml-3">
                  <p className="font-bold text-gray-800">Rahul K.</p>
                  <p className="text-xs text-gray-500">Delhi, India</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
              <p className="text-gray-700 mb-4">“I've lost 10kg thanks to Healthily! Friendly community and tracking tools make it fun and easy to stick with my plan.”</p>
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full ring-2 ring-purple-400" src="https://randomuser.me/api/portraits/women/32.jpg" alt="" />
                <div className="ml-3">
                  <p className="font-bold text-gray-800">Ankita J.</p>
                  <p className="text-xs text-gray-500">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 w-full">
        © 2025 Healthily. All rights reserved.
      </footer>
    </div>
  );
}
