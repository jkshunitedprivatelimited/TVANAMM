import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteLayoutWrapper } from "@/components/layout/SiteLayoutWrapper";
import { Analytics } from "@/components/layout/Analytics";
import { getSiteSettings } from "@/lib/sanity/queries";
import { generateStructuredData } from "@/lib/structuredData";
import { SiteSettingsData } from '@/components/layout/Footer';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL('https://tvanamm.com'),
    title: {
      default: settings?.defaultSeoTitle || "T VANAMM | India's best Premium Tea Franchise",
      template: "%s | T VANAMM",
    },
    description: settings?.defaultSeoDescription || settings?.tagline || "Join 250+ successful T VANAMM franchise owners across India. Premium tea and coffee franchise with full training, support and proven business model. Apply today.",
    keywords: settings?.seoKeywords || ["tea franchise", "T VANAMM", "coffee franchise", "india franchise"],
    openGraph: {
      images: settings?.defaultOgImage ? [settings.defaultOgImage] : [
        {
          url: '/images/logo.png',
          width: 800,
          height: 600,
          alt: 'T VANAMM - India\'s Best Premium Tea Franchise',
        }
      ],
      type: 'website',
      siteName: 'T VANAMM',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.defaultSeoTitle || "T VANAMM | India's best Premium Tea Franchise",
      description: settings?.defaultSeoDescription || "Join 250+ successful T VANAMM franchise owners across India.",
      images: settings?.defaultOgImage ? [settings.defaultOgImage] : ['/images/logo.png'],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const jsonLd = await generateStructuredData();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col`}>
          {/* Skip to main content — Accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#006437] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:font-semibold">
            Skip to main content
          </a>
          {/* JSON-LD Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.localBusiness) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.webSite) }}
          />
          <SiteLayoutWrapper settings={settings as SiteSettingsData}>
            {children}
          </SiteLayoutWrapper>
          <Analytics />
      </body>
    </html>
  );
}
