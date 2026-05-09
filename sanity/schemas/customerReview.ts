export const customerReview = {
  name: 'customerReview',
  title: 'Customer Reviews',
  type: 'document',
  groups: [
    { name: 'review', title: 'Review Content' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      group: 'review',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'review',
      description: 'City of the reviewer',
    },
    {
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      group: 'review',
      validation: (Rule: { required: () => { min: (n: number) => { max: (n: number) => unknown } } }) =>
        Rule.required().min(1).max(5),
      description: 'Star rating from 1 to 5',
    },
    {
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      group: 'review',
      rows: 4,
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },

    {
      name: 'outletRef',
      title: 'Outlet',
      type: 'reference',
      to: [{ type: 'outlet' }],
      group: 'meta',
      description: 'Which outlet this review is about (optional)',
    },
    {
      name: 'date',
      title: 'Review Date',
      type: 'date',
      group: 'meta',
    },
    {
      name: 'avatar',
      title: 'Reviewer Photo',
      type: 'image',
      group: 'review',
      options: { hotspot: true },
      description: 'Optional reviewer avatar/photo',
    },
    {
      name: 'isVerified',
      title: 'Verified Review?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Show a verified badge on this review',
    },
    {
      name: 'isFeatured',
      title: 'Featured on Homepage?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Pin this review to the homepage reviews section',
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'reviewText',
      rating: 'rating',
      media: 'avatar',
    },
    prepare(selection: Record<string, unknown>) {
      const title = (selection.title as string) || '';
      const subtitle = (selection.subtitle as string) || '';
      const rating = (selection.rating as number) || 0;
      return {
        title: `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} ${title}`,
        subtitle: subtitle.substring(0, 80) + (subtitle.length > 80 ? '…' : ''),
      };
    },
  },
  orderings: [
    {
      title: 'Rating High→Low',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Date New→Old',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
};
