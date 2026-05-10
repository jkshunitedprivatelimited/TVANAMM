export const product = {
  name: 'product',
  title: 'Products',
  type: 'document',
  groups: [
    { name: 'basic', title: '1. Basic Info' },
    { name: 'pricing', title: '2. Pricing & Stock' },
    { name: 'media', title: '3. Images' },
    { name: 'seo', title: '4. SEO' },
  ],
  fields: [
    // ── Basic Info ──────────────────────────────────────────────
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'basic',
      description: 'e.g. "T VANAMM Premium Assam CTC Tea — 250g"',
      validation: (Rule: any) => Rule.required().max(100).warning('Keep names under 100 characters for better mobile display'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 120,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      rows: 2,
      description: 'Shown on product cards in the store grid (max 150 chars recommended)',
      validation: (Rule: any) => Rule.max(150).warning('Longer descriptions may truncate or break the layout on product cards.'),
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'array',
      group: 'basic',
      of: [{ type: 'block' }],
      description: 'Rich text description shown on the product detail page',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'productCategory' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'weight',
      title: 'Weight / Size',
      type: 'string',
      group: 'basic',
      description: 'e.g. "250g", "500g", "1kg", "Pack of 10"',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g. "bestseller", "new", "limited-edition"',
    },
    // ── Pricing & Stock ────────────────────────────────────────
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      group: 'pricing',
      description: 'Unique stock keeping unit code (e.g. "TV-TEA-ASM-250")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'MRP (₹)',
      type: 'number',
      group: 'pricing',
      description: 'Maximum retail price in rupees (GST inclusive)',
      validation: (Rule: any) => Rule.required().min(1).error('Price must be at least ₹1'),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (₹)',
      type: 'number',
      group: 'pricing',
      description: 'Discounted price (leave empty if no sale). Must be less than MRP.',
      validation: (Rule: any) =>
        Rule.custom((salePrice: number, context: any) => {
          if (typeof salePrice === 'undefined') return true;
          if (salePrice < 0) return 'Sale price cannot be negative';
          if (context.document?.price && salePrice >= context.document.price) {
            return 'Sale price must be strictly less than MRP';
          }
          return true;
        }),
    },
    {
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      group: 'pricing',
      description: 'Toggle off to mark product as out of stock',
      initialValue: true,
    },
    {
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      group: 'pricing',
      description: 'Available quantity. Set to 0 to auto-mark as out of stock.',
      initialValue: 100,
      validation: (Rule: any) => 
        Rule.min(0).custom((stockQuantity: number, context: any) => {
          if (context.document?.inStock && stockQuantity === 0) {
            return 'Warning: Product is marked "In Stock" but quantity is 0.';
          }
          return true;
        }).warning(),
    },
    {
      name: 'isFeatured',
      title: 'Featured Product?',
      type: 'boolean',
      group: 'pricing',
      description: 'Featured products may appear on the homepage or store banner',
      initialValue: false,
    },
    // ── Images ──────────────────────────────────────────────────
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: 'First image is the hero/thumbnail. Add multiple for gallery view.',
      validation: (Rule: { required: () => { min: (n: number) => unknown } }) =>
        Rule.required().min(1),
    },
    // ── SEO ─────────────────────────────────────────────────────
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Override the default page title for search engines',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Meta description for search engines (max 160 chars)',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'images.0',
    },
  },
  orderings: [
    {
      title: 'Name A→Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Price Low→High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price High→Low',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
};
