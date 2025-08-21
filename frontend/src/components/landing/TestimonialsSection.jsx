import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const TestimonialCard = ({ quote, author, role }) => (
  <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
    <div className="flex text-yellow-400 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" />)}
    </div>
    <p className="text-gray-700 italic">"{quote}"</p>
    <div className="mt-4">
      <p className="font-bold text-gray-800">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </motion.div>
);

export default function TestimonialsSection() {
    return (
        <motion.section
        id='testimonials'
            className="py-20 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
        >
            <div className="container mx-auto px-4">
                <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center mb-12 text-gray-900">
                    Loved by Users Everywhere
                </motion.h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        quote="This app completely changed how I approach my diet. The AI nutritionist is a game-changer!"
                        author="Sarah J."
                        role="Fitness Enthusiast"
                    />
                    <TestimonialCard 
                        quote="Finally, a tracker that's actually easy to use. I've been more consistent than ever."
                        author="Michael B."
                        role="Busy Professional"
                    />
                    <TestimonialCard 
                        quote="The data and insights are incredible. I've learned so much about my own habits."
                        author="Jessica L."
                        role="Marathon Runner"
                    />
                    
                </div>
            </div>
        </motion.section>
    );
}
