import { client } from './client';

export async function getSiteSettings() {
  return await client.fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { next: { tags: ['siteSettings'] } }
  );
}

export async function getHomePage() {
  return await client.fetch(
    `*[_type == "homePage"][0]`,
    {},
    { next: { tags: ['homePage'] } }
  );
}

export async function getAboutPage() {
  return await client.fetch(
    `*[_type == "aboutPage"][0]`,
    {},
    { next: { tags: ['aboutPage'] } }
  );
}

export async function getGalleryPage() {
  return await client.fetch(
    `*[_type == "galleryPage"][0]`,
    {},
    { next: { tags: ['galleryPage'] } }
  );
}

export async function getBlogPosts() {
  return await client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc)`,
    {},
    { next: { tags: ['blogPosts'] } }
  );
}

export async function getBlogPostBySlug(slug: string) {
  return await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]`,
    { slug },
    { next: { tags: ['blogPost'] } }
  );
}

export async function getContactPage() {
  return await client.fetch(
    `*[_type == "contactPage"][0]`,
    {},
    { next: { tags: ['contactPage'] } }
  );
}
