'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { ReadyToJoinSection } from './ReadyToJoinSection';

const filters = ['Outlets', 'Products'];

// Fallback images if completely empty
const fallbackGallery = Array.from({ length: 12 }).map((_, i) => {
  const images = ['/images/hero_background.png', '/images/hero_background.png'];
  const titles = ['Premium Tea Assortment', 'Refreshing Iced Peach Tea'];
  return {
    id: `fallback-${i}`,
    category: filters[i % filters.length],
    src: images[i % 2],
    title: titles[i % 2],
  };
});



interface GalleryImage {
  id: string | number;
  category: string;
  src: string;
  title?: string;
}

interface GalleryClientProps {
  initialImages?: GalleryImage[];
}

/* ===================================================================
   PRODUCTS MARQUEE — 3 rows of infinite scrolling product images
   Row 1: Right → Left
   Row 2: Left → Right (offset images)
   Row 3: Right → Left (different offset)
   =================================================================== */
function MarqueeWall({ 
  images, 
  onImageClick,
  preheading,
  heading,
  description
}: { 
  images: GalleryImage[]; 
  onImageClick: (src: string) => void;
  preheading: string;
  heading: string;
  description: string;
}) {
  // Ensure we max out at 15 unique images total
  const safeImages = images.slice(0, 15);

  // Build exactly 5 unique images per row, offset so they don't repeat vertically if <15 images exist
  const buildRow = (offset: number) => {
    return Array.from({ length: 5 }).map((_, i) => safeImages[(i + offset) % safeImages.length]);
  };

  const row1 = buildRow(0);
  const row2 = buildRow(7);

  // Duplicate each row 4 times to safely cover Ultrawide/4k screens 
  const marquee1 = [...row1, ...row1, ...row1, ...row1];
  const marquee2 = [...row2, ...row2, ...row2, ...row2];

  const rows = [
    { items: marquee1, direction: 'rtl' as const, duration: 80 },
    { items: marquee2, direction: 'ltr' as const, duration: 90 },
  ];

  return (
    <section className="relative z-10 pt-6 pb-10 bg-white overflow-hidden">
      {/* Section header */}
      <div className="container mx-auto px-4 lg:px-8 mb-4 md:mb-8">
        <div className="text-center">
          <p className="text-[#C8A96E] font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            {preheading}
          </p>
          <h2 className="text-2xl md:text-4xl font-playfair font-bold text-[#006437] mb-4 whitespace-nowrap">
            {heading}
          </h2>
          <div className="w-20 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* 3-row marquee wall */}
      <div className="relative w-full flex flex-col gap-4 md:gap-5">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            className="flex gap-4 md:gap-5 w-max"
            animate={{
              x: row.direction === 'rtl' ? ['0%', '-25%'] : ['-25%', '0%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: row.duration,
                ease: 'linear',
              },
            }}
          >
            {row.items.map((item, i) => (
              <div
                key={`row${rowIndex}-${i}`}
                className="relative w-[200px] h-[150px] md:w-[280px] md:h-[200px] lg:w-[320px] lg:h-[220px] rounded-xl overflow-hidden group cursor-pointer shrink-0"
                onClick={() => onImageClick(item.src)}
              >
                <Image
                  src={item.src}
                  alt={item.title || `Product ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 320px"
                />
                {/* Hover overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end">
                  <div className="p-4 w-full">
                    {item.title && (
                      <h3 className="text-white font-playfair font-bold text-sm md:text-base truncate">
                        {item.title}
                      </h3>
                    )}
                    <div className="w-8 h-0.5 bg-[#C8A96E] mt-2 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}




/* ===================================================================
   MAIN GALLERY PAGE
   ===================================================================*/
export function GalleryClient({ initialImages }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState('Outlets');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use provided images or fallback
  const galleryData = initialImages?.length ? initialImages : fallbackGallery;

  const rawOutletImages = galleryData.filter(img => img.category === 'Outlets');
  const rawProductImages = galleryData.filter(img => img.category === 'Products');
  
  // Ensure Products marquee always has images — use fallback product images if CMS is empty
  const fallbackProductImages: GalleryImage[] = [
    { id: 'fp-1', category: 'Products', src: '/images/hero_background.png', title: 'Flavoured Tea' },
    { id: 'fp-2', category: 'Products', src: '/images/hero_background.png', title: 'Milk Tea' },
    { id: 'fp-3', category: 'Products', src: '/images/hero_background.png', title: 'Tea Beverages' },
    { id: 'fp-4', category: 'Products', src: '/images/hero_background.png', title: 'Iced Peach Tea' },
    { id: 'fp-5', category: 'Products', src: '/images/hero_background.png', title: 'Café Experience' },
  ];
  const productImages = rawProductImages.length > 0 ? rawProductImages : fallbackProductImages;

  // Ensure Outlets marquee always has images
  const fallbackOutletImages: GalleryImage[] = [
    { id: 'fo-1', category: 'Outlets', src: '/images/hero_background.png', title: 'Modern Interior' },
    { id: 'fo-2', category: 'Outlets', src: '/images/hero_background.png', title: 'Outlet Vibes' },
    { id: 'fo-3', category: 'Outlets', src: '/images/hero_background.png', title: 'Cozy Seating' },
    { id: 'fo-4', category: 'Outlets', src: '/images/hero_background.png', title: 'T Vanamm Outlet' },
    { id: 'fo-5', category: 'Outlets', src: '/images/hero_background.png', title: 'Storefront' },
  ];
  const outletImages = rawOutletImages.length > 0 ? rawOutletImages : fallbackOutletImages;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#006437] via-[#005530] to-[#004025] pt-[100px] md:pt-[120px] pb-4 text-center overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4">

          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-[0.2em] uppercase">
            Gallery
          </div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-tight whitespace-nowrap">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96E] to-[#E5CC98]">Outlets & Products</span>
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
            See T Vanamm in action across India
          </p>
        </div>
      </section>

      {/* Tab Filters */}
      <section className="py-4 bg-gray-50 border-b border-gray-200 sticky top-[48px] md:top-[63px] z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto hide-scrollbar">
          <div className="flex justify-center flex-nowrap min-w-max md:min-w-0 md:flex-wrap gap-2 md:gap-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTab(filter)}
                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === filter ? 'text-white' : 'text-gray-600 hover:text-gray-900 bg-white shadow-sm'}`}
              >
                {activeTab === filter && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#006437] rounded-full z-0" />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content — Outlets uses grid, Products uses marquee wall */}
      <AnimatePresence mode="wait">
        {activeTab === 'Outlets' ? (
            <motion.div
            key="outlets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <MarqueeWall 
              images={outletImages} 
              onImageClick={setSelectedImage} 
              preheading="Our Locations"
              heading="T Vanamm Across India"
              description="Step into our beautifully designed outlets, offering a warm, inviting ambiance for your perfect tea experience."
            />
          </motion.div>
        ) : (
            <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <MarqueeWall 
              images={productImages} 
              onImageClick={setSelectedImage} 
              preheading="Our Signature Collection"
              heading="Premium Beverages & More"
              description="120+ handcrafted items prepared with detailed SOPs — ensuring the same perfect taste across every T Vanamm outlet."
            />
          </motion.div>
        )}
      </AnimatePresence>



      {/* CTA */}
      <ReadyToJoinSection />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
              className="relative max-w-5xl max-h-[90vh] w-full h-full rounded-2xl overflow-hidden cursor-default" 
              onClick={e => e.stopPropagation()}
            >
               <Image src={selectedImage} alt="Expanded" fill className="object-contain" />
               <button 
                 onClick={() => setSelectedImage(null)} 
                 className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors"
               >
                 X
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
