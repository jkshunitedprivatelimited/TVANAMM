'use client';

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
  const isMarketing = pathname?.startsWith('/marketingdashboard') || pathname?.startsWith('/marketinglogin');

  if (isStudio || isMarketing) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsappFloat phone={settings?.whatsappNumber} />
      <CookieConsent />
      <FranchisePopup />
    </>
  );
}
