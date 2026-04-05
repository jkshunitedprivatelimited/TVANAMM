import Link from 'next/link';
import { client } from '@/lib/sanity/client';
import { BlogGrid } from '@/components/sections/BlogGrid';

export const revalidate = 60; // optionally cache for 60 seconds

async function getPosts() {
  return await client.fetch(`
    *[_type == "blogPost"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      category,
      excerpt,
      _createdAt,
      "coverImageUrl": coverImage.asset->url
    }
  `);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="bg-[#006437] py-20 text-center">
        <div className="container mx-auto px-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4">Insights & Updates</h1>
          <p className="text-white/80 text-lg mb-4">Franchise tips, tea culture, and business growth</p>
          <div className="text-white/80 text-sm font-medium tracking-widest uppercase">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">&gt;</span> Blog
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
