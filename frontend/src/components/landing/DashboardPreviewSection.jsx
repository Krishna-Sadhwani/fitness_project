import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function DashboardPreviewSection() {
    return (
        <motion.section
        id='dashboard-preview'
            className="py-20 bg-gray-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
        >
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900">A Dashboard You'll Love to Use</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    All your daily stats, beautifully organized. See your progress at a glance and stay motivated.
                </p>
                <motion.div 
                    className="mt-12 max-w-4xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <img 
                        src="/dashboard-preview.png" 
                        alt="Dashboard Preview" 
                        className="rounded-2xl shadow-2xl border-4 border-white"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}
