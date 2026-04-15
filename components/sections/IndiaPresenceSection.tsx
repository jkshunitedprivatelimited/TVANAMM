'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { IndiaMapVector } from '../IndiaMapVector';

const generatePins = () => {
  const generated = [];
  let seed = 42;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Precise mathematical model tracing the specific India Vector map proportions
  function isInsideIndia(top: number, left: number) {
    if (top < 20 || top > 92 || left < 20 || left > 58) return false;
    
    if (top < 25) return left >= 35 && left <= 39; // Extreme North (Kashmir/Ladakh)
    if (top >= 25 && top < 35) return left >= 33 && left <= 40; // North (Punjab/Himachal)
    if (top >= 35 && top < 48) return left >= 26 && left <= 48; // North-Central
    if (top >= 48 && top < 58) return left >= 20 && left <= 58; // Max width (Gujarat to Bengal)
    
    if (top >= 58 && top < 70) {
       // Tapering the East and West coasts inwards (Mumbai to Pune, Kolkata to Vizag)
       const progress = (top - 58) / 12; // 0 to 1
       const minLeft = 20 + progress * 5; 
       const maxLeft = 58 - progress * 14;
       return left >= minLeft && left <= maxLeft;
    }
    
    if (top >= 70) {
       // Deep South tapering towards Kochi/ कन्याकुमारी
       const progress = (top - 70) / 22; // 0 to 1
       const minLeft = 25 + progress * 7;
       const maxLeft = 44 - progress * 12;
       return left >= minLeft && left <= maxLeft;
    }
    return false;
  }

  // 3 pins exactly in West Bengal
  for (let i = 0; i < 3; i++) {
    generated.push({
      id: `wb-${i}`,
      top: `${(55 + random() * 2).toFixed(6)}%`,
      left: `${(55 + random() * 2).toFixed(6)}%`,
      city: 'West Bengal',
      size: 'w-2 h-2',
      isPing: true
    });
  }

  let safetyCounter = 0;
  while (generated.length < 250 && safetyCounter < 5000) {
    safetyCounter++;
    const top = 20 + random() * 72;
    const left = 20 + random() * 42;
    
    if (isInsideIndia(top, left)) {
      generated.push({
        id: `pin-${generated.length}`,
        top: `${top.toFixed(6)}%`,
        left: `${left.toFixed(6)}%`,
        city: 'T VANAMM Outlet',
        size: 'w-1.5 h-1.5',
        isPing: random() > 0.85
      });
    }
  }

  return generated;
};

const pins = generatePins();

interface IndiaPresenceSectionProps {
  headline?: string;
  subtitle?: string;
  outletsCount?: string;
  statesCount?: string;
}

export const IndiaPresenceSection = ({ 
  headline, 
  subtitle = 'Join our rapidly expanding network of successful franchise partners.', 
  outletsCount = '250', 
  statesCount = '10' 
}: IndiaPresenceSectionProps) => {
  // Logic: 
  // 1. If 'headline' exists in Sanity, use it.
  // 2. If 'headline' is empty BUT counts exist, use "X+ Outlets across Y+ States".
  // 3. Fallback to "Growing Across India".
  const dynamicHeadline = (outletsCount && statesCount) 
    ? (
        <>
          {outletsCount}+ Outlets <br className="block md:hidden" /> <span className="text-[#C8A96E]">across {statesCount}+ States</span>
        </>
      )
    : 'Growing Across India';

  const formatHeadline = (text: React.ReactNode) => {
    if (!text) return dynamicHeadline;
    if (typeof text !== 'string') return text;

    const parts = text.split(/(Across India)/i);
    return parts.map((part, i) => 
      part.toLowerCase() === 'across india' ? (
        <span key={i} className="text-[#C8A96E]">{part}</span>
      ) : part
    );
  };

  const resolvedHeadline = formatHeadline(headline);
  const resolvedSubtitle = subtitle;

  return (
    <section className="py-12 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight px-2">
            {resolvedHeadline}
          </h2>
          {headline && (outletsCount || statesCount) && (
            <div className="text-xl md:text-2xl font-bold text-[#C8A96E] mb-4">
              {outletsCount}+ Outlets across {statesCount}+ States
            </div>
          )}
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4 md:px-0">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mt-16 md:mt-12">
          {/* Animated Badge top-right of the India Map — outside overflow-hidden */}
          <div className="absolute -top-12 md:-top-8 lg:-top-4 right-0 md:-right-4 lg:-right-16 z-20 pointer-events-none bg-white rounded-full shadow-lg p-2 md:p-3 border border-gray-100 flex items-center justify-center">
            <Image 
              src="/images/logo_gif.gif" 
              alt="T VANAMM Badge" 
              width={120} 
              height={120} 
              style={{ height: 'auto' }}
              className="object-contain rounded-full w-16 h-16 md:w-[120px] md:h-[120px]" 
              unoptimized
            />
          </div>

          {/* Map + Pins container with overflow-hidden to clip edge pins */}
          <div className="relative aspect-square flex justify-center overflow-hidden">
            {/* Accurate India Map Vector */}
            <div className="relative z-10 w-full h-full">
              <IndiaMapVector />
            </div>

            {/* Pins */}
            {pins.map((pin, i) => (
              <motion.div
                key={pin.id}
                className="absolute"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: (i % 30) * 0.03, duration: 0.3 }}
                viewport={{ once: true }}
                style={{ top: pin.top, left: pin.left }}
                title={pin.city}
              >
                <div className="relative">
                  <div className={`${pin.size} bg-[#006437] rounded-full shadow-sm absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center`} />
                  {pin.isPing && (
                    <div className="w-4 h-4 rounded-full bg-[#C8A96E] absolute -translate-x-1/2 -translate-y-1/2 animate-ping opacity-40 mix-blend-multiply" style={{ animationDuration: '3s', animationDelay: `${(i % 5) * 0.5}s` }} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
