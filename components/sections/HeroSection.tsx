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
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwJ/X97X8AAAAABJRU5ErkJggg=="
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
      </div>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-1" />
      
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
            className="text-[1.9rem] xs:text-[2.2rem] sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-[1.2] md:leading-tight max-w-4xl mx-auto drop-shadow-lg"
          >
            {headline?.includes("Premium Tea Franchise") ? (
              <div className="flex flex-col gap-1 md:block">
                <span className="block md:inline whitespace-nowrap">India's Best</span>
                <span className="hidden md:inline"> </span>
                {/* Applied Brand Green with a custom white glow effect so it stands out powerfully against the dark overlay */}
                <span className="text-[#006437] block md:inline whitespace-nowrap [text-shadow:_0_0_15px_rgba(255,255,255,0.9),_0_0_30px_rgba(255,255,255,0.6)]">
                  Premium Tea Franchise
                </span>
              </div>
            ) : (
              headline?.replace(/\n/g, ' ')
            )}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-[15px] sm:text-base md:text-xl text-white mb-10 max-w-full mx-auto font-light leading-relaxed drop-shadow-md"
          >
            <span className="block">Join 250+ successful franchise owners across India.</span>
            <span className="block">
              Build your business with <span className="text-[#D4AF37] font-bold tracking-wide drop-shadow-md">T VANAMM</span>
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className="absolute bottom-[140px] md:bottom-32 left-0 w-full z-10 px-4 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          href="#franchise-enquiry"
          // Updated to Sunrise Gold (#D4AF37) for a richer, premium feel
          className="w-[260px] max-w-[90vw] px-8 py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold tracking-wide rounded transition-all shadow-lg hover:shadow-xl text-lg text-center"
        >
          Enquire Now
        </Link>
        <Link
          href="/about"
          // Kept white, but ensuring the text matches the dark brand green
          className="w-[260px] max-w-[90vw] px-8 py-4 bg-white text-[#006437] hover:bg-gray-100 font-bold tracking-wide rounded transition-all shadow-lg hover:shadow-xl text-lg text-center"
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
        <span className="text-white text-sm mb-2 font-medium tracking-widest uppercase drop-shadow-md">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-white rounded-full flex justify-center p-1 bg-black/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        >
          <div className="w-1.5 h-3 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}