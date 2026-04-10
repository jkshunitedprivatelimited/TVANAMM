'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { urlFor } from '@/lib/sanity/image';

const defaultImages = [
  { id: 1, src: '/images/cafe_interior_1775287651976.png' },
  { id: 2, src: '/images/healthy-oatmeal-tvanamm-hero-3x2-1.webp' },
  { id: 3, src: '/images/Creamy-milk-shakes.webp' },
  { id: 4, src: '/images/Juices-and-Mocktails.webp' },
  { id: 5, src: '/images/milk_tea_product_1775287519557.png' },
  { id: 6, src: '/images/flavoured_tea_product_1775287539046.png' },
];

export function GalleryTeaser({ images: sanityImages }: { images?: Record<string, unknown>[] }) {
  const displayImages = sanityImages?.length 
    ? sanityImages.map((img, i) => ({ 
        id: i, 
        src: urlFor(img).url() 
      })) 
    : defaultImages;
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
              See T Vanamm in Action
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

        {/* Scrolling Marquee Gallery */}
        <div className="relative w-full overflow-hidden mt-8 pb-12">
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            animate={{ x: [0, -1920] }} 
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex whitespace-nowrap gap-6 md:gap-8"
          >
            {[...displayImages, ...displayImages, ...displayImages].map((img: { id: number | string; src: string }, i: number) => (
              <div
                key={`${img.id}-${i}`}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden group shrink-0 shadow-xl border border-gray-100"
              >
                <Image
                  src={img.src}
                  alt={`T Vanamm Gallery Image`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-w-768px) 256px, 320px"
                />
                <div className="absolute inset-0 bg-[#006437]/0 group-hover:bg-[#006437]/20 transition-colors duration-300" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
