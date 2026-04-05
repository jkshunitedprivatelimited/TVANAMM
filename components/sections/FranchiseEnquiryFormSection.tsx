'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

interface FranchiseEnquiryFormSectionProps {
  headline?: string;
  subtitle?: string;
  benefits?: string[];
}

const defaultBenefits = [
  "Comprehensive business plan and ROI details",
  "Location selection assistance",
  "Full menu and operations training details",
  "Brand and marketing support overview"
];

export function FranchiseEnquiryFormSection({ 
  headline = 'Start Your Franchise Journey Today', 
  subtitle = 'Fill in your details and our expert franchise team will call you shortly with everything you need to know about setting up your highly profitable T Vanamm outlet.',
  benefits = defaultBenefits
}: FranchiseEnquiryFormSectionProps) {
  return (
    <section id="franchise-enquiry" className="py-24 bg-[#006437] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6 leading-tight">
              {headline}
            </h2>
            <div className="w-24 h-1 bg-[#C8A96E] rounded-full mb-8" />
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              {subtitle}
            </p>
            
            <ul className="space-y-4 mb-8">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 min-w-5 min-h-5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] flex items-center justify-center text-xs">✓</div>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-gray-900"
          >
            <EnquiryForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
