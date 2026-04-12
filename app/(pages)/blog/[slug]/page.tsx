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
      author,
      excerpt,
      _createdAt,
      "coverImageUrl": thumbnail.asset->url,
      body
    }
  `, { slug });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="pt-40 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-playfair font-bold text-gray-400 mb-6">Article not found</h1>
        <Link href="/blog" className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors">
          Return to Journal
        </Link>
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
      <article className="bg-[#fcfaf8] pb-24">
        {/* Compact Hero Section matched to About/Gallery */}
        <header className="relative bg-gradient-to-br from-[#006437] via-[#005530] to-[#004025] pt-[120px] pb-10 text-center overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background.png')] bg-cover bg-center mix-blend-overlay" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A96E] text-xs font-bold tracking-[0.2em] uppercase mb-6">
              {post.category || 'Announcement'}
            </span>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-playfair font-bold text-white max-w-6xl mx-auto leading-tight mb-6 px-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80 font-medium tracking-wide">
              <span>By {post.author || 'T Vanamm Editorial'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* Standard Article Content Area */}
        <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
          <div className="w-full">
            
            {/* Breadcrumb Navigation inside card */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-8 border-b border-gray-100 pb-6">
              <Link href="/" className="hover:text-[#006437] transition-colors">Home</Link> 
              <span className="mx-2">&rarr;</span> 
              <Link href="/blog" className="hover:text-[#006437] transition-colors">Journal</Link>
            </div>

            {/* Post Thumbnail Image inside article */}
            {post.coverImageUrl && (
              <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            {/* Prose Content */}
            <div className="prose prose-lg md:prose-xl prose-[#006437] max-w-none text-gray-600 font-normal leading-relaxed prose-headings:font-playfair prose-headings:font-bold prose-headings:text-gray-900 prose-p:mb-8 prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-lg prose-a:text-[#C8A96E] prose-a:font-semibold hover:prose-a:text-[#006437] transition-colors">
              {post.body ? (
                <PortableText 
                   value={post.body} 
                   components={{
                     block: {
                       h2: ({children}) => <h2 className="text-3xl md:text-4xl mt-16 mb-8 text-gray-900 leading-tight">{children}</h2>,
                       h3: ({children}) => <h3 className="text-2xl md:text-3xl mt-12 mb-6 text-gray-800 leading-tight">{children}</h3>,
                       blockquote: ({children}) => (
                         <blockquote className="my-12 py-8 px-10 bg-[#006437]/5 border-l-4 border-[#C8A96E] rounded-r-3xl italic font-playfair font-medium text-gray-900 text-2xl md:text-3xl leading-snug">
                           {children}
                         </blockquote>
                       )
                     }
                   }}
                />
              ) : (
                <p className="text-center italic text-gray-400 my-20">Full editorial content is currently being written.</p>
              )}
            </div>

          </div>
        </div>

        {/* Global CTA Bridge — Full Width */}
        <section className="py-12 bg-[#C8A96E] mt-12 w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-8">Ready to be part of the T Vanamm family?</h2>
            <Link href="/#franchise-enquiry" className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-colors text-lg">Enquire Now</Link>
          </div>
        </section>
      </article>
    </>
  );
}
