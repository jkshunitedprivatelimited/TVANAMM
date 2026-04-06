import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteLayoutWrapper } from "@/components/layout/SiteLayoutWrapper";
import { Analytics } from "@/components/layout/Analytics";
import { getSiteSettings } from "@/lib/sanity/queries";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.defaultSeoTitle || "T Vanamm — India's Premium Tea & Coffee Franchise",
      template: "%s | T Vanamm",
    },
    description: settings?.defaultSeoDescription || settings?.tagline || "Join 250+ successful T Vanamm franchise owners across India. Premium tea and coffee franchise with full training, support and proven business model. Apply today.",
    keywords: settings?.seoKeywords || ["tea franchise", "t vanamm", "coffee franchise", "india franchise"],
    openGraph: {
      images: settings?.defaultOgImage ? [settings.defaultOgImage] : [],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col`}>
          <SiteLayoutWrapper settings={settings as any}>
            {children}
          </SiteLayoutWrapper>
          <Analytics />
      </body>
    </html>
  );
}
