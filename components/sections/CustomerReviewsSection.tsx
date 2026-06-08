'use client';

import { Star, Shield, MapPin, TrendingUp } from 'lucide-react';
import Script from 'next/script';
import type { CustomerReview, AggregateRating } from '@/types/review';

// ── Trust Badge ─────────────────────────────────────────────────
function TrustBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#006437]/10 to-[#C8A96E]/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ── Default aggregate (for SEO structured data only) ────────────
const DEFAULT_AGGREGATE: AggregateRating = {
  averageRating: 4.9,
  totalReviews: 1200,
  distribution: { five: 1020, four: 108, three: 48, two: 18, one: 6 },
};

// ── Main Section ────────────────────────────────────────────────
interface CustomerReviewsSectionProps {
  reviews?: CustomerReview[];
  aggregate?: AggregateRating;
}

export function CustomerReviewsSection({
  reviews: _sanityReviews,
  aggregate: sanityAggregate,
}: CustomerReviewsSectionProps) {
  const aggregate = sanityAggregate?.totalReviews ? sanityAggregate : DEFAULT_AGGREGATE;

  // JSON-LD structured data for SEO crawlers (invisible to users)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://tvanamm.com/#reviews',
    name: 'T VANAMM',
    image: 'https://tvanamm.com/images/logo.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(aggregate.averageRating),
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(aggregate.totalReviews),
      reviewCount: String(aggregate.totalReviews),
    },
  };

  return (
    <section
      aria-label="Customer Reviews"
      id="customer-reviews"
      className="py-14 md:py-24 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 relative overflow-hidden"
    >

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #006437 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#006437]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C8A96E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">


        {/* ─── Google Reviews Heading ─────────── */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight px-2">
            Google <span className="text-[#C8A96E]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        {/* ─── EmbedSocial Google Reviews Widget (Live) ─────────── */}
        <div className="max-w-6xl mx-auto mb-10 md:mb-14">
          <div className="embedsocial-hashtag" data-ref="35647b01f93415641149d193ff63467723ad7106" data-dynamicload="yes" data-lazyload="yes">
            <a className="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding" href="https://embedsocial.com/google-reviews-widget/" target="_blank" title="Embed Google reviews">
              <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial" />
              <div className="es-widget-branding-text">Embed Google reviews</div>
            </a>
          </div>
          <Script id="EmbedSocialHashtagScript" src="https://embedsocial.com/cdn/ht.js" strategy="lazyOnload" />
        </div>

        {/* ─── Trust Badges (Below the widget) ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <TrustBadge
            icon={<Shield size={20} className="text-[#006437]" />}
            label="Verified Reviews"
            value="100% Authentic"
          />
          <TrustBadge
            icon={<MapPin size={20} className="text-[#006437]" />}
            label="Outlets Reviewed"
            value="250+ Locations"
          />
          <TrustBadge
            icon={<TrendingUp size={20} className="text-[#006437]" />}
            label="Customer Satisfaction"
            value="98% Recommend"
          />
        </div>

      </div>
    </section>
  );
}
