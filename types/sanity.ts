export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Stat {
  value: string;
  label: string;
}

export interface WhyCard {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  isVideo: boolean;
  youtubeUrl?: string;
  quote?: string;
  ownerName: string;
  city: string;
  outletName: string;
}

export interface HomePageData {
  heroHeadline?: string;
  heroSubtext?: string;
  stats?: Stat[];
  whySectionCards?: WhyCard[];
  productCategories?: string[];
  testimonials?: Testimonial[];
  galleryTeaserImages?: SanityImage[];
  metaTitle?: string;
  metaDescription?: string;
}
