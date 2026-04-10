'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultTestimonials = [
  {
    isVideo: true,
    youtubeUrl: "https://youtu.be/F-n05TjRr08?si=aHqa5eXIhDijJfkC",
    ownerName: "Partner 1",
    city: "Hyderabad",
    outletName: "T Vanamm Outlet"
  },
  {
    isVideo: true,
    youtubeUrl: "https://youtu.be/7nbAyv48x_M?si=bAHckm8KOTqlE3HM",
    ownerName: "Partner 2",
    city: "Chennai",
    outletName: "T Vanamm Outlet"
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

/* ===================================================================
   VIDEO CAROUSEL
   - Pure ref-based: React NEVER touches transform/transition
   - Clone trick: [clone_last, V1, V2, V3, clone_first]
   - e.target check prevents child transitions from interfering
   =================================================================== */
function VideoCarousel({ videos }: { videos: Testimonial[] }) {
  const total = videos.length;
  const slides = useMemo(
    () => [videos[total - 1], ...videos, videos[0]],
    [videos, total]
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(1);
  const animatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Single function to set track position (with or without animation)
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

  // Only handle transitions from the track itself, not children (iframes/buttons)
  const onEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    animatingRef.current = false;
    const idx = indexRef.current;
    // If at a clone, instantly jump to the real slide
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

  // Auto-play with timer reset on manual click
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!animatingRef.current) moveTo(indexRef.current + 1, true);
    }, 4000);
  }, [moveTo]);

  const clickNext = useCallback(() => { next(); startTimer(); }, [next, startTimer]);
  const clickPrev = useCallback(() => { prev(); startTimer(); }, [prev, startTimer]);

  // Initial position + start auto-play
  useEffect(() => {
    moveTo(1, false);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [moveTo, startTimer]);

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <div className="flex gap-2">
          <button onClick={clickPrev} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronLeft size={20} />
          </button>
          <button onClick={clickNext} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl max-w-2xl mx-auto">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ backfaceVisibility: 'hidden' }}
          onTransitionEnd={onEnd}
        >
          {slides.map((testimonial, i) => {
            let embedUrl = testimonial.youtubeUrl || "";
            if (embedUrl.includes('watch?v=')) {
              embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
            } else if (embedUrl.includes('youtu.be/')) {
              embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
            }

            return (
              <div
                key={`vid-${i}`}
                className="w-full shrink-0"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="w-full aspect-video bg-gray-200 overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title={`Testimonial from ${testimonial.ownerName}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   REVIEW CAROUSEL
   - Pure ref-based, pixel measurement for card width
   - 3 copies of items, resets at boundary
   - Scrolls 1 card at a time, always right-to-left
   =================================================================== */
/* ===================================================================
   CUSTOMER REVIEWS GRID (STATIC 3-COLUMN)
   =================================================================== */
function CustomerReviewsGrid() {
  const customerVideos = [
    "https://youtu.be/zmuOPzwAiGI?si=_EUPo2zwCA6JVOGR",
    "https://youtu.be/i1v6vwcdirI?si=A5Pmc2GVR4d-zhTu",
    "https://youtu.be/T4QlLbv6Xbg?si=SWKNCfBCQ1cBElrM"
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            Customer Reviews
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerVideos.map((url, i) => {
          let embedUrl = url;
          if (embedUrl.includes('watch?v=')) {
            embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
          } else if (embedUrl.includes('youtu.be/')) {
            embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
          }

          return (
            <div key={i} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title={`Customer Review ${i + 1}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
        })}
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
  const textReviews = allTestimonials.filter(t => !t.isVideo);

  return (
    <>
      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#006437] mb-3">
              Our Franchise Success Stories
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
