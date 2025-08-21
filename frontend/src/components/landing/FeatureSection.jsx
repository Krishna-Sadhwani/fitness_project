import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Dumbbell, Bot, BookOpen } from 'lucide-react'; // 1. Import the BookOpen icon

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const FeatureCard = ({ icon, title, text, iconBgColor, iconTextColor }) => (
  <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${iconBgColor} ${iconTextColor}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mt-6">{title}</h3>
    <p className="mt-2 text-gray-600">{text}</p>
  </motion.div>
);

export default function FeaturesSection() {
  return (
    <motion.section 
      id="features" 
      className="py-20 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center mb-12 text-gray-900">
            Smart Tools for Smarter Results
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Utensils size={28} />}
            title="Effortless Calorie Tracking"
            text="Log meals in seconds with our massive food database and natural language processing."
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <FeatureCard 
            icon={<Dumbbell size={28} />}
            title="AI-Powered Workouts"
            text="Simply describe your workout, and our AI will accurately calculate your calories burned."
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <FeatureCard 
            icon={<Bot size={28} />}
            title="Personal AI Nutritionist"
            text="Get smart suggestions, ask questions, and receive personalized advice 24/7."
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-600"
          />
          <FeatureCard 
            icon={<BookOpen size={28} />}
            title="Community Blog"
            text="Share your journey, read tips from others, and stay motivated with our community."
            iconBgColor="bg-orange-100"
            iconTextColor="text-orange-600"
          />
        </div>
      </div>
    </motion.section>
  );
}
