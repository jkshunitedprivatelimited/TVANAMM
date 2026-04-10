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
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
          >
            {headline}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-accent mx-auto rounded-full mb-6" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="relative max-w-2xl mx-auto aspect-[4/5] md:aspect-square flex justify-center mt-12 bg-gray-50/50 rounded-3xl p-8 border border-gray-100 shadow-[0_0_50px_rgba(0,100,50,0.03)] backdrop-blur-sm">
          {/* Accurate India Map Vector */}
          <div className="w-full h-full drop-shadow-md">
             <IndiaMapVector />
          </div>

          {/* Pins */}
          {pins.map((pin, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
              viewport={{ once: true }}
              style={{ top: pin.top, left: pin.left }}
              title={pin.city}
            >
              <div className="relative group cursor-pointer">
                <div className="w-4 h-4 bg-primary text-primary rounded-full shadow-[0_0_10px_currentColor] absolute -translate-x-1/2 -translate-y-1/2 z-10 group-hover:scale-125 transition-transform" />
                <div className="w-10 h-10 rounded-full bg-accent absolute -translate-x-1/2 -translate-y-1/2 animate-ping opacity-40 mix-blend-multiply" style={{ animationDuration: '2.5s', animationDelay: `${i * 0.2}s` }} />
                
                {/* Tooltip on hover */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg -translate-x-1/2 -top-10 whitespace-nowrap pointer-events-none z-20">
                   {pin.city}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
