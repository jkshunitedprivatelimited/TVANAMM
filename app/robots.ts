import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/', '/admin/', '/cart/', '/checkout/', '/account/', '/order-success/'],
    },
    sitemap: 'https://tvanamm.com/sitemap.xml',
  };
}
