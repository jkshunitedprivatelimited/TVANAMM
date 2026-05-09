'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const GOOGLE_MAPS_SEARCH_URL =
  'https://www.google.com/maps/search/T+VANAMM+near+me/';

export function NearestOutletSection() {
  return (
    <section aria-label="Find Nearest Outlet" id="nearest-outlet" className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #006437 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight">
            Find Our Nearest <span className="text-[#C8A96E]">Outlet</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-5" />
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg">
            Over 250+ outlets across India. Find the one closest to you.
          </p>
        </motion.div>

        {/* Single CTA — opens Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col items-center"
        >
          <a
            href={GOOGLE_MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#006437] text-white rounded-full font-medium text-sm hover:bg-[#005530] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <MapPin size={16} />
            Find T VANAMM Near Me
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Opens Google Maps to show the nearest T VANAMM outlet to your current location
          </p>
        </motion.div>
      </div>
    </section>
  );
}
