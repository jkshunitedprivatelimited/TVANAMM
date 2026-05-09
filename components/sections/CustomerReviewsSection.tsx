'use client';

import { Star, BadgeCheck, Quote } from 'lucide-react';
import Image from 'next/image';
import type { CustomerReview, AggregateRating } from '@/types/review';



// ── Star Rating Display ─────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
    </div>
  );
}

// ── Distribution Bar ────────────────────────────────────────────
function DistributionBar({
  starCount,
  count,
  total,
}: {
  starCount: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-gray-500 font-medium">{starCount}</span>
      <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-400 text-xs">{Math.round(percentage)}%</span>
    </div>
  );
}

// ── Review Card ─────────────────────────────────────────────────
function ReviewCard({ review }: { review: CustomerReview }) {

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#006437] to-[#C8A96E] flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
          {review.avatar?.asset?._ref ? (
            <Image
              src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${review.avatar.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
              alt={review.customerName}
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          ) : (
            review.customerName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-gray-900 truncate">{review.customerName}</h4>
            {review.isVerified && (
              <BadgeCheck size={16} className="text-blue-500 shrink-0" />
            )}
          </div>
          {review.city && (
            <p className="text-xs text-gray-400 mt-0.5">{review.city}</p>
          )}
        </div>

      </div>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={review.rating} size={14} />
        {review.date && (
          <span className="text-xs text-gray-300">
            {new Date(review.date).toLocaleDateString('en-IN', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* Review text */}
      <div className="relative flex-1">
        <Quote size={16} className="text-[#C8A96E]/30 absolute -top-1 -left-1" />
        <p className="text-gray-600 text-sm leading-relaxed pl-4 line-clamp-4">
          {review.reviewText}
        </p>
      </div>
    </div>
  );
}

// ── Default reviews (shown when Sanity has no data) ─────────────
const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    _id: 'default-1',
    _type: 'customerReview',
    customerName: 'Rajesh Kumar',
    city: 'Hyderabad',
    rating: 5,
    reviewText: 'Best chai I have ever had! The Masala Tea is absolutely perfect. Visited the T VANAMM outlet near Kukatpally and the ambiance was great too. Highly recommended for tea lovers!',

    isVerified: true,
    isFeatured: true,
  },
  {
    _id: 'default-2',
    _type: 'customerReview',
    customerName: 'Priya Sharma',
    city: 'Chennai',
    rating: 5,
    reviewText: 'Amazing variety of beverages. The Butter Scotch Shake and Filter Coffee are my favourites. Great quality at affordable prices. Will definitely come back again!',

    isVerified: true,
    isFeatured: true,
  },
  {
    _id: 'default-3',
    _type: 'customerReview',
    customerName: 'Arjun Reddy',
    city: 'Bangalore',
    rating: 5,
    reviewText: 'T VANAMM has the most authentic South Indian filter coffee in Bangalore. The aroma itself is worth the visit. Consistent quality across all their outlets.',

    isVerified: false,
    isFeatured: true,
  },
  {
    _id: 'default-4',
    _type: 'customerReview',
    customerName: 'Meera Patel',
    city: 'Mumbai',
    rating: 4,
    reviewText: 'Ordered through Swiggy and the delivery was quick. The Elaichi Tea was flavourful and hot even after delivery. Great packaging. One of the best tea brands in India.',

    isVerified: true,
    isFeatured: true,
  },
  {
    _id: 'default-5',
    _type: 'customerReview',
    customerName: 'Sanjay Gupta',
    city: 'Delhi',
    rating: 5,
    reviewText: 'Franchise model is excellent and the tea quality is unmatched. As a customer first and now a franchise partner, I can vouch for T VANAMM quality and consistency.',

    isVerified: true,
    isFeatured: true,
  },
  {
    _id: 'default-6',
    _type: 'customerReview',
    customerName: 'Ananya Iyer',
    city: 'Kolkata',
    rating: 5,
    reviewText: 'Finally a tea brand that understands Indian taste! The Rose Tea is unique and refreshing. Clean outlet, friendly staff, and reasonable prices. Love it!',

    isVerified: false,
    isFeatured: true,
  },
];

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
  reviews: sanityReviews,
  aggregate: sanityAggregate,
}: CustomerReviewsSectionProps) {
  const reviews = sanityReviews?.length ? sanityReviews : DEFAULT_REVIEWS;
  const aggregate = sanityAggregate?.totalReviews ? sanityAggregate : DEFAULT_AGGREGATE;

  return (
    <section aria-label="Customer Reviews" id="customer-reviews" className="py-12 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #006437 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight">
            What Our Customers <span className="text-[#C8A96E]">Say</span>
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
        </div>

        {/* Aggregate rating + distribution */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Big rating number */}
              <div className="text-center md:text-left shrink-0">
                <div className="text-6xl md:text-7xl font-bold text-[#006437] font-playfair leading-none">
                  {aggregate.averageRating}
                </div>
                <div className="mt-2">
                  <StarRating rating={Math.round(aggregate.averageRating)} size={20} />
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Across</span>
                  <div className="flex items-center gap-1.5">
                    <Image src="/images/swiggy.png" alt="Swiggy" width={20} height={20} className="rounded" />
                    <Image src="/images/zomato.png" alt="Zomato" width={20} height={20} className="rounded" />
                    <span className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center text-[8px] font-bold text-blue-600">G</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-32 bg-gray-200" />
              <div className="block md:hidden w-full h-px bg-gray-200" />

              {/* Distribution bars */}
              <div className="flex-1 w-full space-y-2">
                <DistributionBar starCount={5} count={aggregate.distribution.five} total={aggregate.totalReviews} />
                <DistributionBar starCount={4} count={aggregate.distribution.four} total={aggregate.totalReviews} />
                <DistributionBar starCount={3} count={aggregate.distribution.three} total={aggregate.totalReviews} />
                <DistributionBar starCount={2} count={aggregate.distribution.two} total={aggregate.totalReviews} />
                <DistributionBar starCount={1} count={aggregate.distribution.one} total={aggregate.totalReviews} />
              </div>
            </div>
          </div>
        </div>

        {/* Infinite scrolling review cards */}
        <div className="relative overflow-hidden max-w-6xl mx-auto">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-5 pb-4 group"
            style={{
              animation: 'marquee-scroll 30s linear infinite',
              width: 'max-content',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
          >
            {/* Original cards */}
            {reviews.map((review) => (
              <div
                key={review._id}
                className="shrink-0 w-[300px] md:w-[340px]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
            {/* Duplicated cards for seamless loop */}
            {reviews.map((review) => (
              <div
                key={`dup-${review._id}`}
                className="shrink-0 w-[300px] md:w-[340px]"
                aria-hidden="true"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee keyframe animation */}
        <style jsx>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

      </div>
    </section>
  );
}
