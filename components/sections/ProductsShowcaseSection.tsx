'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';

const defaultCategories = [
  { name: 'Hot Beverages', image: '/images/hero_background.png' },
  { name: 'Herbal Teas', image: '/images/hero_background.png' },
  { name: 'Special Coffees', image: '/images/hero_background.png' },
  { name: 'Refreshing Drinks', image: '/images/hero_background.png' },
  { name: 'Mocktails', image: '/images/hero_background.png' },
  { name: 'Healthy Juices', image: '/images/hero_background.png' },
  { name: 'Immunity Boosters', image: '/images/hero_background.png' },
  { name: 'Smoothies', image: '/images/hero_background.png' },
  { name: 'Thick Shake', image: '/images/hero_background.png' },
  { name: 'Ice-Creams', image: '/images/hero_background.png' },
  { name: 'Healthy Breakfast', image: '/images/hero_background.png' },
  { name: 'Snacks', image: '/images/hero_background.png' },
];

export function ProductsShowcaseSection({ categories: sanityCategories }: { categories?: { name?: string; image?: Record<string, unknown> }[] }) {
  const displayCategories = sanityCategories?.length 
    ? sanityCategories.map((cat, i) => ({
        name: cat.name || `Category ${i + 1}`,
        image: cat.image ? urlFor(cat.image).url() : '/images/hero_background.png' 
      }))
    : defaultCategories;

  // Duplicate the array for seamless infinite scroll
  const marqueeItems = [...displayCategories, ...displayCategories];

  return (
    <section className="py-12 md:py-24 bg-[#006437] text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
            Our <span className="text-[#C8A96E]">Menu</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8 px-2">
            12+ curated sections. 120+ handcrafted items.
            <br className="hidden md:block" />
            Every single item backed by a detailed SOP — ensuring any team member delivers the same perfect taste, every time.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-[#C8A96E]">12+</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Menu Sections</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-[#C8A96E]">120+</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Premium Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee container — full width, no container constraint */}
      <div className="relative w-full">
        {/* Scrolling row */}
        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {marqueeItems.map((category, i) => (
            <div key={i} className="flex flex-col group cursor-pointer shrink-0">
              <div className="relative w-44 h-56 md:w-60 md:h-72 rounded-xl overflow-hidden mb-4 shadow-sm border border-white/5">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="240px"
                />
              </div>
              <div className="flex flex-col items-center text-center px-2">
                <h3 className="text-base md:text-lg font-bold font-playfair text-white/90 group-hover:text-[#C8A96E] transition-colors duration-300">{category.name}</h3>
                <div className="w-8 h-0.5 bg-[#C8A96E] mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
