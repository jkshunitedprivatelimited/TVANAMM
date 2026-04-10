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
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-[#006437] via-[#005530] to-[#004025] pt-[100px] pb-4 overflow-hidden text-center">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-[0.2em] uppercase">
            The Journal
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96E] to-[#E5CC98]">Updates</span>
          </h1>
          
          <p className="text-white/80 text-base md:text-lg font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
            Explore industry trends, tea culture, and T Vanamm stories.
          </p>
          
          <div className="flex items-center justify-center gap-3 text-white/60 text-sm font-semibold tracking-widest uppercase">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> 
            <span className="w-1 h-1 rounded-full bg-[#C8A96E]"></span> 
            <span className="text-white">Blog</span>
          </div>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="relative py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
