'use client';

import { motion } from 'framer-motion';
import { BrochureDLForm } from '@/components/forms/BrochureDLForm';
import { CheckCircle2, FileText } from 'lucide-react';

const brochureBenefits = [
  "Comprehensive business plan and ROI details",
  "Location selection assistance",
  "Full menu and operations training details",
  "Brand and marketing support overview"
];

export function BrochureDownloadSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-widest uppercase mb-6 shadow-sm">
              <FileText size={16} /> Free Guide
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
              Start Your Franchise Journey Today
            </h2>
            <div className="w-24 h-1.5 bg-accent rounded-full mb-8 shadow-sm" />
            
            <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed font-light">
              Fill in your details and our expert franchise team will call you shortly with everything you need to know about setting up your highly profitable T Vanamm outlet.
            </p>
            
            <ul className="space-y-5 mb-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">What&apos;s inside the brochure:</h4>
              {brochureBenefits.map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle2 size={24} strokeWidth={2} />
                  </div>
                  <span className="text-gray-700 text-lg font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,100,55,0.08)] border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 w-full">
              <BrochureDLForm />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
