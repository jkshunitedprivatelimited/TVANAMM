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
      <section className="relative bg-[#006437] pt-40 pb-28 overflow-hidden text-center">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C8A96E]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-[0.2em] uppercase">
            The Journal
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 tracking-tight leading-tight">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96E] to-[#E5CC98]">Updates</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover the latest trends in franchise growth, the rich culture of tea, and stories from the T Vanamm family.
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
