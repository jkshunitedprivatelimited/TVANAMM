'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultTestimonials = [
  ...Array.from({ length: 9 }).map((_, i) => ({
    isVideo: false,
    quote: `Partnering with T Vanamm was a game-changer. The ROI was incredibly fast, and the support we received from day one was unmatched. Highly recommended. - Review ${i + 1}`,
    ownerName: `Owner ${i + 1}`,
    city: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"][i % 4],
    outletName: `Branch ${i + 1}`
  })),
  {
    isVideo: true,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ownerName: "Video Owner 1",
    city: "Hyderabad",
    outletName: "Kukatpally Branch"
  },
  {
    isVideo: true,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ownerName: "Video Owner 2",
    city: "Bangalore",
    outletName: "Indiranagar Branch"
  },
  {
    isVideo: true,
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ownerName: "Video Owner 3",
    city: "Chennai",
    outletName: "T Nagar Branch"
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
    <div className="mb-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-playfair font-bold text-gray-900">Franchise Success Stories</h3>
        <div className="flex gap-2">
          <button onClick={clickPrev} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronLeft size={20} />
          </button>
          <button onClick={clickNext} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl max-w-4xl mx-auto">
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                  <div className="w-full md:w-[65%] aspect-video bg-gray-200 overflow-hidden shrink-0">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title={`Testimonial from ${testimonial.ownerName}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="w-full md:w-[35%] p-8 bg-white flex flex-col justify-center text-left">
                    <h4 className="font-bold text-gray-900 text-xl mb-1">{testimonial.ownerName}</h4>
                    <p className="text-[#006437] font-medium mb-4">{testimonial.city}</p>
                    <div className="w-12 h-1 bg-[#C8A96E] mb-4" />
                    <p className="text-sm text-gray-500 uppercase tracking-widest">{testimonial.outletName}</p>
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
function ReviewCarousel({ reviews }: { reviews: Testimonial[] }) {
  const total = reviews.length;
  const slides = useMemo(
    () => [...reviews, ...reviews, ...reviews],
    [reviews]
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Measure exact distance between consecutive card left edges (subpixel-accurate)
  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const first = track.children[0].getBoundingClientRect();
    const second = track.children[1].getBoundingClientRect();
    return second.left - first.left;
  }, []);

  const moveTo = useCallback((idx: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    const cw = getCardWidth();
    if (animate) {
      track.style.transition = 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
      animatingRef.current = true;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${idx * cw}px)`;
    indexRef.current = idx;
  }, [getCardWidth]);

  const onEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    animatingRef.current = false;
    const idx = indexRef.current;
    if (idx >= total) moveTo(0, false);
    else if (idx < 0) moveTo(total - 1, false);
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
    }, 3500);
  }, [moveTo]);

  const clickNext = useCallback(() => { next(); startTimer(); }, [next, startTimer]);
  const clickPrev = useCallback(() => { prev(); startTimer(); }, [prev, startTimer]);

  // Initial position + auto-play + handle resize
  useEffect(() => {
    moveTo(0, false);
    startTimer();

    const handleResize = () => {
      // Re-apply current position with new card width (no animation)
      moveTo(indexRef.current, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [moveTo, startTimer]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-playfair font-bold text-gray-900">Partner Reviews</h3>
        <div className="flex gap-2">
          <button onClick={clickPrev} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronLeft size={20} />
          </button>
          <button onClick={clickNext} className="p-2 rounded-full bg-white shadow hover:bg-[#006437] hover:text-white transition-colors text-[#006437]">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ backfaceVisibility: 'hidden' }}
          onTransitionEnd={onEnd}
        >
          {slides.map((testimonial, idx) => (
            <div
              key={`text-${idx}`}
              className="shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-2xl border border-gray-200 flex flex-col h-auto"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Quote size={32} className="text-[#C8A96E] mb-4 opacity-50 shrink-0" />
              <p className="text-gray-700 font-medium leading-relaxed mb-6 italic flex-grow">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-auto pt-5 border-t border-gray-100 shrink-0">
                <h4 className="font-bold text-gray-900">{testimonial.ownerName}</h4>
                <p className="text-[#006437] font-medium text-sm">{testimonial.city}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{testimonial.outletName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            What Our Franchise Owners Say
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        {videoReviews.length > 0 && <VideoCarousel videos={videoReviews} />}
        {textReviews.length > 0 && <ReviewCarousel reviews={textReviews} />}
      </div>
    </section>
  );
}
