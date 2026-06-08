'use client';

import { useState, useRef, useCallback } from 'react';

const defaultTestimonials = [
  {
    isVideo: true,
    youtubeUrl: "https://www.instagram.com/reel/DUGSbnRkuUC/?igsh=aDEybGFhczY1ODdk",
    ownerName: "Franchise Partner",
    city: "India",
    outletName: "T VANAMM Outlet"
  },
  {
    isVideo: true,
    youtubeUrl: "https://www.instagram.com/reel/DUC7FSmkUGG/?igsh=MjZyM2c0eHdtb3Jj",
    ownerName: "Franchise Partner",
    city: "India",
    outletName: "T VANAMM Outlet"
  },
  {
    isVideo: true,
    youtubeUrl: "https://www.instagram.com/reel/DTFixOVEW_j/?igsh=MXU5aWM5eTM5MmdyOA==",
    ownerName: "Franchise Partner",
    city: "India",
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

// Utility to reliably parse YouTube and Instagram URLs for embedding
function getEmbedUrl(url: string | undefined) {
  if (!url) return "";
  
  if (url.includes("instagram.com")) {
    const match = url.match(/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.instagram.com/reel/${match[1]}/embed`;
    }
    return url;
  }

  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }
  // enablejsapi=1 is REQUIRED to pause the video programmatically via postMessage
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0` : url;
}

function isInstagramUrl(url?: string) {
  return url?.includes("instagram.com");
}

/* ===================================================================
   SINGLE VIDEO CARD (always shows preview, click to activate)
   =================================================================== */
function VideoCard({
  testimonial,
  uniqueId,
  activeVideoId,
  onActivate,
}: {
  testimonial: Testimonial;
  uniqueId: string;
  activeVideoId: string | null;
  onActivate: (id: string) => void;
}) {
  const isInsta = isInstagramUrl(testimonial.youtubeUrl);
  const isActive = activeVideoId === uniqueId;

  // Track a reset counter. When the video transitions from active → inactive,
  // we increment this, which changes the iframe key and forces React to
  // destroy + re-create the iframe (stopping playback, restoring preview).
  const resetCountRef = useRef(0);
  const wasActiveRef = useRef(false);

  if (wasActiveRef.current && !isActive) {
    // Just went from active → inactive: bump reset counter
    resetCountRef.current += 1;
  }
  wasActiveRef.current = isActive;

  const iframeKey = `${uniqueId}-${resetCountRef.current}`;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-shadow ${isActive ? 'shadow-xl ring-2 ring-[#006437]/20' : ''} ${isInsta ? 'w-[260px]' : 'w-[280px] md:w-[400px]'}`}>
      <div className={`w-full ${isInsta ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200 overflow-hidden relative`}>
        {/* Always render the iframe so Instagram's own preview/thumbnail is visible */}
        <iframe
          key={iframeKey}
          className="absolute top-0 left-0 w-full h-full"
          src={getEmbedUrl(testimonial.youtubeUrl)}
          title={`Testimonial from ${testimonial.ownerName}`}
          frameBorder="0"
          scrolling={isInsta ? "no" : "auto"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>

        {/* Transparent click-intercepting overlay on inactive videos */}
        {!isActive && (
          <button
            type="button"
            className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent focus:outline-none"
            onClick={() => onActivate(uniqueId)}
            aria-label={`Play video from ${testimonial.ownerName}`}
          />
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   VIDEO CAROUSEL (Mobile: Snap Scroll, Desktop: Continuous Scroll)
   Separated into two containers to avoid CSS conflicts that cause glitches.
   =================================================================== */
function VideoCarousel({ videos }: { videos: Testimonial[] }) {
  // Track which video is currently active/playing — null means none
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleActivate = useCallback((id: string) => {
    setActiveVideoId((prev) => {
      if (prev === id) return null;
      return id;
    });

    // Pause marquee when a video is playing
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  }, []);

  // When mouse leaves the entire carousel and no video is active, resume marquee
  const handleMouseLeave = useCallback(() => {
    if (marqueeRef.current && !activeVideoId) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  }, [activeVideoId]);

  // When mouse enters, always pause marquee so user can browse
  const handleMouseEnter = useCallback(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  }, []);

  return (
    <>
      {/* ── MOBILE: horizontal snap scroll (below md) ── */}
      <div className="md:hidden overflow-hidden py-4">
        <div className="flex gap-4 pb-4 overflow-x-auto snap-x snap-mandatory px-4 mobile-scroll-hide">
          {videos.map((testimonial, i) => (
            <div
              key={`mob-${i}`}
              className="shrink-0 snap-center"
            >
              <VideoCard
                testimonial={testimonial}
                uniqueId={`mob-${i}`}
                activeVideoId={activeVideoId}
                onActivate={handleActivate}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: continuous marquee (md and above) ── */}
      <div
        className="hidden md:block overflow-hidden max-w-6xl mx-auto py-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={marqueeRef}
          className="desktop-marquee-track"
        >
          {/* Set 1 (original) */}
          {videos.map((testimonial, i) => (
            <div
              key={`dt1-${i}`}
              className="shrink-0"
            >
              <VideoCard
                testimonial={testimonial}
                uniqueId={`dt1-${i}`}
                activeVideoId={activeVideoId}
                onActivate={handleActivate}
              />
            </div>
          ))}
          {/* Set 2 (duplicate for seamless loop) */}
          {videos.map((testimonial, i) => (
            <div
              key={`dt2-${i}`}
              className="shrink-0"
              aria-hidden="true"
            >
              <VideoCard
                testimonial={testimonial}
                uniqueId={`dt2-${i}`}
                activeVideoId={activeVideoId}
                onActivate={handleActivate}
              />
            </div>
          ))}
          {/* Set 3 (extra duplicate to fill viewport gap) */}
          {videos.map((testimonial, i) => (
            <div
              key={`dt3-${i}`}
              className="shrink-0"
              aria-hidden="true"
            >
              <VideoCard
                testimonial={testimonial}
                uniqueId={`dt3-${i}`}
                activeVideoId={activeVideoId}
                onActivate={handleActivate}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mobile-scroll-hide::-webkit-scrollbar {
          display: none;
        }
        .mobile-scroll-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .desktop-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          will-change: transform;
          animation: marquee-smooth 30s linear infinite;
        }

        @keyframes marquee-smooth {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.33%, 0, 0);
          }
        }
      `}</style>
    </>
  );
}

/* ===================================================================
   CUSTOMER REVIEWS GRID
   =================================================================== */

function GridVideoCard({ url, i }: { url: string; i: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isInsta = isInstagramUrl(url);

  let videoId = "";
  if (!isInsta && url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  else if (!isInsta && url.includes("watch?v=")) videoId = url.split("watch?v=")[1].split("&")[0];

  return (
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-full ${isInsta ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200 rounded-xl overflow-hidden relative`}>
        {(!isPlaying && !isInsta && videoId) ? (
          <div className="absolute inset-0 cursor-pointer group" onClick={() => setIsPlaying(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Video thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        ) : (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl(url) + (isPlaying ? "&autoplay=1" : "")}
            title={`Customer Review ${i + 1}`}
            frameBorder="0"
            scrolling={isInsta ? "no" : "auto"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
}

function CustomerReviewsGrid() {
  const customerVideos = [
    "https://youtu.be/zmuOPzwAiGI?si=_EUPo2zwCA6JVOGR",
    "https://youtu.be/i1v6vwcdirI?si=A5Pmc2GVR4d-zhTu",
    "https://youtu.be/T4QlLbv6Xbg?si=SWKNCfBCQ1cBElrM"
  ];

  return (
    <section className="py-12 md:py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight px-2">
            Customer <span className="text-[#C8A96E]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerVideos.map((url, i) => (
            <GridVideoCard key={i} url={url} i={i} />
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