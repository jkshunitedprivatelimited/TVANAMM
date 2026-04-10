export const aboutPage = {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'brandStoryText',
      title: 'Brand Story Text',
      type: 'text',
    },
    {
      name: 'founderImage',
      title: 'Founder Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a photo of the founder for the About page.',
    },
    {
      name: 'founderQuote',
      title: 'Founder Quote',
      type: 'text',
    },
    {
      name: 'mission',
      title: 'Mission',
      type: 'text',
    },
    {
      name: 'vision',
      title: 'Vision',
      type: 'text',
    },
    {
      name: 'values',
      title: 'Core Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon (string)', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'milestones',
      title: 'Milestones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
          ],
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
