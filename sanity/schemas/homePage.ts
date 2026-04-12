export const homePage = {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Section' },
    { name: 'stats', title: '2. Statistics (250+ Outlets)' },
    { name: 'content', title: '3. Main Features & Menu' },
    { name: 'conversion', title: '4. Lead Generation' },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroSubtext',
      title: 'Hero Subtext',
      type: 'text',
      group: 'hero',
    },
    {
      name: 'stats',
      title: 'Stats & Numbers Counter',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value (e.g. 250+)', type: 'string' },
            { name: 'label', title: 'Label (e.g. Outlets)', type: 'string' },
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label',
            },
          },
        },
      ],
    },
    {
      name: 'whySectionCards',
      title: 'Why Choose Us (Cards)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon (lucide name or svg)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
    },
    {
      name: 'productCategories',
      title: 'Product Categories (Our Menu)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Category Name', type: 'string' },
            { name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'image',
            },
          },
        },
      ],
    },
    {
      name: 'howItWorksSteps',
      title: 'How It Works Steps',
      type: 'array',
      group: 'content',
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
              description: 'Names like: MessageSquare, ClipboardCheck, Users, Settings, Rocket' 
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'content',
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
          preview: {
            select: {
              title: 'ownerName',
              subtitle: 'city',
            },
          },
        },
      ],
    },
    {
      name: 'galleryTeaserImages',
      title: 'Gallery Teaser Images',
      type: 'array',
      group: 'content',
      of: [
        { 
          type: 'image', 
          options: { hotspot: true } 
        }
      ],
    },
    {
      name: 'indiaPresence',
      title: 'India Presence Section',
      type: 'object',
      group: 'conversion',
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
      group: 'conversion',
      fields: [
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { 
          name: 'benefits', 
          title: 'Benefits List', 
          type: 'array', 
          of: [{ type: 'string' }] 
        },
        {
          name: 'trustBadges',
          title: 'Trust & Compliance Badges',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Badge Name (e.g. MSME Registered)', type: 'string' },
                { name: 'logo', title: 'Logo Image', type: 'image', options: { hotspot: true } },
              ],
              preview: {
                select: {
                  title: 'name',
                  media: 'logo',
                },
              },
            }
          ]
        },
      ],
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Content',
      };
    },
  },
};
