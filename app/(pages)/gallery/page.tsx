import { GalleryClient } from '@/components/sections/GalleryClient';
import { getGalleryPage } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getGalleryPage();
  return {
    title: data?.metaTitle || 'Gallery | T Vanamm Outlets & Products',
    description: data?.metaDescription || 'Browse photos and videos of T Vanamm outlets, premium tea products, and successful franchise owners across India.',
  };
}

export default async function GalleryPage() {
  const data = await getGalleryPage();
  
  // Transform sanity images using urlFor
  const formattedImages = data?.images?.map((img: Record<string, unknown>, i: number) => ({
    id: img._key || `img-${i}`,
    category: (img.categoryTag as string) || 'Outlets',
    src: img.image ? urlFor(img.image as Record<string, unknown>).url() : '',
    title: img.title || img.altText || `Gallery image ${i}`,
  })).filter((img: { src: string }) => img.src).reverse() || []; // Reverse to show newest first

  return (
    <GalleryClient 
      initialImages={formattedImages} 
      initialVideos={data?.videos || []} 
    />
  );
}
