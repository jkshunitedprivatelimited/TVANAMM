'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const defaultCategories = [
  { name: 'Milk Shakes', image: '/images/Creamy-milk-shakes.webp' },
  { name: 'Sandwiches', image: '/images/fresh-sandwich-tvanamm-hero-3x2-1.webp' },
  { name: 'Oatmeal', image: '/images/healthy-oatmeal-tvanamm-hero-3x2-1.webp' },
  { name: 'Fruit Bowls', image: '/images/fruit-bowl-tvanamm-hero-3x2-1.webp' },
  { name: 'Wheatgrass Juice', image: '/images/wheatgrass-juice-with-bunch-hero-3x2-1.webp' },
  { name: 'Rose Milk', image: '/images/rose-milk-tvanamm-hero-3x2-1.webp' },
  { name: 'Ice Creams', image: '/images/Ice-Creams-TVanamm.webp' },
  { name: 'Juices & Mocktails', image: '/images/Juices-and-Mocktails.webp' },
];

export function ProductsShowcaseSection({ categories: sanityCategories }: { categories?: string[] }) {
  const displayCategories = sanityCategories?.length
    ? sanityCategories.map((name, i) => ({
      name,
      image: defaultCategories[i % defaultCategories.length].image
    }))
    : defaultCategories;

  // Duplicate for seamless infinite marquee effect
  const marqueeItems = [...displayCategories, ...displayCategories];

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 to-primary/90 z-0" />
      <div className="absolute inset-0 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay opacity-10 z-0" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 drop-shadow-lg"
          >
            Menu Categories
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-accent mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed font-light"
          >
            Simple, familiar, and built to be easy to serve consistently across the network.
          </motion.p>
        </div>
      </div>

      {/* Infinite Scroll Marquee */}
      <div className="relative z-10 w-full mb-12 flex items-center">
        {/* Left and Right Fade Indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-primary-dark to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-primary-dark to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap gap-6 md:gap-8 px-4"
        >
          {marqueeItems.map((category, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-5 group cursor-pointer shrink-0"
              >
                {/* Image Container - completely clean and smaller */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[3px] border-white/5 bg-white/5 group-hover:border-accent/40 transition-colors duration-500">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-w-768px) 192px, 224px"
                  />
                </div>
                
                {/* Text underneath the image */}
                <div className="text-center px-4 w-48 md:w-56">
                  <h3 className="text-xl md:text-2xl font-bold font-playfair text-white drop-shadow-sm group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="w-8 h-1 bg-accent mx-auto mt-2 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                </div>
              </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
