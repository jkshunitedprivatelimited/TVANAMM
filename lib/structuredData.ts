import { getSiteSettings } from '@/lib/sanity/queries';

/**
 * Generates all JSON-LD structured data for the site.
 * Includes: Organization, LocalBusiness, WebSite, and AggregateRating.
 */
export async function generateStructuredData() {
  const settings = await getSiteSettings();

  const siteUrl = 'https://tvanamm.com';
  const logoUrl = `${siteUrl}/images/logo_gif.gif`;
  const email = settings?.email || 'tvanamm@gmail.com';
  const phone = settings?.whatsappNumber
    ? `+${settings.whatsappNumber}`
    : '+919390658544';
  const address =
    settings?.address ||
    'Floor #4, Flat No. #406, Alluri Trade Center, Near KPHB Metro (Pillar #761), Hyderabad, Telangana - 500072';

  // ── Organization Schema ───────────────────────────────────────
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'T VANAMM',
    alternateName: 'T Vanamm - A Taste of Purity',
    url: siteUrl,
    logo: logoUrl,
    description:
      "India's fastest growing premium tea and coffee franchise with 250+ outlets across India.",
    email: email,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Floor #4, Flat No. #406, Alluri Trade Center, Near KPHB Metro (Pillar #761)',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500072',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://instagram.com/tvanammofficial',
    ],
    foundingDate: '2023',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 50,
    },
  };

  // ── LocalBusiness / FoodEstablishment Schema ──────────────────
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${siteUrl}/#business`,
    name: 'T VANAMM',
    image: logoUrl,
    url: siteUrl,
    telephone: phone,
    email: email,
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Floor #4, Flat No. #406, Alluri Trade Center, Near KPHB Metro (Pillar #761)',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500072',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4947,
      longitude: 78.3996,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '10:00',
      closes: '18:00',
    },
    servesCuisine: ['Tea', 'Coffee', 'Beverages', 'Indian Snacks'],
    priceRange: '₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1200',
      reviewCount: '1200',
    },
    hasMenu: `${siteUrl}/#products`,
  };

  // ── WebSite Schema ────────────────────────────────────────────
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'T VANAMM',
    alternateName: 'T Vanamm Tea Franchise',
    url: siteUrl,
    description:
      settings?.defaultSeoDescription ||
      "India's fastest growing premium tea and coffee franchise with 250+ outlets.",
    publisher: {
      '@type': 'Organization',
      name: 'T VANAMM',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
  };

  return { organization, localBusiness, webSite };
}
