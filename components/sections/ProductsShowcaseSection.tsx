'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';

const defaultCategories = [
  { name: 'Flavoured Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Milk Teas', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Herbal Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Iced Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Specialty Drinks', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Café Bites', image: '/images/cafe_interior_1775287651976.png' },
  { name: 'Classic Chai', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Green Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Cold Brews', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Masala Chai', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Ice Cream Shakes', image: '/images/cafe_interior_1775287651976.png' },
  { name: 'Premium Blends', image: '/images/flavoured_tea_product_1775287539046.png' },
];

export function ProductsShowcaseSection({ categories: sanityCategories }: { categories?: any[] }) {
  const displayCategories = sanityCategories?.length 
    ? sanityCategories.map((cat, i) => ({
        name: cat.name || `Category ${i + 1}`,
        image: cat.image ? urlFor(cat.image).url() : defaultCategories[i % defaultCategories.length].image
      }))
    : defaultCategories;

  // Duplicate the array for seamless infinite scroll
  const marqueeItems = [...displayCategories, ...displayCategories];

  return (
    <section className="py-24 bg-[#006437] text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Our Menu — Crafted for Every Taste
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            12+ curated sections. 120+ handcrafted items. Every single item backed by a detailed SOP — ensuring any team member delivers the same perfect taste, every time.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C8A96E]">12+</div>
              <div className="text-white/60 text-xs uppercase tracking-widest mt-1">Menu Sections</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C8A96E]">120+</div>
              <div className="text-white/60 text-xs uppercase tracking-widest mt-1">Premium Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee container — full width, no container constraint */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#006437] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#006437] to-transparent z-10" />

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
            <div
              key={i}
              className="relative w-52 h-64 md:w-60 md:h-72 rounded-xl overflow-hidden group cursor-pointer shrink-0"
            >
              <Image 
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-base md:text-lg font-bold font-playfair text-white">{category.name}</h3>
                <div className="w-8 h-1 bg-[#C8A96E] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
