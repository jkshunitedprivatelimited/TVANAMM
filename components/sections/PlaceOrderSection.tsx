'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { PLATFORM_LINKS } from '@/lib/geo';

export function PlaceOrderSection() {
  const platforms = [
    {
      name: 'Swiggy',
      icon: '/images/swiggy.png',
      url: PLATFORM_LINKS.swiggy,
      color: 'from-orange-500 to-orange-600',
      hoverBorder: 'hover:border-orange-300',
      bgGlow: 'bg-orange-500/5',
      tagline: 'Order on Swiggy',
      description: 'Auto-finds your nearest T VANAMM outlet',
    },
    {
      name: 'Zomato',
      icon: '/images/zomato.png',
      url: PLATFORM_LINKS.zomato,
      color: 'from-red-500 to-red-600',
      hoverBorder: 'hover:border-red-300',
      bgGlow: 'bg-red-500/5',
      tagline: 'Order on Zomato',
      description: 'Auto-finds your nearest T VANAMM outlet',
    },
  ];

  return (
    <section aria-label="Place Your Order" id="place-order" className="py-12 md:py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#006437]/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight">
            Place Your <span className="text-[#C8A96E]">Order</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-5" />
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg">
            Get your favourite T VANAMM beverages delivered to your doorstep from the nearest outlet
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-8 max-w-2xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`group relative w-full sm:w-64 bg-white rounded-2xl border border-gray-100 ${platform.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 ${platform.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative p-6 md:p-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{platform.tagline}</h3>
                <p className="text-xs text-gray-400 mb-4">{platform.description}</p>

                {/* CTA */}
                <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${platform.color} text-white font-medium text-sm shadow-sm group-hover:shadow-md transition-all`}>
                  Order Now
                  <ExternalLink size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          Delivering from <span className="font-semibold text-[#006437]">250+</span> outlets across India
        </motion.p>
      </div>
    </section>
  );
}
