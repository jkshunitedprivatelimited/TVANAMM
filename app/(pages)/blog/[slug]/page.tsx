import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity/client';
import { PortableText } from '@portabletext/react';

export const revalidate = 60;

async function getPost(slug: string) {
  return await client.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      category,
      _createdAt,
      "coverImageUrl": coverImage.asset->url,
      content
    }
  `, { slug });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-4">Post completely not found</h1>
        <Link href="/blog" className="text-[#006437] underline">Return to all insights</Link>
      </div>
    );
  }

  const formattedDate = new Date(post._createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <section className="bg-[#006437] pt-28 pb-10 text-center px-4">
         <div className="container mx-auto">
          <div className="text-white/80 text-sm font-medium tracking-widest uppercase mb-6">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">&gt;</span> <Link href="/blog" className="hover:text-white">Blog</Link> <span className="mx-2">&gt;</span> Article
          </div>
         </div>
      </section>
      
      <article className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[#C8A96E] font-bold tracking-widest uppercase text-sm mb-4 block">{post.category || 'Announcement'}</span>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-medium">
              <span>By T Vanamm Team</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {post.coverImageUrl ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-16">
              <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full h-8 flex items-center justify-center mb-10" />
          )}

          <div className="flex flex-col md:flex-row gap-12 relative justify-center">
            {/* Main Content */}
            <div className="prose prose-lg prose-[#006437] max-w-none flex-grow text-gray-700 leading-relaxed md:w-3/4">
              {post.content ? (
                <PortableText 
                   value={post.content} 
                   components={{
                     block: {
                       h2: ({children}) => <h2 className="font-playfair text-3xl font-bold text-gray-900 mt-12 mb-6">{children}</h2>,
                       h3: ({children}) => <h3 className="font-playfair text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h3>,
                       blockquote: ({children}) => <blockquote className="my-10 bg-[#006437]/5 p-8 border-l-4 border-[#006437] rounded-r-2xl italic font-medium text-gray-900 text-xl">{children}</blockquote>
                     }
                   }}
                />
              ) : (
                <p>No text content added to this post.</p>
              )}

              {/* Inline CTA */}
              <div className="my-16 bg-[#006437] rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden text-white not-prose">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-3xl font-playfair font-bold text-white mb-4 relative z-10 text-transparent bg-clip-text mt-0">Interested in owning a T Vanamm franchise?</h3>
                <p className="text-white/80 mb-8 relative z-10 text-lg">Join 250+ successful owners across India today.</p>
                <Link href="/contact" className="relative z-10 inline-block bg-[#C8A96E] hover:bg-[#b0935d] text-white px-8 py-4 rounded-lg font-bold shadow-lg transition-all text-lg tracking-wide">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
