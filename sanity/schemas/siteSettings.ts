export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'branding', title: '1. Branding & Identity' },
    { name: 'contact', title: '2. Contact Information' },
    { name: 'social', title: '3. Social Media' },
    { name: 'seo', title: 'SEO & Defaults' },
  ],
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'branding',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'branding',
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'telecallerNumbers',
      title: 'Telecaller Numbers',
      type: 'array',
      group: 'contact',
      of: [{ type: 'string' }],
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      group: 'contact',
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'instagramHandles',
      title: 'Instagram Handles',
      type: 'array',
      group: 'social',
      of: [{ type: 'string' }],
    },
    {
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
      group: 'seo',
    },
    {
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Used as the main title tag (e.g. T Vanamm | Franchise Enquiry)',
    },
    {
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      group: 'seo',
      description: 'Global meta description for search engines',
    },
    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      description: 'Global keywords separated by enter (e.g. tea cafe, franchise)',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings & SEO',
      };
    },
  },
};
