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
        {/* Full-width Immersive Hero */}
        <header className="relative w-full h-[60vh] min-h-[500px] flex items-end">
          {post.coverImageUrl ? (
            <Image 
              src={post.coverImageUrl} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#004e2a]" />
          )}
          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          
          <div className="container mx-auto px-4 relative z-10 pb-24 md:pb-32 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C8A96E] text-xs font-bold tracking-[0.2em] uppercase mb-6">
              {post.category || 'Announcement'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white max-w-4xl mx-auto leading-tight mb-8 drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-white/80 font-medium tracking-wide">
              <span>By T Vanamm Editorial</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* Floating Content Area */}
        <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-20 max-w-5xl">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-16 lg:p-20 border border-gray-100">
            
            {/* Breadcrumb Navigation inside card */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 mb-12 border-b border-gray-100 pb-8">
              <Link href="/" className="hover:text-[#006437] transition-colors">Home</Link> 
              <span className="mx-2">&rarr;</span> 
              <Link href="/blog" className="hover:text-[#006437] transition-colors">Journal</Link>
            </div>

            {/* Prose Content */}
            <div className="prose prose-lg md:prose-xl prose-[#006437] max-w-none text-gray-600 font-normal leading-relaxed prose-headings:font-playfair prose-headings:font-bold prose-headings:text-gray-900 prose-p:mb-8 prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-lg prose-a:text-[#C8A96E] prose-a:font-semibold hover:prose-a:text-[#006437] transition-colors">
              {post.content ? (
                <PortableText 
                   value={post.content} 
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

            {/* Premium CTA Box within context */}
            <div className="mt-24 bg-gradient-to-br from-[#006437] to-[#00381f] rounded-[2rem] p-10 md:p-16 text-center shadow-xl relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A96E]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C8A96E]/30 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <span className="text-[#C8A96E] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Take the next step</span>
                <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">Inspired to Build Your Legacy?</h3>
                <p className="text-white/70 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light">
                  Join India&apos;s fastest-growing tea franchise network and bring the authenticated T Vanamm experience to your city.
                </p>
                <Link href="/#franchise-enquiry" className="inline-flex items-center justify-center gap-3 bg-white hover:bg-[#C8A96E] text-[#006437] hover:text-white px-10 py-5 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm tracking-widest uppercase">
                  Explore Ownership
                </Link>
              </div>
            </div>

          </div>
        </div>
      </article>
    </>
  );
}
