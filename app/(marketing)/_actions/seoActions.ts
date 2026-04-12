'use server';

import { client } from '@/lib/sanity/client';
import { revalidatePath } from 'next/cache';

export async function updateSeoSettings(formData: FormData) {
  try {
    const defaultSeoTitle = formData.get('defaultSeoTitle') as string;
    const defaultSeoDescription = formData.get('defaultSeoDescription') as string;
    const seoKeywordsString = formData.get('seoKeywords') as string;
    const ogImageAssetId = formData.get('ogImageAssetId') as string;

    const seoKeywords = seoKeywordsString 
      ? seoKeywordsString.split('\n').map(k => k.trim()).filter(Boolean) 
      : [];

    const updates: any = {
      defaultSeoTitle,
      defaultSeoDescription,
      seoKeywords
    };

    if (ogImageAssetId) {
      updates.defaultOgImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: ogImageAssetId
        }
      };
    }

    await client.patch('siteSettings')
      .set(updates)
      .commit();

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating SEO:', error);
    return { error: 'Failed to update SEO settings' };
  }
}
