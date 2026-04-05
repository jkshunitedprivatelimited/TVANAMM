'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Use same filters as before
const filters = ['All', 'Outlets', 'Products', 'Franchise Owners', 'Before & After'];

// Fallback images if completely empty
const fallbackGallery = Array.from({ length: 12 }).map((_, i) => {
  const images = ['/images/gallery/tea_beverages.png', '/images/gallery/iced_peach_tea.png'];
  const titles = ['Premium Tea Assortment', 'Refreshing Iced Peach Tea'];
  return {
    id: `fallback-${i}`,
    category: filters[(i % 4) + 1],
    src: images[i % 2],
    title: titles[i % 2],
  };
});

// Fallback videos
const fallbackVideos = [
  { youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Video 1" },
  { youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Video 2" }
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

export function GalleryClient({ initialImages, initialVideos }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use provided images or fallback
  const galleryData = initialImages?.length ? initialImages : fallbackGallery;
  const videoData = initialVideos?.length ? initialVideos : fallbackVideos;

  const filteredImages = activeTab === 'All' ? galleryData : galleryData.filter(img => img.category === activeTab);

  return (
    <>
      <section className="bg-[#006437] py-20 text-center">
        <div className="container mx-auto px-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4">Our Outlets & Products</h1>
          <p className="text-white/80 text-lg mb-4">See T Vanamm in action across India</p>
          <div className="text-white/80 text-sm font-medium tracking-widest uppercase">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">&gt;</span> Gallery
          </div>
        </div>
      </section>

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

      <section className="py-20 bg-white min-h-[600px]">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatePresence mode="popLayout">
            {filteredImages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No images found for this category.</div>
            ) : (
              <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {filteredImages.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="break-inside-avoid"
                  >
                    <div 
                      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-gray-100"
                      onClick={() => setSelectedImage(item.src)}
                    >
                      <Image 
                        src={item.src} 
                        alt={item.title || 'Gallery image'} 
                        width={600} 
                        height={item.src.includes('800') ? 800 : 600} 
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-[#006437]/0 group-hover:bg-[#006437]/60 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-bold tracking-widest uppercase transition-opacity duration-300 delay-100 text-sm">Expand</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-[#006437] mb-4">See Our Outlets Come to Life</h2>
            <div className="w-16 h-1 bg-[#C8A96E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {videoData.map((vid: GalleryVideo, idx: number) => (
               <div key={idx} className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-xl">
                 <iframe width="100%" height="100%" src={vid.youtubeUrl} title={vid.title || `Video ${idx+1}`} frameBorder="0" allowFullScreen></iframe>
               </div>
             ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#C8A96E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-8">Like what you see? Own your outlet today.</h2>
          <Link href="/#franchise-enquiry" scroll={true} className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-colors text-lg">Get in Touch</Link>
        </div>
      </section>

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
