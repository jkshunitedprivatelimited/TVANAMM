import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client';

async function getBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const posts: { slug: string; updatedAt: string }[] = await client.fetch(
      `*[_type == "blogPost"]{ "slug": slug.current, "updatedAt": coalesce(_updatedAt, _createdAt) }`
    );
    return posts.filter((s) => s.slug);
  } catch {
    return [];
  }
}

async function getProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const products: { slug: string; updatedAt: string }[] = await client.fetch(
      `*[_type == "product" && inStock == true]{ "slug": slug.current, "updatedAt": coalesce(_updatedAt, _createdAt) }`
    );
    return products.filter((s) => s.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tvanamm.com';
  const blogSlugs = await getBlogSlugs();
  const productSlugs = await getProductSlugs();

  // Fixed dates for static pages (update these when you actually edit the page)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2025-05-16'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date('2025-05-10'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date('2025-05-10'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2025-05-10'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = productSlugs.map((product) => ({
    url: `${baseUrl}/store/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}
