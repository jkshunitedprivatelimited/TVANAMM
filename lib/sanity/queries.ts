import { client } from './client';

export async function getSiteSettings() {
  return await client.fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { next: { tags: ['siteSettings'] } }
  );
}

export async function getHomePage() {
  return await client.fetch(
    `*[_type == "homePage"][0]`,
    {},
    { next: { tags: ['homePage'] } }
  );
}

export async function getAboutPage() {
  return await client.fetch(
    `*[_type == "aboutPage"][0]`,
    {},
    { next: { tags: ['aboutPage'] } }
  );
}

export async function getGalleryPage() {
  return await client.fetch(
    `*[_type == "galleryPage"][0]`,
    {},
    { next: { tags: ['galleryPage'] } }
  );
}

export async function getBlogPosts() {
  return await client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc)`,
    {},
    { next: { tags: ['blogPosts'] } }
  );
}

export async function getBlogPostBySlug(slug: string) {
  return await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]`,
    { slug },
    { next: { tags: ['blogPost'] } }
  );
}

export async function getContactPage() {
  return await client.fetch(
    `*[_type == "contactPage"][0]`,
    {},
    { next: { tags: ['contactPage'] } }
  );
}

// ── Outlet Queries ──────────────────────────────────────────────

export async function getAllOutlets() {
  return await client.fetch(
    `*[_type == "outlet" && isActive == true] | order(city asc) {
      _id,
      name,
      slug,
      city,
      state,
      pincode,
      fullAddress,
      phone,
      openingHours,
      location,
      googleMapsUrl,
      image,
      isActive
    }`,
    {},
    { next: { tags: ['outlets'] } }
  );
}

// ── Customer Review Queries ─────────────────────────────────────

export async function getFeaturedReviews() {
  return await client.fetch(
    `*[_type == "customerReview" && isFeatured == true] | order(date desc) {
      _id,
      customerName,
      city,
      rating,
      reviewText,
      source,
      date,
      avatar,
      isVerified,
      isFeatured
    }`,
    {},
    { next: { tags: ['customerReviews'] } }
  );
}

export async function getAllReviews() {
  return await client.fetch(
    `*[_type == "customerReview"] | order(date desc) {
      _id,
      customerName,
      city,
      rating,
      reviewText,
      source,
      date,
      avatar,
      isVerified,
      isFeatured
    }`,
    {},
    { next: { tags: ['customerReviews'] } }
  );
}

export async function getAggregateRating() {
  const reviews = await client.fetch(
    `*[_type == "customerReview"] { rating }`,
    {},
    { next: { tags: ['customerReviews'] } }
  );

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 4.9,
      totalReviews: 0,
      distribution: { five: 0, four: 0, three: 0, two: 0, one: 0 },
    };
  }

  const total = reviews.length;
  const sum = reviews.reduce(
    (acc: number, r: { rating: number }) => acc + r.rating,
    0
  );
  const distribution = {
    five: reviews.filter((r: { rating: number }) => r.rating === 5).length,
    four: reviews.filter((r: { rating: number }) => r.rating === 4).length,
    three: reviews.filter((r: { rating: number }) => r.rating === 3).length,
    two: reviews.filter((r: { rating: number }) => r.rating === 2).length,
    one: reviews.filter((r: { rating: number }) => r.rating === 1).length,
  };

  return {
    averageRating: Math.round((sum / total) * 10) / 10,
    totalReviews: total,
    distribution,
  };
}

