'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { urlFor } from '@/lib/sanity/image';

const defaultImages = [
  { id: 1, src: '/images/cafe_interior_1775287651976.png' },
  { id: 2, src: '/images/milk_tea_product_1775287519557.png' },
  { id: 3, src: '/images/flavoured_tea_product_1775287539046.png' },
  { id: 4, src: '/images/cafe_interior_1775287651976.png' },
  { id: 5, src: '/images/flavoured_tea_product_1775287539046.png' },
  { id: 6, src: '/images/milk_tea_product_1775287519557.png' },
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

        {/* Masonry-ish grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {displayImages.map((img: { id: number | string; src: string }, i: number) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                i === 0 ? 'col-span-1 row-span-1' : 
                i === 1 ? 'col-span-1 row-span-2' : 
                i === 2 ? 'col-span-1 md:col-span-2 row-span-1' : 
                i === 3 ? 'col-span-1 row-span-2 md:row-span-1' : 
                i === 4 ? 'col-span-1 md:col-span-2 row-span-1' : 
                'col-span-1 row-span-1'
              }`}
            >
              <Image
                src={img.src}
                alt={`T Vanamm Gallery ${img.id}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#006437]/0 group-hover:bg-[#006437]/40 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
