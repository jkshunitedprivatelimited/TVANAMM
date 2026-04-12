export const aboutPage = {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'story', title: '1. Brand Story & Founder' },
    { name: 'values', title: '2. Mission & Values' },
    { name: 'milestones', title: '3. Journey Milestones' },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    {
      name: 'brandStoryText',
      title: 'Brand Story Text',
      type: 'text',
      group: 'story',
    },
    {
      name: 'founderImage',
      title: 'Founder Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a photo of the founder for the About page.',
      group: 'story',
    },
    {
      name: 'founderQuote',
      title: 'Founder Quote',
      type: 'text',
      group: 'story',
    },
    {
      name: 'mission',
      title: 'Mission',
      type: 'text',
      group: 'values',
    },
    {
      name: 'vision',
      title: 'Vision',
      type: 'text',
      group: 'values',
    },
    {
      name: 'values',
      title: 'Core Values',
      type: 'array',
      group: 'values',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon Name (e.g. ShieldCheck)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
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
      name: 'milestones',
      title: 'Milestones',
      type: 'array',
      group: 'milestones',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description / Event Details', type: 'string' },
          ],
          preview: {
            select: {
              title: 'year',
              subtitle: 'title',
            },
          },
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
        title: 'About Page Content',
      };
    },
  },
};
