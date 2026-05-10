import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client';

async function getBlogSlugs(): Promise<string[]> {
  try {
    const slugs: { slug: string }[] = await client.fetch(
      `*[_type == "blogPost"]{ "slug": slug.current }`
    );
    return slugs.map((s) => s.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function getProductSlugs(): Promise<string[]> {
  try {
    const slugs: { slug: string }[] = await client.fetch(
      `*[_type == "product" && inStock == true]{ "slug": slug.current }`
    );
    return slugs.map((s) => s.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tvanamm.com';
  const blogSlugs = await getBlogSlugs();
  const productSlugs = await getProductSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/store/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...productPages];
}
