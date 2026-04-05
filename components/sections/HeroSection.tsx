'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

export function HeroSection({ 
  headline = "India's Premium Tea & Coffee Franchise",
  subtext = "Join 250+ successful franchise owners across India. Build your business with T Vanamm — A Taste of Purity."
}: { 
  headline?: string;
  subtext?: string;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-[#006437] overflow-hidden">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-30 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay" />
      
      <div className="container relative z-10 px-4 mx-auto text-center mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight"
          >
            {headline}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {subtext}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#franchise-enquiry"
              className="w-full sm:w-auto px-8 py-4 bg-[#C8A96E] hover:bg-[#b0935d] text-white font-semibold rounded transition-colors text-lg"
            >
              Enquire Now
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#006437] font-semibold rounded transition-colors text-lg"
            >
              Explore Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-white/70 text-sm mb-2 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-1"
        >
          <div className="w-1.5 h-3 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
