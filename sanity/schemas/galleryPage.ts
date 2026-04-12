export const galleryPage = {
  name: 'galleryPage',
  title: 'Gallery Page',
  type: 'document',
  groups: [
    { name: 'gallery', title: '1. Gallery Media' },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'categoryTag', title: 'Category Tag', type: 'string', options: { list: ['Outlets', 'Products'] } },
            { name: 'altText', title: 'Alt Text', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'categoryTag',
              media: 'image',
            },
            prepare(selection: any) {
              const { title, subtitle, media } = selection;
              return {
                title: title || 'Untitled Image',
                subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
                media: media,
              };
            },
          },
        },
      ],
    },
    {
      name: 'videos',
      title: 'Gallery Videos',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'youtubeUrl', title: 'YouTube Embed URL', type: 'url' },
            { name: 'title', title: 'Video Title', type: 'string' },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'youtubeUrl',
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
        title: 'Gallery Page Content',
      };
    },
  },
};
