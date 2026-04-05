export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
    },
    {
      name: 'telecallerNumbers',
      title: 'Telecaller Numbers',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'string',
    },
    {
      name: 'instagramHandles',
      title: 'Instagram Handles',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
    },
    {
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      description: 'Used as the main title tag (e.g. T Vanamm | Franchise Enquiry)',
    },
    {
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      description: 'Global meta description for search engines',
    },
    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Global keywords separated by enter (e.g. tea cafe, franchise)',
    },
  ],
};
