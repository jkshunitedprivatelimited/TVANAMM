'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const filters = ['Outlets', 'Products'];

// Fallback images if completely empty
const fallbackGallery = Array.from({ length: 12 }).map((_, i) => {
  const images = ['/images/gallery/tea_beverages.png', '/images/gallery/iced_peach_tea.png'];
  const titles = ['Premium Tea Assortment', 'Refreshing Iced Peach Tea'];
  return {
    id: `fallback-${i}`,
    category: filters[i % filters.length],
    src: images[i % 2],
    title: titles[i % 2],
  };
});

// Fallback videos — 3 videos
const fallbackVideos = [
  { youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Outlet Tour — Hyderabad" },
  { youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Outlet Tour — Bangalore" },
  { youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Outlet Tour — Chennai" }
];

interface GalleryImage {
  id: string | number;
  category: string;
  src: string;
  title?: string;
}

interface GalleryVideo {
  youtubeUrl: string;
  title?: string;
}

interface GalleryClientProps {
  initialImages?: GalleryImage[];
  initialVideos?: GalleryVideo[];
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
  // Build 3 rows of 10 images each, offset so they don't repeat vertically
  const buildRow = (offset: number) => {
    return Array.from({ length: 10 }).map((_, i) => images[(i + offset) % images.length]);
  };

  const row1 = buildRow(0);
  const row2 = buildRow(3);
  const row3 = buildRow(7);

  // Duplicate each row for seamless infinite loop
  const marquee1 = [...row1, ...row1];
  const marquee2 = [...row2, ...row2];
  const marquee3 = [...row3, ...row3];

  const rows = [
    { items: marquee1, direction: 'rtl' as const, duration: 50 },
    { items: marquee2, direction: 'ltr' as const, duration: 60 },
    { items: marquee3, direction: 'rtl' as const, duration: 55 },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      {/* Section header */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-[#C8A96E] font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            {preheading}
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#006437] mb-4">
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
              x: row.direction === 'rtl' ? ['0%', '-50%'] : ['-50%', '0%'],
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
   VIDEO CAROUSEL — One video at a time, auto-play, prev/next
   Clone trick for seamless infinite loop (same pattern as testimonials)
   =================================================================== */
function GalleryVideoCarousel({ videos }: { videos: GalleryVideo[] }) {
  const total = videos.length;
  const slides = useMemo(
    () => [videos[total - 1], ...videos, videos[0]],
    [videos, total]
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(1);
  const animatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const moveTo = useCallback((idx: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    if (animate) {
      track.style.transition = 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
      animatingRef.current = true;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${idx * 100}%)`;
    indexRef.current = idx;
  }, []);

  const onEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    animatingRef.current = false;
    const idx = indexRef.current;
    if (idx >= total + 1) moveTo(1, false);
    else if (idx <= 0) moveTo(total, false);
  }, [total, moveTo]);

  const next = useCallback(() => {
    if (animatingRef.current) return;
    moveTo(indexRef.current + 1, true);
  }, [moveTo]);

  const prev = useCallback(() => {
    if (animatingRef.current) return;
    moveTo(indexRef.current - 1, true);
  }, [moveTo]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!animatingRef.current) moveTo(indexRef.current + 1, true);
    }, 5000);
  }, [moveTo]);

  const clickNext = useCallback(() => { next(); startTimer(); }, [next, startTimer]);
  const clickPrev = useCallback(() => { prev(); startTimer(); }, [prev, startTimer]);

  useEffect(() => {
    moveTo(1, false);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [moveTo, startTimer]);

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#006437] mb-3">See Our Outlets Come to Life</h2>
          <div className="w-16 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        {/* Carousel nav */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button onClick={clickPrev} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437] border border-gray-200">
            <ChevronLeft size={18} />
          </button>
          <button onClick={clickNext} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437] border border-gray-200">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* One video at a time */}
        <div className="overflow-hidden rounded-xl max-w-2xl mx-auto">
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ backfaceVisibility: 'hidden' }}
            onTransitionEnd={onEnd}
          >
            {slides.map((vid, i) => {
              let embedUrl = vid.youtubeUrl;
              if (embedUrl?.includes('watch?v=')) {
                embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
              } else if (embedUrl?.includes('youtu.be/')) {
                embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
              }

              return (
                <div
                  key={`gvid-${i}`}
                  className="w-full shrink-0"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title={vid.title || `Video ${i + 1}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {vid.title && (
                    <p className="text-center text-[#006437] font-playfair font-bold text-lg mt-4">{vid.title}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ===================================================================
   MAIN GALLERY PAGE
   ===================================================================*/
export function GalleryClient({ initialImages, initialVideos }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState('Outlets');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use provided images or fallback
  const galleryData = initialImages?.length ? initialImages : fallbackGallery;
  const videoData = initialVideos?.length ? initialVideos : fallbackVideos;

  const rawOutletImages = galleryData.filter(img => img.category === 'Outlets');
  const rawProductImages = galleryData.filter(img => img.category === 'Products');
  
  // Ensure Products marquee always has images — use fallback product images if CMS is empty
  const fallbackProductImages: GalleryImage[] = [
    { id: 'fp-1', category: 'Products', src: '/images/flavoured_tea_product_1775287539046.png', title: 'Flavoured Tea' },
    { id: 'fp-2', category: 'Products', src: '/images/milk_tea_product_1775287519557.png', title: 'Milk Tea' },
    { id: 'fp-3', category: 'Products', src: '/images/gallery/tea_beverages.png', title: 'Tea Beverages' },
    { id: 'fp-4', category: 'Products', src: '/images/gallery/iced_peach_tea.png', title: 'Iced Peach Tea' },
    { id: 'fp-5', category: 'Products', src: '/images/cafe_interior_1775287651976.png', title: 'Café Experience' },
  ];
  const productImages = rawProductImages.length > 0 ? rawProductImages : fallbackProductImages;

  // Ensure Outlets marquee always has images
  const fallbackOutletImages: GalleryImage[] = [
    { id: 'fo-1', category: 'Outlets', src: '/images/cafe_interior_1775287651976.png', title: 'Modern Interior' },
    { id: 'fo-2', category: 'Outlets', src: '/images/hero_background_1775287501927.png', title: 'Outlet Vibes' },
    { id: 'fo-3', category: 'Outlets', src: '/images/cafe_interior_1775287651976.png', title: 'Cozy Seating' },
    { id: 'fo-4', category: 'Outlets', src: '/images/hero_background_1775287501927.png', title: 'T Vanamm Outlet' },
    { id: 'fo-5', category: 'Outlets', src: '/images/cafe_interior_1775287651976.png', title: 'Storefront' },
  ];
  const outletImages = rawOutletImages.length > 0 ? rawOutletImages : fallbackOutletImages;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#006437] py-20 text-center">
        <div className="container mx-auto px-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4">Our Outlets & Products</h1>
          <p className="text-white/80 text-lg mb-4">See T Vanamm in action across India</p>
          <div className="text-white/80 text-sm font-medium tracking-widest uppercase">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">&gt;</span> Gallery
          </div>
        </div>
      </section>

      {/* Tab Filters */}
      <section className="py-12 bg-gray-50 border-b border-gray-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-4 hide-scrollbar">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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

      {/* Videos Section — Single-video carousel */}
      <GalleryVideoCarousel videos={videoData} />

      {/* CTA */}
      <section className="py-20 bg-[#C8A96E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-8">Like what you see? Own your outlet today.</h2>
          <Link href="/#franchise-enquiry" scroll={true} className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-colors text-lg">Get in Touch</Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-5xl max-h-[90vh] w-full h-full rounded-2xl overflow-hidden cursor-default" onClick={e => e.stopPropagation()}>
               <Image src={selectedImage} alt="Expanded" fill className="object-contain" />
               <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors">X</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
