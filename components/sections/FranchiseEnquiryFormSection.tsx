'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import Image from 'next/image';

import { urlFor } from '@/lib/sanity/image';

interface TrustBadge {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any;
}

interface FranchiseEnquiryFormSectionProps {
  headline?: string;
  subtitle?: string;
  benefits?: string[];
  trustBadges?: TrustBadge[];
}

const defaultTrustBadges = [
  { name: 'MSME Registered', logo: '/images/msme-logo.png' },
  { name: 'FSSAI Compliant', logo: '/images/fssai-logo.png' },
  { name: 'GST Registered', logo: '/images/gst-logo.png' },
  { name: 'GMP Certified', logo: '/images/gmp.png' },
  { name: 'ISO Certified', logo: '/images/iso.png' },
  { name: 'Startup India', logo: '/images/si.png' },
];

const defaultBenefits = [
  "Comprehensive business plan and ROI details",
  "Location selection assistance",
  "Full menu and operations training details",
  "Brand and marketing support overview"
];

export function FranchiseEnquiryFormSection({ 
  headline = 'Start Your Franchise Journey Today', 
  subtitle = 'Fill in your details and our expert franchise team will call you shortly with everything you need to know about setting up your highly profitable T Vanamm outlet.',
  benefits = defaultBenefits,
  trustBadges = []
}: FranchiseEnquiryFormSectionProps) {
  const displayBadges = trustBadges && trustBadges.length > 0 ? trustBadges : defaultTrustBadges;

  return (
    <section id="franchise-enquiry" className="pt-16 pb-24 bg-[#006437] text-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Trust & Compliance Badges - Compact Rectangular Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-16 pb-8 border-b border-white/10"
        >
          {displayBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-2 md:p-3 rounded-xl shadow-sm transform transition-all hover:scale-[1.02] hover:bg-white/10 overflow-hidden"
            >
              <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg p-1.5 flex-shrink-0 shadow-inner">
                <Image 
                  src={typeof badge.logo === 'string' ? badge.logo : urlFor(badge.logo).url()} 
                  alt={badge.name} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <span className="font-bold uppercase text-[9px] md:text-[10px] xl:text-[11px] text-white/90 leading-tight truncate sm:whitespace-normal break-words">
                  {badge.name}
                </span>
                <span className="text-[8px] text-[#C8A96E] font-bold tracking-widest uppercase mt-0.5">Verified</span>
              </div>
            </div>
          ))}
        </motion.div>

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
