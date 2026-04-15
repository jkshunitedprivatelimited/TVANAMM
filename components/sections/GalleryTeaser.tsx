'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { urlFor } from '@/lib/sanity/image';

const defaultImages = [
  '/images/hero_background.png',
  '/images/hero_background.png',
  '/images/hero_background.png',
  '/images/hero_background.png',
  '/images/hero_background.png',
  '/images/hero_background.png',
];

export function GalleryTeaser({ images: sanityImages }: { images?: Record<string, unknown>[] }) {
  const allImages = (sanityImages && sanityImages.length > 0)
    ? sanityImages
        .filter(img => img && (img._type === 'image' || (img as Record<string, unknown>).asset)) // Basic check for Sanity image object
        .map((img) => urlFor(img).url()) 
    : defaultImages;

  // Fallback to default if all mapping failed
  const finalImages = allImages.length > 0 ? allImages : defaultImages;

  // We want 10 images in each row
  const topRow = Array.from({ length: 10 }).map((_, i) => finalImages[i % finalImages.length]);
  // Offset bottom row so it doesn't look identical to top row vertically
  const bottomRow = Array.from({ length: 10 }).map((_, i) => finalImages[(i + 3) % finalImages.length]);

  // Duplicate the array for seamless infinite scroll
  const topMarquee = [...topRow, ...topRow];
  const bottomMarquee = [...bottomRow, ...bottomRow];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
              See <span className="text-[#C8A96E]">T VANAMM</span> in Action
            </h2>
            <div className="w-24 h-1 bg-[#C8A96E] rounded-full" />
          </div>
          <Link 
            href="/gallery" 
            className="inline-flex items-center gap-2 text-[#006437] font-semibold hover:text-[#C8A96E] transition-colors"
          >
            View Full Gallery <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative w-full flex flex-col gap-10 md:gap-16 mt-8 mb-4">
        {/* Top Row: Scrolls Right to Left */}
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 120,
              ease: 'linear',
            },
          }}
        >
          {topMarquee.map((src, i) => (
            <div
              key={`top-${i}`}
              className="relative w-[260px] h-[180px] md:w-[380px] md:h-[260px] rounded-xl overflow-hidden group cursor-pointer shrink-0"
            >
              <Image 
                src={src}
                alt={`T VANAMM Gallery ${i}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 260px, 380px"
              />
              <div className="absolute inset-0 bg-[#006437]/0 group-hover:bg-[#006437]/20 transition-colors duration-300" />
            </div>
          ))}
        </motion.div>

        {/* Bottom Row: Scrolls Left to Right */}
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 120,
              ease: 'linear',
            },
          }}
        >
          {bottomMarquee.map((src, i) => (
            <div
              key={`bottom-${i}`}
              className="relative w-[260px] h-[180px] md:w-[380px] md:h-[260px] rounded-xl overflow-hidden group cursor-pointer shrink-0"
            >
              <Image 
                src={src}
                alt={`T VANAMM Gallery ${i}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 260px, 380px"
              />
              <div className="absolute inset-0 bg-[#006437]/0 group-hover:bg-[#006437]/20 transition-colors duration-300" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
