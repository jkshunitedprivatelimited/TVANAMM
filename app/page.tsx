import { HeroSection } from '@/components/sections/HeroSection';
import { StatsBar } from '@/components/sections/StatsBar';
import { WhySection } from '@/components/sections/WhySection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ProductsShowcaseSection } from '@/components/sections/ProductsShowcaseSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { BrochureDownloadSection } from '@/components/sections/BrochureDownloadSection';
import { IndiaPresenceSection } from '@/components/sections/IndiaPresenceSection';
import { FranchiseEnquiryFormSection } from '@/components/sections/FranchiseEnquiryFormSection';
import { getHomePage } from '@/lib/sanity/queries';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage();
  return {
    title: data?.metaTitle || 'T Vanamm — Tea & Coffee Franchise India | 250+ Outlets',
    description: data?.metaDescription || 'Join T Vanamm, India\'s fastest growing tea and coffee franchise with 250+ outlets.',
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
      <ProductsShowcaseSection categories={data?.productCategories} />
      <HowItWorksSection steps={data?.howItWorksSteps} />
      <TestimonialsSection testimonials={data?.testimonials} />
      <BrochureDownloadSection />
      <IndiaPresenceSection 
        headline={data?.indiaPresence?.headline}
        subtitle={data?.indiaPresence?.subtitle}
        outletsCount={data?.indiaPresence?.outletsCount}
        statesCount={data?.indiaPresence?.statesCount}
      />
      <FranchiseEnquiryFormSection 
        headline={data?.franchiseEnquiry?.headline}
        subtitle={data?.franchiseEnquiry?.subtitle}
        benefits={data?.franchiseEnquiry?.benefits}
        trustBadges={data?.franchiseEnquiry?.trustBadges}
      />
    </>
  );
}
