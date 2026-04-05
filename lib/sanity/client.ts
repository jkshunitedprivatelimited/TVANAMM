import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // if you're using ISR or SSR, you might want to consider the caching strategy
  apiVersion: '2024-04-04',
  token: process.env.SANITY_API_TOKEN,
});
