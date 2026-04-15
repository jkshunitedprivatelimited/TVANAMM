'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection({ 
  headline = "India's best\nPremium Tea Franchise",
  subtext = "Join 250+ successful franchise owners across India. Build your business with T VANAMM — A Taste of Purity."
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
    <section className="relative w-full h-[85vh] md:h-screen min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-[#006437] overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-1" />
      
      <div className="container relative z-10 px-4 mx-auto text-center mt-12 md:mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-[1.9rem] xs:text-[2.2rem] sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-[1.2] md:leading-tight max-w-4xl mx-auto"
          >
            {headline?.includes("Premium Tea Franchise") ? (
              <div className="flex flex-col gap-1 md:block">
                <span className="block md:inline whitespace-nowrap">India's Best</span>
                <span className="hidden md:inline"> </span>
                <span className="text-[#C8A96E] block md:inline whitespace-nowrap">Premium Tea Franchise</span>
              </div>
            ) : (
              headline?.replace(/\n/g, ' ')
            )}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-[15px] sm:text-base md:text-xl text-white mb-10 max-w-[42ch] md:max-w-2xl mx-auto font-light leading-relaxed"
          >
            Join 250+ successful franchise owners across India.
            <br className="md:hidden" />
            Build your business with <span className="text-[#C8A96E] font-medium">T VANAMM</span> 
            <br className="md:hidden" />
            — A Taste of Purity.
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
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#006437] hover:bg-gray-100 font-semibold rounded transition-colors text-lg"
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
        <span className="text-white text-sm mb-2 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-white rounded-full flex justify-center p-1"
        >
          <div className="w-1.5 h-3 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
