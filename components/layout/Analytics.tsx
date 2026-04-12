'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import clarity from '@microsoft/clarity';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export function Analytics() {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (clarityId) {
      clarity.init(clarityId);
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager (Global Site Tag) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <VercelAnalytics />
    </>
  );
}
