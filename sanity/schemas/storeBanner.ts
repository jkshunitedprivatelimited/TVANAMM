export const storeBanner = {
  name: 'storeBanner',
  title: 'Store Banners',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'Main headline on the banner',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the title',
    },
    {
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Background image for the banner (recommended: 1920×600)',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      description: 'e.g. "Shop Now", "View Collection"',
    },
    {
      name: 'ctaLink',
      title: 'Button Link',
      type: 'string',
      description: 'Internal link path (e.g. "/store" or "/store?category=premium-teas")',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = appears first in the carousel',
      initialValue: 0,
    },
    {
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      description: 'Toggle to show/hide this banner',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
};
