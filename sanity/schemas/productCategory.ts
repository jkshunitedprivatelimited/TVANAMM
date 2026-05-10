export const productCategory = {
  name: 'productCategory',
  title: 'Product Categories',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'e.g. "Premium Teas", "Coffees", "Snacks"',
      validation: (Rule: any) => Rule.required().max(50).warning('Keep category names short (under 50 characters)'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown on the store page (max 200 chars recommended)',
      validation: (Rule: any) => Rule.max(200).warning('Longer descriptions might push down the content on category pages.'),
    },
    {
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image shown on the category card in the store',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = appears first. Used to sort categories on the store page.',
      initialValue: 0,
    },
    {
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      description: 'Toggle to show/hide this category on the store',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A→Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
};
