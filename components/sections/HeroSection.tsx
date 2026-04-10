'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
export function HeroSection({ 
  subtext = "Join 250+ successful franchise owners across India. Build your business with T Vanamm — A Taste of Purity.",
  headline
}: { 
  subtext?: string;
  headline?: string;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full h-screen min-h-[650px] flex items-center justify-center overflow-hidden bg-primary">
      {/* Premium Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 to-primary/90 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_50%)] z-0" />
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay z-0" />
      
      <div className="container relative z-10 px-4 mx-auto text-center mt-16 max-w-5xl pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <span className="px-5 py-2 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md text-accent-light text-sm font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              EST. 2019
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-8 leading-tight drop-shadow-xl flex flex-col items-center gap-2 md:gap-4"
          >
            <span className="block text-white/90">India&apos;s Premium</span>
            <span className="block text-accent text-glow uppercase tracking-wide">
              Tea Franchise
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow"
          >
            {subtext}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="#franchise-enquiry"
                className="flex justify-center items-center w-full sm:w-auto px-8 py-3 lg:px-10 lg:py-3.5 bg-accent hover:bg-accent-light text-primary-dark font-bold rounded-full transition-all duration-300 text-base shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                Start Your Journey
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/about"
                className="flex justify-center items-center w-full sm:w-auto px-8 py-3 lg:px-10 lg:py-3.5 bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-primary font-bold rounded-full transition-all duration-300 text-base backdrop-blur-sm"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1 backdrop-blur-sm">
            <div className="w-1 h-2.5 bg-accent rounded-full shadow-[0_0_5px_rgba(212,175,55,1)]" />
          </div>
        </motion.div>
        <span className="text-white/50 text-[10px] mt-3 font-semibold tracking-[0.2em] uppercase">Discover</span>
      </motion.div>
    </section>
  );
}
