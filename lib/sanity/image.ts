import createImageUrlBuilder from '@sanity/image-url';

import { client } from './client';

const builder = createImageUrlBuilder(client);

export const urlFor = (source: Record<string, unknown> | string) => {
  return builder.image(source as object);
};
