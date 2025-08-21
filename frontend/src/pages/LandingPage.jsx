import React from 'react';

// Import the section components
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';

export default function LandingPage() {
  // All modal logic has been moved to the PublicLayout in App.jsx
  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <HeroSection />
      <FeatureSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
    </div>
  );
}
