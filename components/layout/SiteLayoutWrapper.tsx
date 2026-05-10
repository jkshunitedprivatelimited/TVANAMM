'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloat } from "@/components/ui/WhatsappFloat";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { FranchisePopup } from "@/components/modals/FranchisePopup";
import { SiteSettingsData } from '@/components/layout/Footer';

export function SiteLayoutWrapper({ 
  children, 
  settings 
}: { 
  children: React.ReactNode;
  settings?: SiteSettingsData;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');
  
  // E-commerce routes where we want a clean, distraction-free layout
  // (Using the dedicated StoreHeader and store footer instead)
  const isStoreRoute = pathname?.startsWith('/store') || 
                       pathname?.startsWith('/cart') || 
                       pathname?.startsWith('/checkout') || 
                       pathname?.startsWith('/account') || 
                       pathname?.startsWith('/order-success') ||
                       pathname?.startsWith('/admin');


  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top on full page reload and navigation
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    };

    // Immediate attempt
    scrollToTop();

    // Fallback attempt after a frame to catch any browser-initiated scrolls
    const timeoutId = setTimeout(scrollToTop, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (isStudio) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {!isStoreRoute && <Navbar />}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      {!isStoreRoute && (
        <>
          <Footer settings={settings} />
          <WhatsappFloat phone={settings?.whatsappNumber} />
          <CookieConsent />
          <FranchisePopup />
        </>
      )}
    </>
  );
}
