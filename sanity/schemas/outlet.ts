export const outlet = {
  name: 'outlet',
  title: 'Outlets',
  type: 'document',
  groups: [
    { name: 'basic', title: '1. Basic Info' },
    { name: 'location', title: '2. Location & Map' },
    { name: 'links', title: '3. External Links' },
    { name: 'media', title: '4. Media' },
  ],
  fields: [
    {
      name: 'name',
      title: 'Outlet Name',
      type: 'string',
      group: 'basic',
      description: 'e.g. "T VANAMM — Kukatpally"',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'basic',
      description: 'City name for search/filter (e.g. "Hyderabad")',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'state',
      title: 'State',
      type: 'string',
      group: 'basic',
      description: 'State name for filter (e.g. "Telangana")',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'pincode',
      title: 'Pincode',
      type: 'string',
      group: 'basic',
      description: '6-digit pincode for pincode search',
    },
    {
      name: 'fullAddress',
      title: 'Full Address',
      type: 'text',
      group: 'basic',
      rows: 3,
      description: 'Complete street address with landmarks',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'basic',
      description: 'Contact number for this outlet',
    },
    {
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'string',
      group: 'basic',
      description: 'e.g. "8:00 AM – 11:00 PM"',
    },
    // ── Location & Map ──────────────────────────────────────────
    {
      name: 'location',
      title: 'GPS Coordinates',
      type: 'object',
      group: 'location',
      description: 'Required for map pins and nearest-outlet detection. Get coordinates from Google Maps.',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule: { required: () => { min: (n: number) => { max: (n: number) => unknown } } }) =>
            Rule.required().min(-90).max(90),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule: { required: () => { min: (n: number) => { max: (n: number) => unknown } } }) =>
            Rule.required().min(-180).max(180),
        },
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    // ── External Links ──────────────────────────────────────────
    {
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      group: 'links',
      description: 'Direct Google Maps link for "Get Directions"',
    },
    // ── Media ───────────────────────────────────────────────────
    {
      name: 'image',
      title: 'Outlet Photo',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    },
    {
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      group: 'basic',
      description: 'Toggle to show/hide this outlet on the website',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'City A→Z',
      name: 'cityAsc',
      by: [{ field: 'city', direction: 'asc' }],
    },
    {
      title: 'State A→Z',
      name: 'stateAsc',
      by: [{ field: 'state', direction: 'asc' }],
    },
  ],
};
