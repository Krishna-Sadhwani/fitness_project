import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="text-center py-24 md:py-32 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight"
        >
          Stop Guessing.
          <span className="block text-green-600">Start Achieving.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-600"
        >
          The smartest, simplest way to track your fitness. Get personalized insights and reach your health goals faster than ever before.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            to="/register" 
            className="mt-10 inline-flex items-center justify-center bg-green-500 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-green-600 transition-transform hover:scale-105 shadow-lg shadow-green-500/30"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
