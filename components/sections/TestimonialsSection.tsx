'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const defaultTestimonials = [
  {
    isVideo: false,
    quote: "Partnering with T Vanamm was the best business decision I made. The ROI happened within 8 months, and the team's support is unmatched.",
    ownerName: "Rahul Sharma",
    city: "Hyderabad",
    outletName: "Kukatpally Branch"
  },
  {
    isVideo: true,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder youtube
    ownerName: "Priya Reddy",
    city: "Bangalore",
    outletName: "Indiranagar Branch"
  },
  {
    isVideo: false,
    quote: "The product quality is completely pure. Customers keep coming back strictly because of the consistent taste across all 120 items.",
    ownerName: "Amit Patel",
    city: "Ahmedabad",
    outletName: "SG Highway Branch"
  }
];

export interface Testimonial {
  isVideo: boolean;
  quote?: string;
  youtubeUrl?: string;
  ownerName: string;
  city: string;
  outletName: string;
}

export function TestimonialsSection({ testimonials: sanityTestimonials }: { testimonials?: Testimonial[] }) {
  const allTestimonials = sanityTestimonials?.length ? sanityTestimonials : defaultTestimonials;
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    // Only autoplay on non-mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setAutoPlay(false);
      return;
    }

    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === allTestimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    
    return () => clearInterval(timer);
  }, [autoPlay, current, allTestimonials.length]);

  const prev = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev === 0 ? allTestimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev === allTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            What Our Franchise Owners Say
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                {allTestimonials[current].isVideo ? (
                  <div className="w-full md:w-1/2 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={allTestimonials[current].youtubeUrl} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full md:w-1/2 flex justify-center">
                     <div className="w-32 h-32 md:w-48 md:h-48 bg-[#006437]/10 rounded-full flex items-center justify-center">
                        <Quote size={64} className="text-[#006437] opacity-20" />
                     </div>
                  </div>
                )}
                
                <div className={`w-full md:w-1/2 text-left ${allTestimonials[current].isVideo ? 'mt-4 md:mt-0' : ''}`}>
                  {!allTestimonials[current].isVideo && (
                    <>
                      <Quote size={32} className="text-[#C8A96E] mb-4" />
                      <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed mb-6 italic">
                        &quot;{allTestimonials[current].quote}&quot;
                      </p>
                    </>
                  )}
                  <div className="mt-auto">
                    <h4 className="font-bold text-gray-900 text-lg">{allTestimonials[current].ownerName}</h4>
                    <p className="text-[#006437] font-medium">{allTestimonials[current].city}</p>
                    <p className="text-sm text-gray-500">{allTestimonials[current].outletName}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16">
            <button onClick={prev} className="p-3 rounded-full bg-white shadow-md text-[#006437] hover:bg-[#006437] hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16">
            <button onClick={next} className="p-3 rounded-full bg-white shadow-md text-[#006437] hover:bg-[#006437] hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {allTestimonials.map((_: Testimonial, i: number) => (
            <button
              key={i}
              onClick={() => { setAutoPlay(false); setCurrent(i); }}
              className={`w-3 h-3 rounded-full transition-colors ${current === i ? 'bg-[#006437]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
