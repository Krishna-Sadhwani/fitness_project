// src/pages/LandingPage.jsx
import React from 'react'
import Button from '../components/ui/Button'

const HeroSection = () => (
  <section className="text-center py-20 bg-white">
    <h1 className="text-5xl font-bold mb-4">Track Your Fitness Journey</h1>
    <p className="text-xl text-gray-600">Achieve your health goals with precision and intelligence.</p>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Calorie Tracking</h3>
          <p>Log meals and monitor your daily intake effortlessly.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Workout Logging</h3>
          <p>Track your exercises and calories burned.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">AI Nutritionist</h3>
          <p>Get smart suggestions and meal plans from our AI.</p>
        </div>
      </div>
    </div>
  </section>
);

// Add Testimonial and Footer components similarly

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <HeroSection />
      <FeaturesSection />
      {/* Add Testimonials and other sections here */}
    </div>
  );
}
