'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection({ 
  headline = "India's best\nPremium Tea Franchise",
  subtext = "Join 250+ successful franchise owners across India. Build your business with T VANAMM"
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
    <section className="relative w-full h-[100svh] md:h-screen min-h-[600px] flex items-start justify-center pt-16 md:pt-20 bg-[#006437] overflow-hidden">
      {/* Background Image Optimized */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/herobanner.png"
          alt="T VANAMM Hero Banner"
          fill
          priority
          className="object-cover object-[center_65%]"
          sizes="100vw"
          quality={85}
        />
      </div>
      
      {/* Dark overlay at top for text, clear center spotlight for cup, dark bottom for buttons */}
      <div className="absolute inset-0 z-1" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.7) 100%)' }} />
      {/* Radial spotlight to highlight the cup in the center */}
      <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 45%, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />
      
      {/* Top Text Content */}
      <div className="container relative z-10 px-4 mx-auto text-center mt-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-[1.9rem] xs:text-[2.2rem] sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6 leading-[1.2] md:leading-tight max-w-4xl mx-auto"
          >
            {headline?.includes("Premium Tea Franchise") ? (
              <div className="flex flex-col gap-1 md:block">
                <span className="text-white block md:inline whitespace-nowrap drop-shadow-lg [text-shadow:_0_0_10px_rgba(255,255,255,0.8),_0_0_25px_rgba(255,255,255,0.4),_0_0_50px_rgba(255,255,255,0.2)]">India&apos;s Best</span>
                <span className="hidden md:inline"> </span>
                {/* White text for full headline */}
                <span className="text-white block md:inline whitespace-nowrap drop-shadow-lg [text-shadow:_0_0_10px_rgba(255,255,255,0.8),_0_0_25px_rgba(255,255,255,0.4),_0_0_50px_rgba(255,255,255,0.2)]">
                  Premium Tea Franchise
                </span>
              </div>
            ) : (
              headline?.replace(/\n/g, ' ')
            )}
          </motion.h1>
        </motion.div>
      </div>

      {/* Subtitle below the cup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-[230px] md:bottom-[200px] left-0 w-full z-10 px-4 text-center"
      >
        <p className="text-[15px] sm:text-base md:text-xl text-white font-semibold leading-relaxed [text-shadow:_0_2px_6px_rgba(0,0,0,0.7),_0_1px_2px_rgba(0,0,0,0.5)]">
          <span className="block">Join 250+ successful franchise owners across India.</span>
          <span className="block">
            Build your business with <span className="font-extrabold tracking-wide">T VANAMM</span>
          </span>
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className="absolute bottom-[140px] md:bottom-32 left-0 w-full z-10 px-4 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          href="#franchise-enquiry"
          className="w-[260px] max-w-[90vw] px-8 py-4 bg-[#C8A96E] hover:bg-[#b5952f] text-white font-bold tracking-wide rounded transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] text-lg text-center border border-[#C8A96E]/30"
        >
          Enquire Now
        </Link>
        <Link
          href="/about"
          className="w-[260px] max-w-[90vw] px-8 py-4 bg-white text-[#006437] hover:bg-gray-100 font-bold tracking-wide rounded transition-all shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.5)] text-lg text-center"
        >
          Explore Our Story
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      >
        <span className="text-white text-sm mb-2 font-medium tracking-widest uppercase [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-white/80 rounded-full flex justify-center p-1 bg-black/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <div className="w-1.5 h-3 bg-[#C8A96E] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}