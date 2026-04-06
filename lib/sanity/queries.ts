import { client } from './client';

export async function getSiteSettings() {
  return await client.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getHomePage() {
  return await client.fetch(`*[_type == "homePage"][0]`, {}, { next: { revalidate: 10 } });
}

export async function getAboutPage() {
  return await client.fetch(`*[_type == "aboutPage"][0]`, {}, { next: { revalidate: 10 } });
}

export async function getGalleryPage() {
  return await client.fetch(`*[_type == "galleryPage"][0]`, {}, { next: { revalidate: 10 } });
}

export async function getBlogPosts() {
  return await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc)`, {}, { next: { revalidate: 10 } });
}

export async function getBlogPostBySlug(slug: string) {
  return await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug }, { next: { revalidate: 10 } });
}

export async function getContactPage() {
  return await client.fetch(`*[_type == "contactPage"][0]`, {}, { next: { revalidate: 10 } });
}
