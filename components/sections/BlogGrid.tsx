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
    return <div className="text-center py-20 text-gray-500 font-medium">More articles coming soon.</div>;
  }

  return (
    <>
      {/* Featured Post */}
      <div className="mb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2 group hover:shadow-2xl transition-all border border-gray-100">
          <div className="relative aspect-video md:aspect-auto h-full overflow-hidden bg-[#004e2a]">
            {featured.coverImageUrl ? (
              <Image src={featured.coverImageUrl} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96E]/50 font-playfair italic text-2xl p-6 text-center">
                T Vanamm Insights
              </div>
            )}
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex gap-4 items-center mb-6 text-sm font-semibold">
              <span className="text-[#006437] bg-[#006437]/10 px-3 py-1 rounded-full uppercase tracking-wider text-xs">{featured.category || 'News'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-6 group-hover:text-[#C8A96E] transition-colors leading-tight">
              <Link href={`/blog/${featured.slug.current}`}>{featured.title}</Link>
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed line-clamp-3">
              {featured.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between text-sm text-gray-500 font-medium">
              <span>{new Date(featured._createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>5 min read</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridPosts.map((post, i) => (
          <motion.article key={post._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: (i % 3) * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col">
            <Link href={`/blog/${post.slug.current}`} className="relative aspect-[4/3] overflow-hidden block bg-[#004e2a]">
              {post.coverImageUrl ? (
                <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96E]/30 font-playfair italic p-4 text-center">
                  Inside T Vanamm
                </div>
              )}
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-wider mb-3 block">{post.category || 'Update'}</span>
              <Link href={`/blog/${post.slug.current}`}>
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3 group-hover:text-[#006437] transition-colors line-clamp-2">{post.title}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{post.excerpt}</p>
              <div className="flex justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 w-full mt-auto">
                <span>{new Date(post._createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}
