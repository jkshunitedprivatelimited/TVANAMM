import { HeroSection } from '@/components/sections/HeroSection';
import { StatsBar } from '@/components/sections/StatsBar';
import dynamic from 'next/dynamic';

const WhySection = dynamic(() => import('@/components/sections/WhySection').then(mod => mod.WhySection), { ssr: true });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection').then(mod => mod.HowItWorksSection), { ssr: true });
const ProductsShowcaseSection = dynamic(() => import('@/components/sections/ProductsShowcaseSection').then(mod => mod.ProductsShowcaseSection), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection').then(mod => mod.TestimonialsSection), { ssr: true });
const BrochureDownloadSection = dynamic(() => import('@/components/sections/BrochureDownloadSection').then(mod => mod.BrochureDownloadSection), { ssr: true });
const IndiaPresenceSection = dynamic(() => import('@/components/sections/IndiaPresenceSection').then(mod => mod.IndiaPresenceSection), { ssr: true });
const FranchiseEnquiryFormSection = dynamic(() => import('@/components/sections/FranchiseEnquiryFormSection').then(mod => mod.FranchiseEnquiryFormSection), { ssr: true });
import { getHomePage } from '@/lib/sanity/queries';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage();
  return {
    title: data?.metaTitle || 'T Vanamm — Tea Franchise India | 250+ Outlets',
    description: data?.metaDescription || 'Join T Vanamm, India\'s fastest growing tea franchise with 250+ outlets.',
  };
}

export default async function Home() {
  const data = await getHomePage();

  return (
    <>
      <HeroSection 
        headline={data?.heroHeadline} 
        subtext={data?.heroSubtext} 
      />
      <StatsBar stats={data?.stats} />
      <WhySection cards={data?.whySectionCards} />
      <HowItWorksSection steps={data?.howItWorksSteps} />
      <ProductsShowcaseSection categories={data?.productCategories} />
      <TestimonialsSection />
      <BrochureDownloadSection />
      <IndiaPresenceSection 
        headline="250+ Outlets Across India"
        subtitle={data?.indiaPresence?.subtitle}
      />
      <FranchiseEnquiryFormSection 
        headline={data?.franchiseEnquiry?.headline}
        subtitle={data?.franchiseEnquiry?.subtitle}
        benefits={data?.franchiseEnquiry?.benefits}
      />
    </>
  );
}
