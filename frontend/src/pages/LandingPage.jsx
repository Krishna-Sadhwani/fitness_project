// src/pages/LandingPage.jsx
import React from 'react'
import Button from '../components/ui/Button'

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Minimal Calorie & Workout Tracker
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/90">
              Log meals, track calories and workouts, and publish your progress on a clean, distraction-free platform.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a href="/dashboard" className="px-6 py-3 rounded font-semibold text-black bg-white hover:brightness-105 transition text-center">
                Start Tracking
              </a>
              <a href="#features" className="px-6 py-3 rounded font-semibold text-light bg-red text-center">
                Explore features
              </a>
            </div>
            <div className="mt-4 flex gap-6 text-white/80 text-sm">
              <span>Calorie tracking</span>
              <span>Meal logging</span>
              <span>Workout tracking</span>
              <span>AI nutritionist</span>
            </div>
          </div>
          <img src="/vite.svg" alt="App preview" className="w-full max-w-md justify-self-center opacity-90" />
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="w-full py-16 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Tired of the Guesswork?</h2>
            <p className="text-gray-600 mb-6">
              Tracking your nutrition and workouts shouldn't feel like a second job. 
              No more messy spreadsheets, confusing apps, or guessing what to eat.
            </p>
            <h3 className="text-2xl font-semibold mb-4">We’ve Got the Solution.</h3>
            <p className="text-gray-600">
              Our app combines AI-powered nutrition tracking, smart workout integration, 
              and effortless meal logging — so you can focus on achieving your goals, not on calculations.
            </p>
          </div>
          <img
            src="/mockup-app.png"
            alt="App preview"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-16 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Everything you need, nothing you don’t</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">A focused toolkit for building healthy habits with clarity and ease.</p>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition text-left">
              <div className="text-brand text-4xl mb-4">🔥</div>
              <h3 className="font-semibold text-lg mb-2">Calorie tracking</h3>
              <p className="text-gray-600">Smart goals and clear daily targets.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition text-left">
              <div className="text-brand text-4xl mb-4">🍽️</div>
              <h3 className="font-semibold text-lg mb-2">Meal logging</h3>
              <p className="text-gray-600">Quick entries with saved favorites.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition text-left">
              <div className="text-brand text-4xl mb-4">🏋️‍♂️</div>
              <h3 className="font-semibold text-lg mb-2">Workout tracking</h3>
              <p className="text-gray-600">Plan routines and track progress.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition text-left">
              <div className="text-brand text-4xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Nutritionist</h3>
              <p className="text-gray-600">Personalized advice, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="w-full py-16 px-6 md:px-16 bg-white" id="blog">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">
                “This app made tracking my diet so easy! I’ve lost 8kg without stress.”
              </p>
              <p className="font-bold">Priya S.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">
                “The AI nutritionist is like having a personal coach in my pocket.”
              </p>
              <p className="font-bold">Rahul K.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">
                “Meal logging takes seconds — and the results speak for themselves.”
              </p>
              <p className="font-bold">Ankita J.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 px-6 md:px-16 bg-gradient-to-br from-brand to-brandDark text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
        <p className="mb-6 text-lg">Join others building sustainable habits with Fitkeep.</p>
        <a href="/register" className="px-8 py-3 rounded font-bold text-black bg-white transition">Get started</a>
      </section>

      {/* Footer */}
      
    </div>
  );
}
