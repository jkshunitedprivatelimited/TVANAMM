'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const defaultCategories = [
  { name: 'Flavoured Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Milk Teas', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Herbal Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Iced Teas', image: '/images/flavoured_tea_product_1775287539046.png' },
  { name: 'Specialty Drinks', image: '/images/milk_tea_product_1775287519557.png' },
  { name: 'Café Bites', image: '/images/cafe_interior_1775287651976.png' }
];

export function ProductsShowcaseSection({ categories: sanityCategories }: { categories?: string[] }) {
  const displayCategories = sanityCategories?.length 
    ? sanityCategories.map((name, i) => ({
        name,
        image: defaultCategories[i % defaultCategories.length].image
      }))
    : defaultCategories;
  return (
    <section className="py-24 bg-[#006437] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            120+ Premium Beverages
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
            From authentic Indian teas to specialty café drinks — every cup crafted with purity. Our expansive menu ensures there is something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {displayCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image 
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 blur-0"
                sizes="(max-w-768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#006437]/90 via-[#006437]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg md:text-2xl font-bold font-playfair text-white">{category.name}</h3>
                <div className="w-8 h-1 bg-[#C8A96E] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
