'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Use same filters as before
const filters = ['All', 'Outlets', 'Products', 'Franchise Owners'];

// Fallback images if completely empty
const fallbackGallery = Array.from({ length: 12 }).map((_, i) => {
  const images = ['/images/gallery/tea_beverages.png', '/images/gallery/iced_peach_tea.png'];
  const titles = ['Premium Tea Assortment', 'Refreshing Iced Peach Tea'];
  return {
    id: `fallback-${i}`,
    category: filters[(i % 3) + 1],
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
      <section className="bg-primary flex flex-col justify-center text-center relative overflow-hidden pt-32 pb-12 md:pt-36 md:pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary to-primary-dark/95 z-0" />
        <div className="absolute inset-0 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay opacity-10 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 relative z-10 mt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 drop-shadow-md"
          >
            Our Outlets & Products
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-white/90 text-xl font-light mb-8 max-w-2xl mx-auto"
          >
             See T Vanamm in action across India
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-accent-light text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3"
          >
            <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link> 
            <span className="text-white/30">•</span> 
            <span className="text-white">Gallery</span>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex justify-start md:justify-center flex-nowrap min-w-max md:min-w-0 md:flex-wrap gap-2 md:gap-4 px-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTab(filter)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 ${activeTab === filter ? 'text-white shadow-md' : 'text-gray-600 hover:text-primary bg-white shadow-sm border border-gray-100 hover:border-primary/30'}`}
              >
                {activeTab === filter && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-full z-0" />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white min-h-[600px] relative">
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredImages.length === 0 ? (
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }} 
                 className="text-center py-20 text-gray-500 font-medium text-lg"
              >
                 No images found for this category.
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                {filteredImages.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group"
                  >
                    <div 
                      className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group shadow-lg bg-gray-100 border border-gray-100"
                      onClick={() => setSelectedImage(item.src)}
                    >
                      <Image 
                        src={item.src} 
                        alt={item.title || 'Gallery image'} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary-dark/40 transition-colors duration-500 flex items-center justify-center">
                        <div className="bg-white/95 text-primary px-8 py-3 rounded-full font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 text-xs md:text-sm shadow-2xl backdrop-blur-sm">
                          View Image
                        </div>
                      </div>
                    </div>
                    {item.title && (
                      <div className="mt-5 text-center px-4">
                        <h3 className="text-gray-900 group-hover:text-primary transition-colors font-playfair font-bold text-xl">{item.title}</h3>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50 border-t border-gray-100 relative">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-6">See Our Outlets Come to Life</h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full shadow-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
             {videoData.map((vid: GalleryVideo, idx: number) => {
               let embedUrl = vid.youtubeUrl;
               if (embedUrl?.includes('watch?v=')) {
                 embedUrl = embedUrl.replace('watch?v=', 'embed/');
                 embedUrl = embedUrl.split('&')[0];
               } else if (embedUrl?.includes('youtu.be/')) {
                 embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                 embedUrl = embedUrl.split('?')[0];
               }

               return (
                 <motion.div 
                   key={idx} 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.2, duration: 0.6 }}
                   className="aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
                 >
                   <iframe width="100%" height="100%" src={embedUrl} title={vid.title || `Video ${idx+1}`} frameBorder="0" allowFullScreen className="group-hover:scale-105 transition-transform duration-700"></iframe>
                 </motion.div>
               );
             })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-0 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-10 drop-shadow-md max-w-3xl mx-auto leading-tight"
          >
            Like what you see? Own your outlet today.
          </motion.h2>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <Link 
              href="/#franchise-enquiry" 
              scroll={true}
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-primary-dark transition-all duration-300 text-lg group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                Get in Touch
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               exit={{ scale: 0.9, y: 20 }} 
               transition={{ type: "spring", bounce: 0.4 }}
               className="relative max-w-6xl w-full h-[85vh] rounded-2xl overflow-hidden cursor-default shadow-2xl" 
               onClick={e => e.stopPropagation()}
            >
               <Image src={selectedImage} alt="Expanded" fill className="object-contain drop-shadow-2xl" sizes="100vw" />
               <button 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg border border-white/20 backdrop-blur-md font-bold text-xl"
               >
                  ✕
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
