'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ownerVideos = [
  { id: 'F-n05TjRr08', title: 'Franchise Owner Review 1' },
  { id: 'ApUquli1dmc', title: 'Franchise Owner Review 2' },
  { id: '7nbAyv48x_M', title: 'Franchise Owner Review 3' },
];

const customerVideos = [
  { id: 'zmuOPzwAiGI', title: 'Customer Review 1' },
  { id: 'i1v6vwcdirI', title: 'Customer Review 2' },
  { id: 'T4QlLbv6Xbg', title: 'Customer Review 3' },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    // If playing, rotate every 6 seconds
    if (!autoPlay) return;
    
    // Auto-advance carousel
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === ownerVideos.length - 1 ? 0 : prev + 1));
    }, 6000);
    
    return () => clearInterval(timer);
  }, [autoPlay]);

  const prev = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev === 0 ? ownerVideos.length - 1 : prev - 1));
  };

  const next = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev === ownerVideos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
          >
            Our Franchise Success Stories
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
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Hear directly from the partners who have built profitable businesses with us, and the customers who love our authentic flavors perfectly.
          </motion.p>
        </div>

        {/* OWNER REVIEWS - Animated Carousel */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-center mb-10 text-gray-800 tracking-wide font-playfair">Franchise Owner Reviews</h3>
          
          <div className="relative max-w-4xl mx-auto aspect-video md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center p-2 md:p-0"
              >
                <div className="w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${ownerVideos[current].id}?rel=0`}
                    title={ownerVideos[current].title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop Controls */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-8 lg:-left-16">
              <button 
                onClick={prev} 
                className="p-4 rounded-full bg-white shadow-lg text-primary hover:bg-primary hover:text-accent-light transition-all duration-300 hover:scale-110 active:scale-95 border border-gray-100"
              >
                <ChevronLeft size={28} />
              </button>
            </div>
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-8 lg:-right-16">
              <button 
                onClick={next} 
                className="p-4 rounded-full bg-white shadow-lg text-primary hover:bg-primary hover:text-accent-light transition-all duration-300 hover:scale-110 active:scale-95 border border-gray-100"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          {/* Mobile Controls & Dots */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={prev} 
              className="md:hidden p-3 rounded-full bg-white shadow-md text-primary hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex justify-center gap-3">
              {ownerVideos.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i+1}`}
                  onClick={() => { setAutoPlay(false); setCurrent(i); }}
                  className={`transition-all duration-300 rounded-full ${
                    current === i ? 'w-10 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={next} 
              className="md:hidden p-3 rounded-full bg-white shadow-md text-primary hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* CUSTOMER REVIEWS - Static Grid */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-10 text-gray-800 tracking-wide font-playfair">Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerVideos.map((video, idx) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-4 rounded-3xl shadow-xl shadow-primary/5 border border-gray-100 group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                    title={video.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
