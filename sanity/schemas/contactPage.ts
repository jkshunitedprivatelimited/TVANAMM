export const contactPage = {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    {
      name: 'formLabels',
      title: 'Form Labels',
      type: 'object',
      fields: [
        { name: 'franchiseFormTitle', title: 'Franchise Form Title', type: 'string' },
        { name: 'generalFormTitle', title: 'General Form Title', type: 'string' },
      ],
    },
    {
      name: 'successMessages',
      title: 'Success Messages',
      type: 'object',
      fields: [
        { name: 'franchiseSuccess', title: 'Franchise Success Message', type: 'string' },
        { name: 'generalSuccess', title: 'General Success Message', type: 'string' },
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
