'use server';

import { client } from '@/lib/sanity/client';
import { revalidatePath } from 'next/cache';

// Helper to convert simple text into basic Portable Text blocks
function convertTextToPortableText(text: string) {
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  return paragraphs.map((p, index) => ({
    _type: 'block',
    style: 'normal',
    _key: `block-${index}-${Date.now()}`,
    markDefs: [],
    children: [
      {
        _type: 'span',
        marks: [],
        text: p,
      }
    ]
  }));
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const excerpt = formData.get('excerpt') as string;
    const bodyContent = formData.get('body') as string;
    const thumbnailAssetId = formData.get('thumbnailAssetId') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const ogImageAssetId = formData.get('ogImageAssetId') as string;
    
    // Generate slug safely
    const slugValue = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newPost = {
      _type: 'blogPost',
      title,
      slug: {
        _type: 'slug',
        current: slugValue,
      },
      category,
      excerpt,
      author,
      publishedAt: new Date().toISOString(),
      featured: false,
      body: convertTextToPortableText(bodyContent),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
    };

    if (thumbnailAssetId) {
      (newPost as Record<string, unknown>).thumbnail = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: thumbnailAssetId
        }
      };
    }

    if (ogImageAssetId) {
      (newPost as Record<string, unknown>).ogImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: ogImageAssetId
        }
      };
    }

    await client.create(newPost);
    revalidatePath('/blog');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error creating blog post:', error);
    return { error: (error as Error).message || 'Failed to create blog post' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await client.delete(id);
    revalidatePath('/blog');
    revalidatePath('/marketingdashboard/blogs');
    return { success: true };
  } catch (err: unknown) {
    console.error(err);
    return { error: 'Failed to delete' };
  }
}
