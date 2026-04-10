'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface FranchiseEnquiryFormSectionProps {
  headline?: string;
  subtitle?: string;
  benefits?: string[];
}

const defaultBenefits = [
  "Network information",
  "Menu questions",
  "Events and custom requests",
  "Bulk requests",
  "Support and training assistance"
];

export function FranchiseEnquiryFormSection({ 
  headline = 'How can we help?', 
  subtitle = 'Share a few details and your message. We’ll get back to you during business hours.',
  benefits = defaultBenefits
}: FranchiseEnquiryFormSectionProps) {
  return (
    <section id="franchise-enquiry" className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark via-primary to-primary-dark/90 z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent z-0" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Compliance Badges - Full Width Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16 border-b border-white/10 pb-16">
          {/* MSME Card */}
          <div className="flex items-center gap-6 bg-white/5 px-8 py-6 rounded-2xl border border-white/10 w-full transform hover:bg-white/10 transition-colors duration-300 shadow-xl">
            <div className="bg-white rounded-xl w-[80px] h-[80px] flex items-center justify-center shrink-0 p-3 shadow-inner">
              <Image src="/images/MSME-1.png" alt="" width={64} height={64} className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none mb-1">MSME</span>
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none">REGISTERED</span>
              <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em] mt-2">VERIFIED</span>
            </div>
          </div>
          
          {/* FSSAI Card */}
          <div className="flex items-center gap-6 bg-white/5 px-8 py-6 rounded-2xl border border-white/10 w-full transform hover:bg-white/10 transition-colors duration-300 shadow-xl">
            <div className="bg-white rounded-xl w-[80px] h-[80px] flex items-center justify-center shrink-0 p-3 shadow-inner">
              <Image src="/images/FSSAI-removebg-preview.png" alt="" width={64} height={64} className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none mb-1">FSSAI</span>
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none">COMPLIANT</span>
              <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em] mt-2">VERIFIED</span>
            </div>
          </div>

          {/* GST Card */}
          <div className="flex items-center gap-6 bg-white/5 px-8 py-6 rounded-2xl border border-white/10 w-full transform hover:bg-white/10 transition-colors duration-300 shadow-xl">
            <div className="bg-white rounded-xl w-[80px] h-[80px] flex items-center justify-center shrink-0 p-3 shadow-inner">
              <Image src="/images/GST-removebg-preview.png" alt="" width={64} height={64} className="object-contain w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none mb-1">GST</span>
              <span className="font-extrabold text-white text-base md:text-lg tracking-wider uppercase leading-none">REGISTERED</span>
              <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em] mt-2">VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >


            <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-sm font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)] backdrop-blur-md">
              Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight drop-shadow-md">
              {headline}
            </h2>
            <div className="w-24 h-1.5 bg-accent rounded-full mb-8 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed font-light">
              {subtitle}
            </p>
            
            <ul className="space-y-5 mb-8">
              {benefits.map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className="text-accent group-hover:scale-110 group-hover:text-accent-light transition-all duration-300 drop-shadow">
                    <CheckCircle2 size={24} strokeWidth={2} />
                  </div>
                  <span className="text-white/90 text-lg font-medium tracking-wide group-hover:text-white transition-colors">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 text-gray-900 relative"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[40px] pointer-events-none" />
             <div className="relative z-10">
               <EnquiryForm />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
