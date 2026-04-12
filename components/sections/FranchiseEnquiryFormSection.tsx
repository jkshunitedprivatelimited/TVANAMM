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
  headline?: React.ReactNode;
  subtitle?: string;
  benefits?: string[];
  trustBadges?: TrustBadge[];
}

const defaultTrustBadges = [
  { name: 'FSSAI Compliant', logo: '/images/fssai_logo.png' },
  { name: 'ISO Certified', logo: '/images/iso_logo.png' },
  { name: 'GMP Verified', logo: '/images/gmp_logo.png' },
  { name: 'GST Registered', logo: '/images/gst_logo.png' },
  { name: 'MSME Registered', logo: '/images/msme_logo.png' },
  { name: 'Startup India', logo: '/images/startupindia_logo.png' },
];

const defaultBenefits = [
  "Comprehensive business plan and ROI details",
  "Location selection assistance",
  "Full menu and operations training details",
  "Brand and marketing support overview"
];

export function FranchiseEnquiryFormSection({ 
  headline,
  subtitle = 'Fill in your details and our expert franchise team will call you shortly with everything you need to know about setting up your highly profitable T Vanamm outlet.',
  benefits = defaultBenefits,
  trustBadges = []
}: FranchiseEnquiryFormSectionProps) {
  const displayBadges = trustBadges && trustBadges.length > 0 ? trustBadges : defaultTrustBadges;

  // Function to format the headline to make "T VANAMM" gold and handle the requested line break
  const formatHeadline = (text: React.ReactNode) => {
    const defaultVal = (
      <>
        Start Your Journey <br />
        <span className="text-[#C8A96E]">with T VANAMM</span>
      </>
    );

    if (!text) return defaultVal;
    if (typeof text !== 'string') return text;
    
    // If it's the specific headline string, force the line break
    if (text.toLowerCase().includes('with t vanamm')) {
      const parts = text.split(/with T VANAMM/i);
      return (
        <>
          {parts[0]} <br />
          with <span className="text-[#C8A96E]">T VANAMM</span>
          {parts[1]}
        </>
      );
    }

    // Fallback split for other mentions of T VANAMM
    const parts = text.split(/(T VANAMM)/i);
    return parts.map((part, i) => 
      part.toUpperCase() === 'T VANAMM' ? (
        <span key={i} className="text-[#C8A96E]">{part}</span>
      ) : part
    );
  };

  return (
    <section id="franchise-enquiry" className="pt-32 md:pt-24 pb-24 bg-[#006437] text-white relative scroll-mt-32 md:scroll-mt-24">
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
              className="flex flex-col items-center text-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 p-3 md:p-4 rounded-xl shadow-sm transform transition-all hover:scale-[1.02] hover:bg-white/10"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 flex-shrink-0 shadow-inner overflow-hidden">
                {badge.logo ? (
                  <Image 
                    src={typeof badge.logo === 'string' ? badge.logo : urlFor(badge.logo).url()} 
                    alt={badge.name} 
                    fill 
                    className="object-contain p-1" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[#006437]/20">
                    <span className="text-[10px] font-bold">LOGO</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold uppercase text-[10px] md:text-[11px] text-white/90 leading-tight">
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
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-8 leading-tight">
              {formatHeadline(headline)}
            </h2>
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
            className="bg-white rounded-2xl p-4 md:p-8 shadow-2xl text-gray-900"
          >
            <EnquiryForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
