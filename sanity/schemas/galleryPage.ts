export const galleryPage = {
  name: 'galleryPage',
  title: 'Gallery Page',
  type: 'document',
  fields: [
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
            { name: 'categoryTag', title: 'Category Tag', type: 'string', options: { list: ['Outlets', 'Products'] } },
            { name: 'altText', title: 'Alt Text', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'videos',
      title: 'Gallery Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'youtubeUrl', title: 'YouTube Embed URL', type: 'url' },
            { name: 'title', title: 'Video Title', type: 'string' },
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
