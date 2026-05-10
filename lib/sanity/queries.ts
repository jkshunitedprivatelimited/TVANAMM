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

// ── Product Queries ─────────────────────────────────────────────

export async function getAllProducts() {
  return await client.fetch(
    `*[_type == "product" && inStock == true] | order(_createdAt desc) {
      _id,
      _createdAt,
      name,
      slug,
      shortDescription,
      price,
      salePrice,
      sku,
      weight,
      tags,
      inStock,
      stockQuantity,
      isFeatured,
      "images": images[].asset->url,
      "category": category->{
        _id,
        name,
        slug
      }
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export async function getProductBySlug(slug: string) {
  return await client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      shortDescription,
      description,
      price,
      salePrice,
      sku,
      weight,
      tags,
      inStock,
      stockQuantity,
      isFeatured,
      "images": images[].asset->url,
      "category": category->{
        _id,
        name,
        slug
      },
      seoTitle,
      seoDescription
    }`,
    { slug },
    { next: { revalidate: 30 } }
  );
}

export async function getFeaturedProducts() {
  return await client.fetch(
    `*[_type == "product" && isFeatured == true && inStock == true] | order(_createdAt desc)[0...8] {
      _id,
      name,
      slug,
      shortDescription,
      price,
      salePrice,
      sku,
      weight,
      inStock,
      stockQuantity,
      "images": images[].asset->url,
      "category": category->{
        _id,
        name,
        slug
      }
    }`,
    {},
    { next: { revalidate: 30 } }
  );
}

export async function getProductsByCategory(categorySlug: string) {
  return await client.fetch(
    `*[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(_createdAt desc) {
      _id,
      name,
      slug,
      shortDescription,
      price,
      salePrice,
      sku,
      weight,
      tags,
      inStock,
      stockQuantity,
      "images": images[].asset->url,
      "category": category->{
        _id,
        name,
        slug
      }
    }`,
    { categorySlug },
    { next: { revalidate: 30 } }
  );
}

export async function searchProducts(searchTerm: string) {
  return await client.fetch(
    `*[_type == "product" && inStock == true && (
      name match $searchTerm ||
      shortDescription match $searchTerm ||
      sku match $searchTerm ||
      $searchTerm in tags
    )] | order(_createdAt desc) {
      _id,
      name,
      slug,
      shortDescription,
      price,
      salePrice,
      sku,
      weight,
      inStock,
      stockQuantity,
      "images": images[].asset->url,
      "category": category->{
        _id,
        name,
        slug
      }
    }`,
    { searchTerm: `*${searchTerm}*` },
    { next: { revalidate: 30 } }
  );
}

// ── Product Category Queries ────────────────────────────────────

export async function getAllProductCategories() {
  return await client.fetch(
    `*[_type == "productCategory" && isActive == true] | order(order asc) {
      _id,
      name,
      slug,
      description,
      image,
      order,
      isActive
    }`,
    {},
    { next: { tags: ['productCategories'] } }
  );
}

// ── Store Banner Queries ────────────────────────────────────────

export async function getActiveBanners() {
  return await client.fetch(
    `*[_type == "storeBanner" && isActive == true] | order(order asc) {
      _id,
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      order,
      isActive
    }`,
    {},
    { next: { tags: ['storeBanners'] } }
  );
}

// ── Product by IDs (for cart validation) ────────────────────────

export async function getProductsByIds(ids: string[]) {
  return await client.fetch(
    `*[_type == "product" && _id in $ids] {
      _id,
      name,
      slug,
      price,
      salePrice,
      sku,
      inStock,
      stockQuantity,
      "images": images[0].asset->url
    }`,
    { ids },
    { next: { revalidate: 0 } }
  );
}
