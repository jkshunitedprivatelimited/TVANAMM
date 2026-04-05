'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { IndiaMapVector } from '../IndiaMapVector';

const pins = [
  { top: '72%', left: '38%', city: 'Hyderabad' },
  { top: '85%', left: '38%', city: 'Chennai' },
  { top: '82%', left: '35%', city: 'Bangalore' },
  { top: '65%', left: '22%', city: 'Mumbai' },
  { top: '30%', left: '38%', city: 'Delhi' },
  { top: '68%', left: '24%', city: 'Pune' },
  { top: '55%', left: '60%', city: 'Kolkata' },
  { top: '50%', left: '20%', city: 'Ahmedabad' },
  { top: '38%', left: '32%', city: 'Jaipur' },
  { top: '40%', left: '45%', city: 'Lucknow' },
  { top: '90%', left: '32%', city: 'Kochi' },
  { top: '68%', left: '44%', city: 'Vizag' },
];

interface IndiaPresenceSectionProps {
  headline?: string;
  subtitle?: string;
}

export function IndiaPresenceSection({ 
  headline = '250+ Outlets Across India', 
  subtitle = 'And growing every month. Join our rapidly expanding network.' 
}: IndiaPresenceSectionProps) {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            {headline}
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto aspect-[4/5] md:aspect-square flex justify-center mt-12">
          {/* Accurate India Map Vector */}
          <IndiaMapVector />

          {/* Pins */}
          {pins.map((pin, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
              viewport={{ once: true }}
              style={{ top: pin.top, left: pin.left }}
              title={pin.city}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-[#006437] rounded-full shadow-lg absolute -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="w-8 h-8 rounded-full bg-[#C8A96E] absolute -translate-x-1/2 -translate-y-1/2 animate-ping opacity-60" style={{ animationDuration: '2s', animationDelay: `${i * 0.2}s` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
