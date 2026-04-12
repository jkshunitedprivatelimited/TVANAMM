export const contactPage = {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'content', title: '1. Form Text & Settings' },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    {
      name: 'formLabels',
      title: 'Form Labels',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'franchiseFormTitle', title: 'Franchise Form Title', type: 'string' },
        { name: 'generalFormTitle', title: 'General Form Title', type: 'string' },
      ],
    },
    {
      name: 'successMessages',
      title: 'Success Messages',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'franchiseSuccess', title: 'Franchise Success Message', type: 'string' },
        { name: 'generalSuccess', title: 'General Success Message', type: 'string' },
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
        title: 'Contact Page Content',
      };
    },
  },
};
