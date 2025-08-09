// src/pages/LandingPage.jsx
import React from "react";
import Button from "../components/ui/Button";
export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Stop Guessing, <br /> Start Achieving.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            Your all-in-one tool for intelligent calorie & macro tracking. 
            Eat smarter, train better, and see results faster.
          </p>
          <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-6">
           <Button class=" btn-light px-6 py-3" text="Join Now" url="/register"/>
            <a
              href="#features"
              className="bg-transparent border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-600 transition text-center"
            >
              Learn More
            </a>
          </div>
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
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Powerful Features for Lasting Results</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-green-500 text-4xl mb-4">🍎</div>
              <h3 className="font-semibold text-lg mb-2">Effortless Meal Tracking</h3>
              <p className="text-gray-600">
                Log meals in seconds and get accurate macro & calorie breakdowns instantly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-blue-500 text-4xl mb-4">🏋️‍♂️</div>
              <h3 className="font-semibold text-lg mb-2">Smart Workout Integration</h3>
              <p className="text-gray-600">
                Track calories burned and sync your workouts seamlessly with your goals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-purple-500 text-4xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Nutritionist</h3>
              <p className="text-gray-600">
                Get personalized meal plans & tips from your AI coach, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="w-full py-16 px-6 md:px-16 bg-white">
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
      <section className="w-full py-16 px-6 md:px-16 bg-gradient-to-r from-green-400 to-blue-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
        <p className="mb-6 text-lg">Join thousands of others achieving their goals with our app.</p>
        <a
          href="/signup"
          className="bg-white text-blue-600 font-bold px-8 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Sign Up for Free
        </a>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 py-6 text-sm bg-gray-100">
        © 2025 Healthily. All rights reserved.
      </footer>
    </div>
  );
}
