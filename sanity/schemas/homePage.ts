export const homePage = {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    },
    {
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
    },
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'whySectionCards',
      title: 'Why Choose Us Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon (lucide name or svg)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'productCategories',
      title: 'Product Categories',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'isVideo', title: 'Is Video Testimonial?', type: 'boolean' },
            { name: 'youtubeUrl', title: 'YouTube Embed URL', type: 'url', hidden: ({parent}: {parent: {isVideo?: boolean}}) => !parent?.isVideo },
            { name: 'quote', title: 'Quote', type: 'text', hidden: ({parent}: {parent: {isVideo?: boolean}}) => parent?.isVideo },
            { name: 'ownerName', title: 'Owner Name', type: 'string' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'outletName', title: 'Outlet Name', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'galleryTeaserImages',
      title: 'Gallery Teaser Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'howItWorksSteps',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', title: 'Step Number (e.g. 01)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { 
              name: 'icon', 
              title: 'Icon Name (Lucide)', 
              type: 'string', 
              description: 'Names like: FileText, PhoneCall, Rocket' 
            },
          ],
        },
      ],
    },
    {
      name: 'indiaPresence',
      title: 'India Presence Section',
      type: 'object',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'outletsCount', title: 'Total Outlets Count (Number)', type: 'string' },
        { name: 'statesCount', title: 'Total States Count (Number)', type: 'string' },
      ],
    },
    {
      name: 'franchiseEnquiry',
      title: 'Franchise Enquiry Section',
      type: 'object',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { 
          name: 'benefits', 
          title: 'Benefits List', 
          type: 'array', 
          of: [{ type: 'string' }] 
        },
      ],
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
    },
  ],
};
