'use client';

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultTestimonials = [
  {
    isVideo: true,
    youtubeUrl: "https://youtu.be/F-n05TjRr08?si=aHqa5eXIhDijJfkC",
    ownerName: "Partner 1",
    city: "Hyderabad",
    outletName: "T VANAMM Outlet"
  },
  {
    isVideo: true,
    youtubeUrl: "https://youtu.be/7nbAyv48x_M?si=bAHckm8KOTqlE3HM",
    ownerName: "Partner 2",
    city: "Chennai",
    outletName: "T VANAMM Outlet"
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

// Utility to reliably parse YouTube URLs and inject the Javascript API
function getYouTubeEmbedUrl(url: string | undefined) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }
  // enablejsapi=1 is REQUIRED to pause the video programmatically via postMessage
  return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : url;
}

/* ===================================================================
   VIDEO CAROUSEL
   =================================================================== */
function VideoCarousel({ videos }: { videos: Testimonial[] }) {
  const total = videos.length;
  // Clone first and last slides for infinite loop trick
  const slides = useMemo(
    () => [videos[total - 1], ...videos, videos[0]],
    [videos, total]
  );

  // State to track if we should still be auto-playing
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(1);
  const animatingRef = useRef(false);
  
  // Store refs to all iframes so we can pause them programmatically
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Function to smoothly pause the video via YouTube Iframe API
  const stopVideo = useCallback((index: number) => {
    const iframe = iframeRefs.current[index];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    }
  }, []);

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
    // Instantly jump to the real slide if we landed on a clone
    if (idx >= total + 1) {
      moveTo(1, false);
    } else if (idx <= 0) {
      moveTo(total, false);
    }
  }, [total, moveTo]);

  // Permanently stop autoplay when the user interacts
  const handleInteract = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const next = useCallback(() => {
    handleInteract(); // Stop autoplay if user manually clicks
    if (animatingRef.current) return;
    stopVideo(indexRef.current);
    moveTo(indexRef.current + 1, true);
  }, [moveTo, stopVideo, handleInteract]);

  const prev = useCallback(() => {
    handleInteract(); // Stop autoplay if user manually clicks
    if (animatingRef.current) return;
    stopVideo(indexRef.current);
    moveTo(indexRef.current - 1, true);
  }, [moveTo, stopVideo, handleInteract]);

  // Set initial position
  useEffect(() => {
    moveTo(1, false); 
  }, [moveTo]);

  // Auto-play interval
  useEffect(() => {
    // If user has interacted, don't run the timer
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      if (!animatingRef.current) {
        stopVideo(indexRef.current);
        moveTo(indexRef.current + 1, true);
      }
    }, 4000); // Slides every 4 seconds
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, moveTo, stopVideo]);

  return (
    <div 
      className="relative"
      onMouseEnter={handleInteract} // Stop autoplay on desktop hover
      onTouchStart={handleInteract} // Stop autoplay on mobile tap
    >
      <div className="flex items-center justify-end mb-4">
        <div className="flex gap-2">
          <button onClick={prev} aria-label="Previous Video" className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} aria-label="Next Video" className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl max-w-3xl mx-auto touch-pan-y">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ backfaceVisibility: 'hidden' }}
          onTransitionEnd={onEnd}
        >
          {slides.map((testimonial, i) => (
            <div
              key={`vid-${i}`}
              className="w-full shrink-0 px-2"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <div className="w-full aspect-video bg-gray-200 overflow-hidden relative">
                  <iframe
                    ref={(el) => {
                      iframeRefs.current[i] = el;
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                    src={getYouTubeEmbedUrl(testimonial.youtubeUrl)}
                    title={`Testimonial from ${testimonial.ownerName}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CUSTOMER REVIEWS GRID
   =================================================================== */
function CustomerReviewsGrid() {
  const customerVideos = [
    "https://youtu.be/zmuOPzwAiGI?si=_EUPo2zwCA6JVOGR",
    "https://youtu.be/i1v6vwcdirI?si=A5Pmc2GVR4d-zhTu",
    "https://youtu.be/T4QlLbv6Xbg?si=SWKNCfBCQ1cBElrM"
  ];

  return (
    <section className="py-12 md:py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight px-2">
            Customer <span className="text-[#C8A96E]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerVideos.map((url, i) => (
            <div key={i} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden relative">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={getYouTubeEmbedUrl(url)}
                  title={`Customer Review ${i + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   MAIN SECTION
   =================================================================== */
export function TestimonialsSection({ testimonials: sanityTestimonials }: { testimonials?: Testimonial[] }) {
  const allTestimonials = sanityTestimonials?.length ? sanityTestimonials : defaultTestimonials;
  const videoReviews = allTestimonials.filter(t => t.isVideo);

  return (
    <>
      <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#006437] mb-3 leading-tight px-2">
              Our Franchise <br className="block md:hidden" />
              <span className="text-[#C8A96E]">Success Stories</span>
            </h2>
            <div className="w-20 h-1 bg-[#C8A96E] mx-auto rounded-full" />
          </div>

          {videoReviews.length > 0 && <VideoCarousel videos={videoReviews} />}
        </div>
      </section>
      
      <CustomerReviewsGrid />
    </>
  );
}