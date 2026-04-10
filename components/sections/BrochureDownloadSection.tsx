'use client';

import { motion } from 'framer-motion';
import { BrochureDownloadForm } from '@/components/forms/BrochureDownloadForm';
import { Store, BookOpen, FileText } from 'lucide-react';

const brochureHighlights = [
  {
    icon: <Store className="text-[#C8A96E]" size={24} />,
    title: "Outlet Formats",
    description: "Compare our Kiosk, Standard, and Premium Lounge formats to find the right fit."
  },
  {
    icon: <BookOpen className="text-[#C8A96E]" size={24} />,
    title: "SOPs & Ongoing Support",
    description: "Learn about our standardized processes and training programs designed to help you run operations efficiently."
  }
];

export function BrochureDownloadSection() {
  return (
    <section className="py-24 bg-[#006437] text-white border-t border-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium tracking-wide mb-6">
              <FileText size={16} className="text-[#C8A96E]" />
              <span className="text-white/90 uppercase tracking-widest text-xs">Official Document</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
              <span className="block mb-2">Explore the</span>
              <span className="block mb-2 text-[#C8A96E]">T Vanamm</span>
              <span className="block">Opportunity.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl font-light">
              We've compiled essential information about partnering with our growing tea franchise into one comprehensive brochure.
            </p>

            <div className="space-y-8 mt-12 hidden md:block">
              {brochureHighlights.map((highlight, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-blur-sm">
                    {highlight.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-playfair mb-1">{highlight.title}</h4>
                    <p className="text-white/70 font-light leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="bg-gray-50 rounded-2xl p-7 md:p-10 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#C8A96E] rounded-full blur-3xl opacity-20 hidden md:block" />
              
              <div className="text-center mb-8 relative z-10">
                <h3 className="text-2xl font-playfair font-bold text-[#006437] mb-2">
                  Get the Brochure Now
                </h3>
                <p className="text-gray-500 text-sm">
                  Fill in your details below to instantly access the PDF.
                </p>
              </div>

              <div className="relative z-10">
                <BrochureDownloadForm />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
