'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  _id: string;
  slug: { current: string };
  title: string;
  category: string;
  excerpt: string;
  _createdAt: string;
  coverImageUrl?: string;
}

export function BlogGrid({ posts }: { posts: Post[] }) {
  const featured = posts[0];
  const gridPosts = posts.slice(1);

  if (!featured) {
    return <div className="text-center py-32 text-gray-400 font-medium text-xl">More articles coming soon.</div>;
  }

  return (
    <>
      {/* Featured Post - Ultra Premium Layout */}
      <div className="mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl hover:shadow-3xl transition-shadow duration-700 bg-white border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Image Section */}
            <div className="relative w-full lg:w-[50%] lg:min-h-[350px] overflow-hidden bg-[#004e2a]">
              {featured.coverImageUrl ? (
                <Image 
                  src={featured.coverImageUrl} 
                  alt={featured.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96E]/40 font-playfair italic text-3xl p-6 text-center bg-gradient-to-br from-[#006437] to-[#00381f]">
                  T Vanamm Insights
                </div>
              )}
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30 pointer-events-none" />
            </div>

            {/* Content Section */}
            <div className="relative w-full lg:w-[40%] p-10 lg:p-16 flex flex-col justify-center bg-white z-10">
              <div className="flex gap-4 items-center mb-8">
                <span className="text-[#006437] bg-[#006437]/5 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold shadow-sm border border-[#006437]/10">
                  {featured.category || 'Featured'}
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight group-hover:text-[#006437] transition-colors duration-500">
                <Link href={`/blog/${featured.slug.current}`} className="before:absolute before:inset-0">
                  {featured.title}
                </Link>
              </h2>
              
              <p className="text-gray-500 mb-10 text-lg leading-relaxed line-clamp-4 font-normal">
                {featured.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-sm text-gray-400 font-semibold tracking-wide border-t border-gray-100 pt-8">
                <span>{new Date(featured._createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-2 group-hover:text-[#C8A96E] transition-colors">
                  Read Article <span className="text-lg leading-none">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {gridPosts.map((post, i) => (
          <motion.article 
            key={post._id} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: (i % 3) * 0.1, duration: 0.6 }} 
            viewport={{ once: true, margin: "-100px" }} 
            className="group flex flex-col h-full"
          >
            <Link href={`/blog/${post.slug.current}`} className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-8 block bg-[#004e2a] shadow-lg group-hover:shadow-2xl transition-all duration-500">
              {post.coverImageUrl ? (
                <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96E]/30 font-playfair italic p-4 text-center">
                  Inside T Vanamm
                </div>
              )}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </Link>
            
            <div className="flex flex-col flex-grow px-2">
              <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                {post.category || 'Update'}
              </span>
              
              <Link href={`/blog/${post.slug.current}`}>
                <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#006437] transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
              </Link>
              
              <p className="text-gray-500 text-base mb-8 flex-grow line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-400 font-bold tracking-wider pt-6 border-t border-gray-100 w-full mt-auto">
                <span className="uppercase">{new Date(post._createdAt).toLocaleDateString()}</span>
                <span className="text-[#006437] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read More &rarr;
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}
